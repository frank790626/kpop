/**
 * 我的最愛雲端同步：Google 登入（Firebase Auth）＋ Firestore。
 *
 * 資料：一個使用者一份文件 users/{uid} = { items: [...收藏], updatedAt }
 * 規則：
 *   - 這台裝置第一次用某個帳號登入 → 本機收藏和雲端「合併」，不會弄丟任何一邊
 *   - 之後以雲端為準（在別台裝置刪掉的，這裡也會消失）；每次回到分頁時重新抓一次
 *   - 本機收藏有變動 → 稍等一下再整份寫回雲端
 *   - 登出 → 清掉這台裝置的收藏（資料都在雲端，下次登入就回來），避免共用裝置時被下一個人看到
 * 用 firestore/lite（沒有即時監聽，但小很多），跨裝置同步靠「回到分頁時重新抓」。
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebase-config.js';
import { setAccount } from './account.js';
import { connectRemote, disconnectRemote, localItems, mergeItems, replaceAll, sanitizeItems } from './favorites.js';

const SYNCED_KEY = 'kpop:favorites:synced-uid';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let uid = null;
let pushTimer = null;

const userDoc = (id) => doc(db, 'users', id);

const storage = {
  get: (k) => {
    try { return window.localStorage.getItem(k); } catch { return null; }
  },
  set: (k, v) => {
    try { v == null ? window.localStorage.removeItem(k) : window.localStorage.setItem(k, v); } catch { /* 無痕模式 */ }
  }
};

async function push(id, items) {
  setAccount({ syncing: true });
  try {
    await setDoc(userDoc(id), { items, updatedAt: serverTimestamp() });
    setAccount({ syncing: false, error: '' });
  } catch (err) {
    setAccount({ syncing: false, error: `同步失敗：${err.message}` });
  }
}

async function pull(id) {
  setAccount({ syncing: true });
  try {
    const snap = await getDoc(userDoc(id));
    if (uid !== id) return; // 抓的途中已經登出或換帳號
    const remote = sanitizeItems(snap.exists() ? snap.data().items : []);
    const firstTime = storage.get(SYNCED_KEY) !== id;
    const next = firstTime ? mergeItems(remote, localItems()) : remote;
    replaceAll(next);
    if (firstTime || !snap.exists()) await push(id, next);
    storage.set(SYNCED_KEY, id);
    setAccount({ syncing: false, error: '' });
  } catch (err) {
    setAccount({ syncing: false, error: `同步失敗：${err.message}` });
  }
}

function onVisible() {
  if (document.visibilityState === 'visible' && uid) pull(uid);
}

export function start() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      uid = null;
      disconnectRemote();
      setAccount({ status: 'signedOut', user: null, syncing: false });
      return;
    }
    uid = user.uid;
    setAccount({
      status: 'signedIn',
      user: { name: user.displayName || user.email || 'Google 帳號', photo: user.photoURL || '', email: user.email || '' }
    });
    await pull(user.uid);
    // 本機有變動就寫回雲端（連續點好幾下只寫一次）
    connectRemote((items) => {
      clearTimeout(pushTimer);
      const id = uid;
      pushTimer = setTimeout(() => id && push(id, items), 600);
    });
  });
  document.addEventListener('visibilitychange', onVisible);
}

const FRIENDLY = {
  'auth/popup-blocked': '瀏覽器擋住了登入視窗，請允許彈出視窗後再試一次。',
  'auth/unauthorized-domain': '這個網址還沒加進 Firebase 的授權網域（Authentication → 設定 → 授權網域）。',
  'auth/network-request-failed': '網路連線失敗，請稍後再試。',
  'auth/operation-not-allowed': 'Firebase 還沒啟用 Google 登入（Authentication → 登入方式）。'
};

export async function signIn() {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
    setAccount({ error: FRIENDLY[err.code] || `登入失敗：${err.message}` });
  }
}

export async function signOutAccount() {
  clearTimeout(pushTimer);
  // 還沒寫完的變動先送出去再登出
  if (uid) await push(uid, localItems());
  disconnectRemote();
  await signOut(auth);
  storage.set(SYNCED_KEY, null);
  replaceAll([]);
}
