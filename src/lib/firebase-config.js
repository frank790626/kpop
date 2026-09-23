/**
 * Firebase 設定（我的最愛雲端同步）。
 * 到 Firebase 主控台 → 專案設定 → 一般 → 你的應用程式（網頁）→ SDK 設定，把 firebaseConfig 的值貼進來。
 * 這些值本來就會出現在前端，不是密碼；真正保護資料的是 firestore.rules 的權限規則。
 * apiKey 或 projectId 留空時，同步功能自動關閉，網站照樣用瀏覽器本機的收藏。
 */
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: ''
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
