/**
 * 每天更新各團體的影片清單
 *
 * 兩種模式，會自動判斷：
 *   1. 有 YOUTUBE_API_KEY（repo secret）→ 用 YouTube Data API 取得頻道所有影片的
 *      實際觀看數，挑出官方 M/V 依人氣排序，觀看數也會寫成徽章。
 *   2. 沒有 key → 改用頻道的公開 RSS（只有最新 15 支），把新出現的 M/V 併進
 *      資料檔原本的清單，不會把既有的內容弄丟。
 *
 * 另外會監看 varietyChannels 列出的電視台／節目頻道 RSS，
 * 把標題含團名的新片撿進綜藝清單（這部分不需要 API key）。
 *
 * 產出：src/data/generated/<團體id>-videos.json
 *       src/data/generated/<團體id>-variety.json
 * 網站啟動時若讀得到這些檔，就用它們取代資料檔裡的清單。
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const GROUPS_DIR = 'src/data/groups';
const OUT_DIR = 'src/data/generated';
const MAX_VIDEOS = 10;
const MAX_VARIETY = 8;

// 只要正片，排除幕後、預告等衍生內容
const EXCLUDE = /(MAKING FILM|TEASER|SPOILER|HIGHLIGHT|REACTION|BEHIND|ANNOUNCEMENT|CAM|SHORTS|EP\.\d|TRAILER)/i;
const IS_MV = /(M\/V|MUSIC VIDEO|PERFORMANCE VIDEO)/i;

function formatViews(count) {
  const n = Number(count);
  if (!Number.isFinite(n) || n <= 0) return '';
  if (n >= 1e8) return `${(n / 1e8).toFixed(1).replace(/\.0$/, '')} 億觀看`;
  if (n >= 1e4) return `${Math.round(n / 1e4)} 萬觀看`;
  return `${n} 次觀看`;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/** 把 M/V 標題整理成好看的歌名："BABYMONSTER - 'SHEESH' M/V" → SHEESH */
function cleanTitle(raw, groupName) {
  let t = raw;
  const quoted = t.match(/[‘'"“]([^’'"”]+)[’'"”]/);
  if (quoted) t = quoted[1];
  else t = t.replace(new RegExp(`^${groupName}\\s*[-–—]\\s*`, 'i'), '');
  return t.replace(/\s*(M\/V|OFFICIAL|MUSIC VIDEO)\s*/gi, ' ').replace(/\s+/g, ' ').trim() || raw;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; kpop-hub/1.0; +https://github.com/)' }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} — ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

/** 由頻道網址取得 channelId（RSS 需要） */
async function resolveChannelId(channelUrl) {
  const html = await fetchText(channelUrl);
  const m = html.match(/"(?:externalId|channelId)":"(UC[\w-]{20,})"/);
  if (!m) throw new Error(`在 ${channelUrl} 找不到 channelId`);
  return m[1];
}

/** 模式 1：YouTube Data API，可取得觀看數 */
async function fromApi(group, apiKey) {
  const handle = group.links.youtube.match(/@([^/?#]+)/)?.[1];
  const base = 'https://www.googleapis.com/youtube/v3';

  const ch = await fetchJson(
    `${base}/channels?part=contentDetails&forHandle=${encodeURIComponent('@' + handle)}&key=${apiKey}`
  );
  const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`找不到 @${handle} 的上傳清單`);

  // 最多翻 4 頁（200 支），足以涵蓋整個頻道的 M/V
  const ids = [];
  let pageToken = '';
  for (let page = 0; page < 4; page += 1) {
    const list = await fetchJson(
      `${base}/playlistItems?part=snippet&maxResults=50&playlistId=${uploads}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`
    );
    for (const item of list.items || []) {
      const title = item.snippet?.title || '';
      if (IS_MV.test(title) && !EXCLUDE.test(title)) ids.push(item.snippet.resourceId.videoId);
    }
    pageToken = list.nextPageToken;
    if (!pageToken) break;
  }
  if (!ids.length) throw new Error('沒有比對到任何 M/V');

  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50).join(',');
    const detail = await fetchJson(`${base}/videos?part=snippet,statistics&id=${chunk}&key=${apiKey}`);
    for (const v of detail.items || []) {
      videos.push({
        title: cleanTitle(v.snippet.title, group.name),
        youtubeId: v.id,
        date: formatDate(v.snippet.publishedAt),
        kind: 'M/V',
        badge: formatViews(v.statistics?.viewCount),
        note: '',
        views: Number(v.statistics?.viewCount || 0)
      });
    }
  }

  videos.sort((a, b) => b.views - a.views);
  return videos.slice(0, MAX_VIDEOS).map(({ views, ...rest }) => rest);
}

/** 模式 2：公開 RSS，沒有觀看數，只把新的 M/V 併進原本的清單 */
async function fromRss(group) {
  const channelId = await resolveChannelId(group.links.youtube);
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

  const found = [];
  for (const entry of xml.split('<entry>').slice(1)) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id || !title) continue;
    if (!IS_MV.test(title) || EXCLUDE.test(title)) continue;
    found.push({
      title: cleanTitle(title, group.name),
      youtubeId: id,
      date: formatDate(published),
      kind: 'M/V',
      badge: '',
      note: ''
    });
  }

  // 新的排前面，再接上資料檔原本手動整理的清單（保留徽章與說明）
  const existing = group.videos || [];
  const existingIds = new Set(existing.map((v) => v.youtubeId));
  const merged = [...found.filter((v) => !existingIds.has(v.youtubeId)), ...existing];
  return merged.slice(0, MAX_VIDEOS);
}

