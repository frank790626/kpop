/**
 * 登入狀態（Google 帳號）。真正的 Firebase 程式在 cloud-sync.js，
 * 等頁面顯示完才載入，沒設定 Firebase 時完全不載入，不拖慢首頁。
 */
import { useSyncExternalStore } from 'react';
import { firebaseEnabled } from './firebase-config.js';

// status：disabled（沒設定 Firebase）｜loading｜signedOut｜signedIn
let state = { status: firebaseEnabled ? 'loading' : 'disabled', user: null, error: '', syncing: false };
const listeners = new Set();
let syncModule = null;

export function setAccount(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}

export function useAccount() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
    () => state
  );
}

function loadSync() {
  if (!syncModule) syncModule = import('./cloud-sync.js');
  return syncModule;
}

/** 頁面載入後呼叫：恢復上次的登入狀態 */
export function startAccount() {
  if (!firebaseEnabled) return;
  const run = () =>
    loadSync()
      .then((m) => m.start())
      .catch((err) => setAccount({ status: 'signedOut', error: `雲端同步載入失敗：${err.message}` }));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 300);
}

/** LINE、Instagram、Facebook 的內建瀏覽器，Google 不允許在裡面登入 */
export const inAppBrowser = /\bLine\/|FBAN|FBAV|Instagram/i.test(typeof navigator === 'undefined' ? '' : navigator.userAgent);

export async function signIn() {
  setAccount({ error: '' });
  return (await loadSync()).signIn();
}

export async function signOutAccount() {
  return (await loadSync()).signOutAccount();
}
