/**
 * 從 Wikipedia／Wikimedia Commons 抓成員照片當頭像
 *
 * 流程（每位成員）：
 *   1. 依序嘗試候選條目：資料檔的 wiki 欄位 → 本名 → 藝名 (singer) → 站內搜尋
 *   2. 用條目摘要確認「真的是這個人」：必須提到團名與成員名、看起來是人物條目、
 *      而且不是團體本身的條目（避免抓到團體合照）
 *   3. 只接受放在 Wikimedia Commons 的圖片（自由授權）；英文維基本地的
 *      「合理使用」非自由圖一律跳過
 *   4. 下載 480px 縮圖到 assets/img/wiki/，並從 Commons 取得作者與授權
 *
 * 產出：assets/img/<團體id>-<成員id>.<副檔名>
 *       assets/img/credits.json（每張照片的作者與授權，網站用來標註出處）
 *
 * 這是一次性的工具，不在每日排程裡：新增團體後到 Actions 手動執行
 * 「Fetch member photos」即可。已經有照片的成員不會重抓；加 --refresh 可強制全部重來。
 */
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const GROUPS_DIR = 'src/data/groups';
const IMG_DIR = 'assets/img';
const OUT = 'assets/img/credits.json';
const REFRESH = process.argv.includes('--refresh');

// Wikimedia 要求帶可辨識的 User-Agent
const UA = 'kpop-hub/1.0 (https://github.com/frank790626/kpop; fan site avatar fetcher)';
const PERSON = /\b(singer|rapper|dancer|idol|entertainer|actress|musician|member)\b/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  await sleep(120); // 對維基客氣一點
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = (s) => new RegExp(`\\b${escapeRe(s)}\\b`, 'i');
const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

async function summary(title) {
  const t = encodeURIComponent(title.replace(/ /g, '_'));
  return getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${t}?redirect=true`);
}

async function search(query) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=3' +
    `&srsearch=${encodeURIComponent(query)}`;
  const data = await getJson(url);
  return (data?.query?.search || []).map((r) => r.title);
}

/** 摘要是否確定是這位成員本人 */
function isThisMember(s, group, member) {
  if (!s || s.type !== 'standard') return false;
  const text = `${s.description || ''} ${s.extract || ''}`;

  // 不能是團體本身的條目
  const bare = (s.title || '').replace(/\s*\(.*\)$/, '').toLowerCase();
  if (bare === group.name.toLowerCase()) return false;

  if (!wordRe(group.name).test(text)) return false;
  if (!PERSON.test(s.description || s.extract || '')) return false;

  // 藝名或本名其中一個要出現在摘要或標題裡
  const nameHints = [member.stageName, member.nameEn, ...(member.stageName || '').split(/\s+/)]
    .filter((n) => n && n.length >= 3);
  const hay = `${s.title} ${text}`;
  return nameHints.some((n) => wordRe(n).test(hay) || hay.toLowerCase().includes(n.toLowerCase()));
}

// 維基 API 會在圖片網址後加 ?utm_source=... 之類的參數，解析前一律去掉
const stripQuery = (url) => String(url || '').split('?')[0];

/** 只接受 Commons 上的圖；回傳 { thumb, original, fileName } */
function commonsImage(s) {
  const original = stripQuery(s.originalimage?.source);
  const thumb = stripQuery(s.thumbnail?.source);
  if (!original.includes('/wikipedia/commons/')) return null; // 非自由圖（en 本地）直接略過
  const fileName = decodeURIComponent(original.split('/').pop());
  if (!/\.(jpe?g|png|webp)$/i.test(fileName)) return null;
  return { thumb, original, fileName };
}

/** 用檔頭確認下載到的真的是圖片，而不是錯誤頁 */
function isImage(buf) {
  if (buf.length < 2000) return false;
  const hex = buf.subarray(0, 4).toString('hex');
  return hex.startsWith('ffd8') || hex === '89504e47' || buf.subarray(8, 12).toString() === 'WEBP';
}

async function commonsCredit(fileName) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
    `&iiprop=extmetadata|url&titles=${encodeURIComponent('File:' + fileName)}`;
  const data = await getJson(url);
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  const meta = info?.extmetadata || {};
  const strip = (html) => String(html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const artist = strip(meta.Artist?.value);
  const license = strip(meta.LicenseShortName?.value);
  if (!artist || !license) return null;
  return {
    artist,
    license,
    licenseUrl: meta.LicenseUrl?.value || '',
    source: info?.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`
  };
}

