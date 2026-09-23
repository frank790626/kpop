/**
 * 網站名稱與每一頁的標題／描述。
 * 前端（App.jsx）和建置時的預先產生頁面（scripts/prerender.mjs）共用這支，
 * 所以這裡只能放純 JavaScript，不能用 import.meta.glob 之類 Vite 專屬語法。
 */

export const SITE_NAME = 'Frank 的私房 K-POP';
// 搜尋時常見的其他寫法，放進描述與結構化資料，讓不同打法都搜得到
export const SITE_ALT_NAMES = ['Frank的私房KPOP', 'Frank 私房 KPOP', "Frank's K-POP"];

// Google Search Console 的「HTML 標記」驗證碼：貼上 content="..." 裡的那串即可
export const GOOGLE_SITE_VERIFICATION = 'Agf-lnI56Icir3z1r3PRZqH0i1lBsqV3a2pQV2Ig9DQ';

/** 我的最愛頁的網址（/kpop/favorites/）；團體 id 不能用這個名字 */
export const FAVORITES_PATH = 'favorites';

/** 網址路徑（不含 base）：'' 首頁、'nmixx/' 團體頁、'nmixx/lily/' 成員頁 */
export function pagePath(group, member) {
  if (!group) return '';
  return member ? `${group.id}/${member.id}/` : `${group.id}/`;
}

const clip = (text, max = 150) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

const nameWithKo = (name, ko) => (ko ? `${name}（${ko}）` : name);

/** 各頁的 <title> 與 meta description */
export function pageMeta({ groups = [], group = null, member = null, favorites = false }) {
  if (favorites) {
    return {
      title: `我的最愛｜${SITE_NAME}`,
      description: `${SITE_NAME} 的我的最愛：收藏喜歡的團體、成員與影片，存在自己的瀏覽器裡，不用登入。`
    };
  }
  if (!group) {
    const names = groups.map((g) => g.name).join('、');
    return {
      title: `${SITE_NAME}｜K-POP 團體成員介紹、MV 與綜藝`,
      description: clip(
        `${SITE_NAME}（${SITE_ALT_NAMES[0]}）：${names} 的成員介紹、熱門 MV、綜藝片段與最新發行，每天自動更新。`,
        200
      )
    };
  }

  const solo = group.type === 'solo';
  if (member && !solo) {
    return {
      title: `${group.name} ${member.stageName} 個人介紹｜${SITE_NAME}`,
      description: clip(
        `${group.name} ${nameWithKo(member.stageName, member.nameKo)}${member.birth ? `，${member.birth} 出生` : ''}。${member.bio || ''}`
      )
    };
  }

  const members = (group.members || []).map((m) => m.stageName).join('、');
  return {
    title: `${group.name} ${solo ? '介紹' : '成員介紹'}、MV 與綜藝｜${SITE_NAME}`,
    description: clip(
      `${nameWithKo(group.name, group.nameKo)}${solo ? '' : ` 成員：${members}`}。${group.tagline || ''}熱門 MV、綜藝片段與最新發行一次看。`
    )
  };
}
