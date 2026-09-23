/**
 * 每 6 小時由 GitHub Actions 執行：用官方 Threads API 搜尋各團體的熱門貼文，
 * 寫進 src/data/generated/<id>-threads.json，網頁直接把內容顯示成卡片（不用連出去）。
 *
 * 需要 GitHub Secret：THREADS_ACCESS_TOKEN（Threads 長效存取權杖）
 *   - App 必須有 threads_basic 與 threads_keyword_search 權限。
 *   - threads_keyword_search 通過 Meta 審核（Advanced Access）前，只搜得到權杖主人自己的貼文。
 *   - 長效權杖 60 天到期；每次執行會順便延長，快到期時 log 會出現警告。
 * 沒設 Secret 就直接略過，網站上的 Threads 區塊會自動隱藏。
 *
 * 搜尋關鍵字預設是團名；資料檔可以用 threadsQuery 指定（例：'아이유 IU'）。
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TOKEN = process.env.THREADS_ACCESS_TOKEN;
const API = 'https://graph.threads.net/v1.0';
const GROUPS_DIR = 'src/data/groups';
const OUT_DIR = 'src/data/generated';
const MAX_POSTS = 9;
const FIELDS = 'id,text,media_type,media_url,thumbnail_url,permalink,timestamp,username,is_reply,is_quote_post';

const warn = (msg) => console.log(`::warning::${msg}`);

async function api(endpoint, params) {
  const url = `${API}/${endpoint}?${new URLSearchParams({ ...params, access_token: TOKEN })}`;
  let lastErr;
  for (let i = 0; i < 3; i += 1) {
    try {
      const res = await fetch(url);
      const body = await res.json().catch(() => ({}));
      if (res.ok) return body;
      // 權杖失效（code 190）或沒有權限：重試也沒用，其他團體也會一樣失敗
      const fatal = res.status === 401 || res.status === 403 || body?.error?.code === 190;
      if (fatal || res.status === 400) {
        throw Object.assign(new Error(body?.error?.message || `HTTP ${res.status}`), { fatal, noRetry: true });
      }
      lastErr = new Error(body?.error?.message || `HTTP ${res.status}`);
    } catch (err) {
      if (err.noRetry) throw err;
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
  }
  throw lastErr;
}

/** 長效權杖每次用都順便延長；剩不到 10 天就提醒更新 Secret */
async function refreshToken() {
  try {
    const url = `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${encodeURIComponent(TOKEN)}`;
    const body = await (await fetch(url)).json();
    if (body.expires_in) {
      const days = Math.floor(body.expires_in / 86400);
      console.log(`權杖有效期：約 ${days} 天`);
      if (days < 10) warn(`THREADS_ACCESS_TOKEN 剩約 ${days} 天到期，請重新產生並更新 GitHub Secret`);
      if (body.access_token && body.access_token !== TOKEN) {
        warn('Meta 發了新的權杖字串，請到 GitHub Settings → Secrets 更新 THREADS_ACCESS_TOKEN（舊的到期後會失效）');
      }
    } else if (body.error) {
      warn(`權杖延長失敗：${body.error.message}`);
    }
  } catch (err) {
    warn(`權杖延長失敗：${err.message}`);
  }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function mentionsGroup(text, group) {
  const names = [group.name, group.nameKo, ...(group.threadsAliases || [])].filter(Boolean).map(escapeRe);
  return new RegExp(`(?<![A-Za-z])(?:${names.join('|')})(?![A-Za-z])`, 'i').test(text || '');
}

async function postsFor(group) {
  const query = group.threadsQuery || group.name;
  const data = await api('keyword_search', { q: query, search_type: 'TOP', fields: FIELDS, limit: 25 });
  const seen = new Set();
  return (data.data || [])
    .filter((p) => p.text && !p.is_reply && mentionsGroup(p.text, group))
    .filter((p) => !seen.has(p.id) && seen.add(p.id))
    .slice(0, MAX_POSTS)
    .map((p) => ({
      id: p.id,
      username: p.username || '',
      text: p.text,
      timestamp: p.timestamp || '',
      mediaType: p.media_type || 'TEXT_POST',
      mediaUrl: p.media_type === 'VIDEO' || p.media_type === 'IMAGE' ? p.media_url || '' : '',
      thumbnailUrl: p.thumbnail_url || (p.media_type === 'IMAGE' ? p.media_url || '' : ''),
      permalink: p.permalink || ''
    }));
}

async function main() {
  if (!TOKEN) {
    console.log('沒有設定 THREADS_ACCESS_TOKEN，略過 Threads 更新');
    return;
  }
  await refreshToken();
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(GROUPS_DIR)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
  for (const file of files) {
    const group = (await import(pathToFileURL(path.resolve(GROUPS_DIR, file)).href)).default;
    if (!group?.id) continue;
    const out = path.join(OUT_DIR, `${group.id}-threads.json`);
    try {
      const posts = await postsFor(group);
      // 這次一篇都沒搜到就保留上次的結果，免得區塊忽然消失
      if (!posts.length) {
        console.log(`- ${group.id}：沒有搜到相關貼文，保留上次的結果`);
        continue;
      }
      const before = await readFile(out, 'utf8').catch(() => '');
      if (before && JSON.stringify(JSON.parse(before).posts) === JSON.stringify(posts)) {
        console.log(`- ${group.id}：沒有變化`);
        continue;
      }
      const payload = { groupId: group.id, updatedAt: new Date().toISOString(), posts };
      await writeFile(out, `${JSON.stringify(payload, null, 2)}\n`);
      console.log(`✓ ${group.id}：寫入 ${posts.length} 篇 → ${out}`);
    } catch (err) {
      warn(`✗ ${group.id} Threads：${err.message}`);
      if (err.fatal) break; // 權杖失效時每個團體都會失敗，不用一直打
    }
  }
}

main();