async function download(urls, dest) {
  for (const url of urls) {
    if (!url) continue;
    await sleep(120);
    const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!isImage(buf)) continue;
    await writeFile(dest, buf);
    return true;
  }
  return false;
}

async function findArticle(group, member) {
  const tried = new Set();
  const candidates = [
    member.wiki,
    member.nameEn,
    member.stageName && `${titleCase(member.stageName)} (singer)`,
    member.stageName && titleCase(member.stageName)
  ].filter(Boolean);

  const check = async (title) => {
    if (tried.has(title)) return null;
    tried.add(title);
    const s = await summary(title);
    return isThisMember(s, group, member) && commonsImage(s) ? s : null;
  };

  for (const title of candidates) {
    const hit = await check(title);
    if (hit) return hit;
  }
  for (const q of [`${member.nameEn} ${group.name}`, `${member.stageName} ${group.name}`]) {
    for (const title of await search(q)) {
      const hit = await check(title);
      if (hit) return hit;
    }
  }
  return null;
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const previous = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{"photos":{}}'));
  const photos = { ...(previous.photos || {}) };
  const files = (await readdir(GROUPS_DIR)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
  let found = 0;
  let missing = 0;

  for (const file of files) {
    const group = (await import(pathToFileURL(path.resolve(GROUPS_DIR, file)).href)).default;
    console.log(`\n【${group.name}】`);

    for (const member of group.members || []) {
      const key = `${group.id}/${member.id}`;
      const existing = photos[key];
      if (!REFRESH && existing && (await exists(existing.src))) {
        console.log(`  = ${member.stageName}：已有照片，略過`);
        found += 1;
        continue;
      }

      try {
        const article = await findArticle(group, member);
        if (!article) {
          console.log(`  - ${member.stageName}：找不到有自由授權照片的個人條目`);
          delete photos[key];
          missing += 1;
          continue;
        }

        const img = commonsImage(article);

        // 先確認拿得到作者與授權：CC 授權必須標註，拿不到就不使用
        const credit = await commonsCredit(img.fileName);
        if (!credit) {
          console.log(`  ! ${member.stageName}：查不到作者或授權，為了合規不使用（${img.fileName}）`);
          delete photos[key];
          missing += 1;
          continue;
        }

        const ext = path.extname(img.fileName).toLowerCase().replace('.jpeg', '.jpg');
        const dest = path.join(IMG_DIR, `${group.id}-${member.id}${ext}`);
        const filePath = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.fileName)}?width=400`;
        if (!(await download([filePath, img.thumb, img.original], dest))) {
          console.log(`  ! ${member.stageName}：圖片下載失敗`);
          missing += 1;
          continue;
        }

        photos[key] = {
          src: dest.split(path.sep).join('/'),
          article: article.title,
          articleUrl: article.content_urls?.desktop?.page || '',
          ...credit
        };
        console.log(`  ✓ ${member.stageName} ← ${article.title}（${credit.license}，${credit.artist}）`);
        found += 1;
      } catch (err) {
        console.warn(`  ? ${member.stageName}：${err.message}`);
        missing += 1;
      }
    }
  }

  const sorted = Object.fromEntries(Object.entries(photos).sort(([a], [b]) => a.localeCompare(b)));
  const next = { updatedAt: new Date().toISOString().slice(0, 10), photos: sorted };
  if (JSON.stringify(previous.photos || {}) !== JSON.stringify(sorted)) {
    await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`\n寫入 ${OUT}`);
  }
  console.log(`\n共 ${found} 位有照片，${missing} 位沒有`);
}

main();
