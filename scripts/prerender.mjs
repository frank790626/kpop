/**
 * 建置後處理：替每個團體、每位成員各產生一個真正的 HTML 頁面，讓 Google 搜得到。
 *
 *   dist/index.html                 首頁
 *   dist/<group>/index.html         團體頁
 *   dist/<group>/<member>/index.html 成員頁（個人歌手只有團體頁）
 *   dist/404.html                   不存在的網址（前端會導回首頁）
 *   dist/sitemap.xml                給 Google Search Console 提交用
 *
 * 每頁都有自己的標題、描述、分享預覽，並在 #root 裡預先放一份純文字內容：
 * 搜尋引擎和社群預覽不用執行 JavaScript 也讀得到，React 載入後會直接換成完整畫面。
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_NAME, SITE_ALT_NAMES, GOOGLE_SITE_VERIFICATION, pageMeta, pagePath } from '../src/lib/site.js';

const DIST = 'dist';
const GROUPS_DIR = 'src/data/groups';
const GENERATED_DIR = 'src/data/generated';
// 網站的完整網址（結尾要有 /）。部署時由 workflow 依 repo 名稱帶入
const SITE_URL = (process.env.SITE_URL || 'https://frank790626.github.io/kpop/').replace(/\/?$/, '/');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8').catch(() => 'null'));

async function loadGroups() {
  const files = (await readdir(GROUPS_DIR)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
  const credits = (await readJson('assets/img/credits.json'))?.photos || {};
  const groups = [];
  for (const f of files) {
    const g = { ...(await import(pathToFileURL(path.resolve(GROUPS_DIR, f)).href)).default };
    if (!g?.name) continue;
    g.members = (g.members || []).map((m) => ({ ...m, image: m.photo || credits[`${g.id}/${m.id}`]?.src || '' }));
    const gen = await readJson(path.join(GENERATED_DIR, `${g.id}-videos.json`));
    if (gen?.videos?.length) g.videos = gen.videos;
    groups.push(g);
  }
  return groups.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name));
}

const absUrl = (p) => (!p ? '' : /^https?:/.test(p) ? p : `${SITE_URL}${p.replace(/^\//, '')}`);

/** 預先放進 #root 的純文字內容 */
function staticBody(groups, group, member) {
  const nav = `<nav aria-label="團體"><a href="${esc(SITE_URL)}">${esc(SITE_NAME)}</a>${groups
    .map((g) => ` · <a href="${esc(absUrl(pagePath(g)))}">${esc(g.name)}</a>`)
    .join('')}</nav>`;

  if (!group) {
    return `${nav}<h1>${esc(SITE_NAME)}</h1><p>${esc(pageMeta({ groups }).description)}</p><ul>${groups
      .map((g) => `<li><a href="${esc(absUrl(pagePath(g)))}">${esc(g.name)}</a>：${esc(g.tagline || '')}</li>`)
      .join('')}</ul>`;
  }

  const solo = group.type === 'solo';
  const focus = member && !solo ? member : null;
  const parts = [nav];
  if (focus) {
    parts.push(
      `<h1>${esc(group.name)} ${esc(focus.stageName)}${focus.nameKo ? `（${esc(focus.nameKo)}）` : ''}</h1>`,
      `<p>${esc(focus.bio || '')}</p>`,
      `<ul>${[
        focus.nameEn && `本名：${focus.nameEn}`,
        focus.birth && `生日：${focus.birth}`,
        focus.nationality && `國籍：${focus.nationality}`,
        focus.roles?.length && `定位：${focus.roles.join('、')}`
      ]
        .filter(Boolean)
        .map((x) => `<li>${esc(x)}</li>`)
        .join('')}</ul>`
    );
  } else {
    parts.push(
      `<h1>${esc(group.name)}${group.nameKo ? `（${esc(group.nameKo)}）` : ''}</h1>`,
      `<p>${esc(group.tagline || '')}</p>`,
      ...(group.intro || []).map((p) => `<p>${esc(p)}</p>`)
    );
  }
  if (!solo) {
    parts.push(
      `<h2>${esc(group.name)} 成員</h2><ul>${group.members
        .map((m) => `<li><a href="${esc(absUrl(pagePath(group, m)))}">${esc(m.stageName)}</a>${m.nameKo ? `（${esc(m.nameKo)}）` : ''}</li>`)
        .join('')}</ul>`
    );
  }
  if (group.videos?.length) {
    parts.push(
      `<h2>${esc(group.name)} 熱門 MV</h2><ul>${group.videos
        .map((v) => `<li><a href="https://www.youtube.com/watch?v=${esc(v.youtubeId)}">${esc(v.title)}</a>${v.date ? `（${esc(v.date)}）` : ''}</li>`)
        .join('')}</ul>`
    );
  }
  return parts.join('');
}

function render(template, groups, group, member, { noindex = false } = {}) {
  const { title, description } = pageMeta({ groups, group, member });
  const url = absUrl(pagePath(group, member));
  const image = absUrl((member || group?.members?.[0])?.image || groups[0]?.members?.[0]?.image);

  const head = [
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    image && `<meta property="og:image" content="${esc(image)}">`,
    noindex && '<meta name="robots" content="noindex">',
    GOOGLE_SITE_VERIFICATION && `<meta name="google-site-verification" content="${esc(GOOGLE_SITE_VERIFICATION)}">`,
    !group &&
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: SITE_URL,
        inLanguage: 'zh-Hant'
      })}</script>`
  ]
    .filter(Boolean)
    .join('\n');

  const replaced = template
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, (_, a) => a + esc(description))
    .replace(/(<meta property="og:title" content=")[^"]*/, (_, a) => a + esc(title))
    .replace(/(<meta property="og:description" content=")[^"]*/, (_, a) => a + esc(description))
    .replace('</head>', () => `${head}\n</head>`)
    .replace('<div id="root"></div>', () => `<div id="root"><div class="prerender wrap">${staticBody(groups, group, member)}</div></div>`);

  for (const marker of ['<title>', 'name="description"', 'property="og:title"', '<div id="root"><div class="prerender']) {
    if (!replaced.includes(marker)) throw new Error(`dist/index.html 找不到 ${marker}，prerender 無法套用`);
  }
  return replaced;
}

async function writePage(rel, html) {
  const file = path.join(DIST, rel, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
const groups = await loadGroups();
const urls = [''];

await writePage('', render(template, groups, null, null));
await writeFile(path.join(DIST, '404.html'), render(template, groups, null, null, { noindex: true }));

for (const g of groups) {
  await writePage(pagePath(g), render(template, groups, g, null));
  urls.push(pagePath(g));
  if (g.type === 'solo') continue;
  for (const m of g.members) {
    await writePage(pagePath(g, m), render(template, groups, g, m));
    urls.push(pagePath(g, m));
  }
}

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(absUrl(u) || SITE_URL)}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);

console.log(`prerendered ${urls.length} pages + 404.html + sitemap.xml（${SITE_URL}）`);
