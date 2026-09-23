/**
 * 從 Wikipedia／Wikimedia Commons 抓成員照片當頭像
 *
 * 流程（每位成員）：
 *   A. 先找英文維基的個人條目，取主圖
 *      1. 依序嘗試：資料檔的 wiki 欄位 → 本名 → 藝名 (singer) → 站內搜尋
 *      2. 用條目摘要確認「真的是這個人」：必須提到團名與成員名、是人物條目、
 *         而且不是團體本身的條目（避免抓到團體合照）
 *      3. 只接受放在 Wikimedia Commons 的圖（自由授權），英文維基本地的非自由圖一律跳過
 *   B. 沒有個人條目時，改到 Commons 的團體分類（例：Category:Babymonster）裡找
 *      檔名只寫著這位成員的照片；檔名同時出現其他成員名字的（雙人照、團體照）一律跳過
 *   C. 查不到作者或授權就不使用；下載後轉成 400px 寬的 JPEG
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
import sharp from 'sharp';

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

  // 不能是團體本身的條目（個人歌手的「團體」就是本人，不用排除）
  const bare = (s.title || '').replace(/\s*\(.*\)$/, '').toLowerCase();
  if (group.type !== 'solo' && bare === group.name.toLowerCase()) return false;

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
  const rawArtist = strip(meta.Artist?.value);
  const license = strip(meta.LicenseShortName?.value);
  if (!rawArtist || !license) return null;
  // 有些上傳者把來源網址填在作者欄（例：https://www.youtube.com/@_TV10 티비텐），拆成名稱與連結
  const artistUrl = rawArtist.match(/https?:\/\/\S+/)?.[0] || '';
  const artist = rawArtist.replace(/https?:\/\/\S+/g, '').trim() || (artistUrl ? new URL(artistUrl).hostname : rawArtist);
  return {
    artist,
    artistUrl,
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
    // 頭像最大只顯示約 150px，存成 400px 寬的 JPEG 就很夠，檔案小很多
    const jpg = await sharp(buf)
      .rotate()
      .resize({ width: 400, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    await writeFile(dest, jpg);
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

const categoryCache = new Map();

/** 列出 Commons 分類裡的檔案（含下一層子分類），同一團體只查一次 */
async function categoryFiles(category, depth = 1) {
  if (categoryCache.has(category)) return categoryCache.get(category);
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers' +
    `&cmtype=file|subcat&cmlimit=500&cmtitle=${encodeURIComponent('Category:' + category)}`;
  const items = (await getJson(url))?.query?.categorymembers || [];
  const files = items.filter((m) => m.ns === 6).map((m) => ({ title: m.title, category }));
  if (depth > 0) {
    for (const sub of items.filter((m) => m.ns === 14)) {
      files.push(...(await categoryFiles(sub.title.replace(/^Category:/, ''), depth - 1)));
    }
  }
  categoryCache.set(category, files);
  return files;
}

/** 找出團體在 Commons 上的分類名稱（大小寫與括號寫法各家不同，逐一試） */
async function groupCategoryFiles(group) {
  const variants = [
    group.commonsCategory,
    group.name,
    `${group.name} (group)`,
    titleCase(group.name),
    `${titleCase(group.name)} (group)`,
    `${titleCase(group.name)} (band)`
  ].filter(Boolean);
  for (const name of [...new Set(variants)]) {
    const files = await categoryFiles(name);
    if (files.length) return files;
  }
  return [];
}

// 比對用：去掉連字號、底線（An Yu-jin ↔ An Yujin、File_name ↔ File name）
const norm = (str) => String(str || '').replace(/-/g, '').replace(/_/g, ' ');

/** 成員可能出現在檔名裡的寫法：藝名、本名，以及其中 4 個字以上的單字（例：AN YUJIN → YUJIN） */
function nameKeys(member) {
  const full = [member.stageName, member.nameEn].filter(Boolean).map(norm);
  const words = full.flatMap((n) => n.split(/\s+/)).filter((w) => w.length >= 4);
  return [...new Set([...full, ...words])].filter((n) => n.length >= 3);
}