/** 節目標題通常是「內容｜節目名｜電視台 날짜 방송」，取第一段就好 */
function trimShowTitle(raw) {
  return raw.split(/[｜|]/)[0].replace(/\s+/g, ' ').trim() || raw;
}

/** 解析 RSS 的 entry */
function parseFeed(xml) {
  const author = xml.match(/<author>\s*<name>([^<]+)<\/name>/)?.[1]?.trim() || '';
  const entries = xml.split('<entry>').slice(1).map((entry) => ({
    youtubeId: entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '',
    title: entry.match(/<title>([^<]+)<\/title>/)?.[1] || '',
    published: entry.match(/<published>([^<]+)<\/published>/)?.[1] || ''
  }));
  return { author, entries };
}

/**
 * 綜藝片段：掃過 varietyChannels 的 RSS，撿出標題提到這個團體的影片。
 * 電視台頻道不是團體自己的頻道，所以只能用這種方式追蹤；
 * 單一頻道抓失敗不會影響其他頻道。
 */
async function varietyFromChannels(group) {
  const names = [group.name, group.nameKo].filter(Boolean).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const nameRe = new RegExp(names.join('|'), 'i');
  const found = [];

  for (const channel of group.varietyChannels || []) {
    try {
      const channelId = channel.startsWith('UC')
        ? channel
        : await resolveChannelId(`https://www.youtube.com/${channel}`);
      const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const { author, entries } = parseFeed(xml);

      for (const e of entries) {
        if (!e.youtubeId || !nameRe.test(e.title)) continue;
        if (/직캠|FANCAM/i.test(e.title)) continue;
        found.push({
          title: trimShowTitle(e.title),
          youtubeId: e.youtubeId,
          show: author,
          kind: author,
          date: formatDate(e.published),
          badge: '',
          note: ''
        });
      }
    } catch (err) {
      console.warn(`  ! 頻道 ${channel} 抓取失敗：${err.message}`);
    }
  }

  // 新撿到的排前面（新到舊），後面接資料檔裡手動整理的
  const curated = (group.variety || []).map((v) => ({ ...v, kind: v.kind || v.show || '綜藝' }));
  const curatedIds = new Set(curated.map((v) => v.youtubeId));
  const fresh = found
    .filter((v) => !curatedIds.has(v.youtubeId))
    .filter((v, i, arr) => arr.findIndex((x) => x.youtubeId === v.youtubeId) === i)
    .sort((a, b) => b.date.localeCompare(a.date));

  return [...fresh, ...curated].slice(0, MAX_VARIETY);
}

async function writeIfChanged(outPath, videos, label) {
  const payload = { groupId: label.groupId, updatedAt: new Date().toISOString().slice(0, 10), videos };
  const before = await readFile(outPath, 'utf8').catch(() => '');
  const beforeVideos = before ? JSON.stringify(JSON.parse(before).videos) : '';
  if (beforeVideos === JSON.stringify(videos)) {
    console.log(`- ${label.groupId} ${label.kind}：沒有變化`);
    return;
  }
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`✓ ${label.groupId} ${label.kind}：寫入 ${videos.length} 支 → ${outPath}`);
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  console.log(apiKey ? '模式：YouTube Data API（含觀看數）' : '模式：RSS（無 API key，只補新片）');

  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(GROUPS_DIR)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));

  for (const file of files) {
    const mod = await import(pathToFileURL(path.resolve(GROUPS_DIR, file)).href);
    const group = mod.default;
    if (!group?.links?.youtube?.includes('youtube.com/@')) {
      console.log(`- ${file}：沒有 @handle 形式的 YouTube 頻道，略過`);
      continue;
    }

    try {
      const videos = apiKey ? await fromApi(group, apiKey) : await fromRss(group);
      await writeIfChanged(path.join(OUT_DIR, `${group.id}-videos.json`), videos, {
        groupId: group.id,
        kind: '影片'
      });
    } catch (err) {
      // 單一團體失敗不該讓整個排程掛掉，網站會繼續用資料檔裡的清單
      console.error(`✗ ${group.id} 影片：${err.message}`);
      process.exitCode = 1;
    }

    if (group.varietyChannels?.length) {
      try {
        const variety = await varietyFromChannels(group);
        await writeIfChanged(path.join(OUT_DIR, `${group.id}-variety.json`), variety, {
          groupId: group.id,
          kind: '綜藝'
        });
      } catch (err) {
        console.error(`✗ ${group.id} 綜藝：${err.message}`);
        process.exitCode = 1;
      }
    }
  }
}

main();
