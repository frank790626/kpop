/**
 * 我的最愛：一律先存在這台裝置的瀏覽器 localStorage；
 * 用 Google 登入後由 cloud-sync.js 同步到 Firestore（沒設定 Firebase 時就只有本機）。
 *
 * 每筆收藏都有固定的 key，之後接雲端同步時可以直接沿用：
 *   group  → 'g:<groupId>'
 *   member → 'm:<groupId>/<memberId>'
 *   video  → 'v:<youtubeId>'
 * 另外存一份 snapshot（名稱、標題等），影片被擠出熱門清單或資料改版時，收藏頁仍然顯示得出來。
 * 注意：團體與成員的 id 一旦上線就不要改，否則大家的收藏會對不上。
 */
import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'kpop:favorites:v1';
const EMPTY = [];

let cache = null;
const listeners = new Set();
let remoteWriter = null; // 登入後由 cloud-sync.js 接上：本機有變動就寫回雲端

function read() {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    cache = Array.isArray(parsed?.items) ? parsed.items : EMPTY;
  } catch {
    cache = EMPTY; // 無痕模式或被封鎖時照樣能用，只是不會存下來
  }
  return cache;
}

function write(items, { fromRemote = false } = {}) {
  cache = items;
  if (!fromRemote && remoteWriter) remoteWriter(items);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items }));
  } catch {
    // 存不進去（空間滿、無痕模式）就只留在這次瀏覽的記憶體裡
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  // 其他分頁改了收藏，這個分頁也跟著更新
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      fn();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

const TYPES = new Set(['group', 'member', 'video']);

/** 雲端來的資料不一定可靠（舊版本、手動改過），只留格式正確的 */
export function sanitizeItems(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((x) => {
    if (!x || !TYPES.has(x.type) || typeof x.key !== 'string' || seen.has(x.key)) return false;
    seen.add(x.key);
    return true;
  });
}

/**
 * 合併兩份收藏：保留 primary（雲端）的順序（使用者可能自訂過排序），
 * 只在 secondary（本機）才有的收藏加到最前面，就像剛收藏的一樣
 */
export function mergeItems(primary, secondary) {
  const main = sanitizeItems(primary);
  const keys = new Set(main.map((x) => x.key));
  return [...sanitizeItems(secondary).filter((x) => !keys.has(x.key)), ...main];
}

export const localItems = () => read();
export const replaceAll = (items) => write(sanitizeItems(items), { fromRemote: true });
export function connectRemote(writer) {
  remoteWriter = writer;
}
export function disconnectRemote() {
  remoteWriter = null;
}

export const favKey = {
  group: (group) => `g:${group.id}`,
  member: (group, member) => `m:${group.id}/${member.id}`,
  video: (video) => `v:${video.youtubeId}`
};

/** 收藏時一起存下的顯示資料 */
export const favSnapshot = {
  group: (group) => ({ groupId: group.id, name: group.name }),
  member: (group, member) => ({
    groupId: group.id,
    memberId: member.id,
    name: member.stageName,
    groupName: group.name,
    color: member.color
  }),
  video: (video, group) => ({
    youtubeId: video.youtubeId,
    title: video.title,
    date: video.date || '',
    kind: video.kind || '',
    noEmbed: !!video.noEmbed,
    groupId: group?.id || '',
    groupName: group?.name || ''
  })
};

export function toggleFavorite(type, key, snapshot) {
  const current = read();
  if (current.some((x) => x.key === key)) {
    write(current.filter((x) => x.key !== key));
  } else {
    write([{ type, key, addedAt: new Date().toISOString(), snapshot }, ...current]);
  }
}

/**
 * 自訂排序：把某一類（團體／成員／影片）的收藏改成 orderedKeys 的順序。
 * 其他類別的位置不動，所以整份清單的順序就是各類別自己的順序。
 */
export function reorderFavorites(type, orderedKeys) {
  const current = read();
  const byKey = new Map(current.map((x) => [x.key, x]));
  const next = orderedKeys.map((k) => byKey.get(k)).filter((x) => x && x.type === type);
  const rest = current.filter((x) => x.type === type && !orderedKeys.includes(x.key));
  const queue = [...next, ...rest];
  write(current.map((x) => (x.type === type ? queue.shift() : x)));
}

export function removeFavorite(key) {
  write(read().filter((x) => x.key !== key));
}

export function useFavorites() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  const has = useCallback((key) => items.some((x) => x.key === key), [items]);

  return { items, has, toggle: toggleFavorite, remove: removeFavorite, reorder: reorderFavorites };
}