/** Commons 檔名搜尋：找檔名同時有成員名與團名的檔案（例：Shinyu of TWS at ...） */
async function searchCommons(group, member) {
  const titles = [];
  for (const key of nameKeys(member)) {
    const q = `intitle:"${key}" intitle:"${norm(group.name)}"`;
    const url =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=10' +
      `&srsearch=${encodeURIComponent(q)}`;
    for (const r of (await getJson(url))?.query?.search || []) titles.push({ title: r.title, category: '', searched: true });
    if (titles.length) break;
  }
  return titles;
}

/**
 * 在 Commons 找這位成員的個人照（團體分類＋檔名搜尋）：
 * 檔名（或所在子分類名）要有這位成員的名字，且不能出現其他成員的名字；
 * 搜尋來的檔案另外要求檔名裡有團名，避免抓到同名的其他人。
 */
async function findInCommonsCategory(group, member) {
  const files = [...(await groupCategoryFiles(group)), ...(await searchCommons(group, member))];
  const mine = nameKeys(member).map(wordRe);
  const others = (group.members || [])
    .filter((m) => m.id !== member.id)
    .flatMap((m) => nameKeys(m))
    .filter((k) => !nameKeys(member).includes(k))
    .map(wordRe);
  const groupRe = wordRe(norm(group.name));

  const seen = new Set();
  const candidates = files.filter(({ title, category, searched }) => {
    if (seen.has(title)) return false;
    seen.add(title);
    const base = norm(title.replace(/^File:/, '').replace(/\.[^.]+$/, ''));
    if (!/\.(jpe?g|png|webp)$/i.test(title)) return false;
    if (/\b(logo|group|members)\b/i.test(base)) return false;
    if (searched && !groupRe.test(base)) return false;
    // 個人歌手的分類本身就是本人，分類裡的檔案都算（藝名太短，例如 IU，檔名比對不可靠）
    if (group.type === 'solo' && !searched) return true;
    const inMemberCategory = category && mine.some((re) => re.test(norm(category))) && !others.some((re) => re.test(norm(category)));
    const namedInFile = mine.some((re) => re.test(base));
    if (!inMemberCategory && !namedInFile) return false;
    return !others.some((re) => re.test(base)); // 雙人照、團體照不要
  });

  // 成員專屬子分類裡的優先，其次檔名比較新的（檔名常帶日期）
  candidates.sort((a, b) => {
    const am = a.category && mine.some((re) => re.test(norm(a.category))) ? 0 : 1;
    const bm = b.category && mine.some((re) => re.test(norm(b.category))) ? 0 : 1;
    return am - bm || b.title.localeCompare(a.title);
  });
  return candidates.map((c) => c.title.replace(/^File:/, ''));
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
        // A. 維基個人條目的主圖
        const tries = [];
        const article = await findArticle(group, member);
        if (article) {
          const img = commonsImage(article);
          tries.push({ fileName: img.fileName, extra: [img.thumb, img.original], via: `條目 ${article.title}`, article });
        }
        // B. Commons 上的個人照（團體分類＋檔名搜尋）
        if (!tries.length) {
          for (const fileName of (await findInCommonsCategory(group, member)).slice(0, 5)) {
            tries.push({ fileName, extra: [], via: 'Commons' });
          }
        }

        let saved = null;
        for (const t of tries) {
          // 先確認拿得到作者與授權：CC 授權必須標註，拿不到就換下一張
          const credit = await commonsCredit(t.fileName);
          if (!credit) {
            console.log(`  ! ${member.stageName}：${t.fileName} 查不到作者或授權，跳過`);
            continue;
          }
          const dest = path.join(IMG_DIR, `${group.id}-${member.id}.jpg`);
          const filePath = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(t.fileName)}?width=400`;
          if (!(await download([filePath, ...t.extra], dest))) continue;
          saved = { t, credit, dest };
          break;
        }

        if (!saved) {
          console.log(`  - ${member.stageName}：維基條目與 Commons 都找不到可用的個人照`);
          delete photos[key];
          missing += 1;
          continue;
        }

        const { t, credit, dest } = saved;
        photos[key] = {
          src: dest.split(path.sep).join('/'),
          file: t.fileName,
          article: t.article?.title || '',
          articleUrl: t.article?.content_urls?.desktop?.page || '',
          ...credit
        };
        console.log(`  ✓ ${member.stageName} ← ${t.via}：${t.fileName}（${credit.license}，${credit.artist}）`);
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
