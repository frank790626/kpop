/**
 * 團體資料載入中心
 *
 * 自動掃描 src/data/groups/ 底下所有 .js（底線開頭的視為範本，會略過），
 * 所以新增團體只要新增一個檔案，不必再去改任何程式或 index.html。
 */

/** 頭像設定：Instagram 官方不允許直接連圖，透過代理服務取得大頭貼。
 *  代理失效時只要改這一行，全站頭像就會換來源。{handle} 會被替換成 IG 帳號。 */
export const config = {
  igAvatarProxy: 'https://unavatar.io/instagram/{handle}?fallback=false'
};

export function slug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 從網址或 @帳號 取出乾淨的 Instagram 帳號 */
export function igHandle(value) {
  if (!value) return '';
  const v = String(value).trim();
  const m = v.match(/instagram\.com\/([^/?#]+)/i);
  return m ? m[1] : v.replace(/^@/, '');
}

/** 帳號 → Instagram 個人頁網址 */
export function igUrl(value) {
  const handle = igHandle(value);
  return handle ? `https://www.instagram.com/${handle}/` : '';
}

/** 帳號 → 大頭貼圖片網址 */
export function igAvatar(value) {
  const handle = igHandle(value);
  return handle ? config.igAvatarProxy.replace('{handle}', encodeURIComponent(handle)) : '';
}

/**
 * 頭像來源優先序：
 *   1. photo（資料檔裡手動指定的照片或圖片網址）
 *   2. wikiPhoto（assets/img/ 裡從 Wikimedia Commons 下載的自由授權照片）
 *   3. Instagram 大頭貼
 *   4. 都沒有／都失敗 → 代表色漸層 + 名字首字母
 */
export function avatarSources(entity) {
  return [assetUrl(entity.photo), assetUrl(entity.wikiPhoto), igAvatar(entity.instagram)].filter(Boolean);
}

/** 站內圖片（assets/img/...）一律從網站根目錄算，子頁面（/kpop/nmixx/lily/）才不會找不到 */
export function assetUrl(src) {
  if (!src || /^(https?:|data:|\/)/.test(src)) return src || '';
  return `${import.meta.env.BASE_URL}${src}`;
}

/** 由生日推算目前年齡 */
export function ageFrom(birth) {
  const m = String(birth || '').match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return null;
  const b = new Date(+m[1], +m[2] - 1, +m[3]);
  const now = new Date();
  const age = now.getFullYear() - b.getFullYear();
  const before =
    now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
  return before ? age - 1 : age;
}

/** 把 YYYY.MM.DD / YYYY.MM 轉成可排序的數字 */
export function dateValue(text) {
  const m = String(text || '').match(/(\d{4})(?:[.\-/](\d{1,2}))?(?:[.\-/](\d{1,2}))?/);
  if (!m) return 0;
  return new Date(+m[1], (+m[2] || 1) - 1, +m[3] || 1).getTime();
}

/** 補齊預設值，讓資料檔可以只寫有把握的欄位 */
function normalizeGroup(raw) {
  const group = {
    id: slug(raw.name),
    name: '',
    nameKo: '',
    nameZh: '',
    agency: '',
    debut: '',
    debutNote: '',
    fandom: '',
    tagline: '',
    order: 100,
    intro: [],
    facts: [],
    links: {},
    members: [],
    videos: [],
    variety: [],
    varietyChannels: [],
    releases: [],
    videosUpdatedAt: '',
    varietyUpdatedAt: '',
    threads: [],
    threadsUpdatedAt: '',
    ...raw,
    theme: { accent: '#ff3d7f', accent2: '#8b5cf6', ...raw.theme }
  };

  group.members = (raw.members || []).map((m, i) => ({
    id: m.id || slug(m.stageName || `member-${i}`),
    stageName: '',
    nameKo: '',
    nameEn: '',
    nameZh: '',
    birth: '',
    nationality: '',
    roles: [],
    facts: [],
    bio: '',
    color: group.theme.accent,
    photo: '',
    instagram: '',
    ...m
  }));

  const video = (v, kind) => ({ title: '', youtubeId: '', date: '', badge: '', note: '', kind, ...v });

  group.videos = (raw.videos || []).map((v) => video(v, 'M/V'));
  group.variety = (raw.variety || []).map((v) => video(v, v.show || '綜藝'));

  return group;
}

const modules = import.meta.glob('../data/groups/*.js', { eager: true });

/**
 * 每天由 GitHub Actions（scripts/update-videos.mjs）產生的影片清單。
 * 有產生檔就用它取代資料檔裡手寫的 videos，沒有就維持原樣。
 */
const generated = import.meta.glob('../data/generated/*.json', { eager: true });

function generatedFor(groupId, kind) {
  const entry = Object.entries(generated).find(([path, mod]) => {
    const payload = mod.default || mod;
    return path.endsWith(`${kind}.json`) && payload.groupId === groupId;
  });
  const mod = entry?.[1];
  return mod ? mod.default || mod : null;
}

// scripts/fetch-wiki-photos.mjs 下載到 assets/img/ 的照片，以及各自的作者與授權
const photoFiles = import.meta.glob('/assets/img/credits.json', { eager: true });
const wikiPhotos = (() => {
  const mod = Object.values(photoFiles)[0];
  return (mod?.default || mod)?.photos || {};
})();

function applyGenerated(group) {
  group.members = group.members.map((m) => {
    const wiki = wikiPhotos[`${group.id}/${m.id}`];
    return wiki ? { ...m, wikiPhoto: wiki.src, photoCredit: wiki } : m;
  });

  const videos = generatedFor(group.id, 'videos');
  if (videos?.videos?.length) {
    group.videos = videos.videos;
    group.videosUpdatedAt = videos.updatedAt || '';
  }

  const variety = generatedFor(group.id, 'variety');
  if (variety?.videos?.length) {
    group.variety = variety.videos.map((v) => ({ ...v, kind: v.kind || v.show || '綜藝' }));
    group.varietyUpdatedAt = variety.updatedAt || '';
  }

  const threads = generatedFor(group.id, 'threads');
  if (threads?.posts?.length) {
    group.threads = threads.posts;
    group.threadsUpdatedAt = threads.updatedAt || '';
  }

  return group;
}

export const groups = Object.entries(modules)
  .filter(([path]) => !path.split('/').pop().startsWith('_'))
  .map(([path, mod]) => {
    if (!mod.default?.name) {
      console.warn(`[KPOP] ${path} 沒有 export default 或缺少 name，已略過`);
      return null;
    }
    return applyGenerated(normalizeGroup(mod.default));
  })
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export function getGroup(id) {
  return groups.find((g) => g.id === id) || null;
}
