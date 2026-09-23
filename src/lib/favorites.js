/**
 * 我的最愛（免登入版）：存在這台裝置的瀏覽器 localStorage。
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

function write(items) {
  cache = items;
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

export function useFavorites() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  const has = useCallback((key) => items.some((x) => x.key === key), [items]);

  const toggle = useCallback((type, key, snapshot) => {
    const current = read();
    if (current.some((x) => x.key === key)) {
      write(current.filter((x) => x.key !== key));
    } else {
      write([{ type, key, addedAt: new Date().toISOString(), snapshot }, ...current]);
    }
  }, []);

  const remove = useCallback((key) => write(read().filter((x) => x.key !== key)), []);

  return { items, has, toggle, remove };
}
