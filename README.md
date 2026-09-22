# K-POP HUB

一個純靜態的 K-POP 團體介紹網站，首發團體是 **BABYMONSTER**。
沒有任何建置流程與相依套件 — 直接打開 `index.html` 就能看。

## 功能

- **團體切換**：頁首的膠囊列，之後加入新團體會自動出現。
- **成員介紹**：頭像列一鍵切換，也支援鍵盤左右鍵；每位成員有代表色、角色標籤、生日（自動算年齡）、簡介與 Instagram 連結。
- **Instagram 大頭貼**：填了 IG 帳號就自動把該帳號的大頭貼當成頭像，抓不到會退回本地照片或代表色首字母頭像。
- **熱門影片**：依人氣排序的 YouTube 影片牆，點縮圖才載入 iframe（用 `youtube-nocookie.com`），不會一進站就拖慢速度。
- **官方社群**：Instagram / YouTube / X / TikTok / 官網連結卡。
- **作品年表**：專輯與單曲時間軸。
- **可分享網址**：`#/babymonster/ahyeon` 這種網址會直接開到指定成員。
- RWD、深色主題，主題色由各團體資料自訂；字體使用 Space Grotesk（英數標題）＋ Plus Jakarta Sans／Noto Sans TC（內文）。

## 本機預覽

```bash
python3 -m http.server 8000
# 開 http://localhost:8000
```

直接雙擊 `index.html` 也可以（沒有使用 ES module，不會被 file:// 擋住）。
部署到 GitHub Pages / Netlify / Vercel 時，整個資料夾就是網站根目錄。

## 目錄結構

```
index.html                 頁面外框 + 載入資料檔的地方
assets/css/style.css       全站樣式（主題色用 CSS 變數，由 JS 依團體注入）
assets/js/core.js          KPOP.register()：團體資料註冊中心
assets/js/app.js           路由與畫面渲染（新增團體不需要動這支）
assets/img/                成員照片放這裡
data/groups/babymonster.js BABYMONSTER 資料
data/groups/_template.js   新增團體用的範本（底線開頭 = 不會被載入）
```

## 新增一個團體

1. 複製範本：

   ```bash
   cp data/groups/_template.js data/groups/blackpink.js
   ```

2. 編輯 `data/groups/blackpink.js`，填入團名、成員、影片、社群連結等資料。
   欄位說明都寫在範本的註解裡；沒有的欄位可以整個刪掉，程式會自動補預設值。

3. 在 `index.html` 的「團體資料」區塊加一行：

   ```html
   <script src="data/groups/babymonster.js"></script>
   <script src="data/groups/blackpink.js"></script>   <!-- 新增這行 -->
   ```

   script 的順序就是頁首團體切換列的順序。完成，不需要改任何畫面程式。

## 資料怎麼填

| 欄位 | 說明 |
| --- | --- |
| `theme.accent` / `theme.accent2` | 團體主題色，會套用到漸層、按鈕、標籤 |
| `members[].color` | 成員代表色，沒放照片時會變成漸層頭像底色 |
| `members[].photo` | 照片路徑或圖片網址，例如 `assets/img/ahyeon.jpg`；優先度最高 |
| `members[].instagram` | IG 帳號或網址；填了就自動抓該帳號大頭貼，按鈕也會直連本人頁面 |
| `videos[].youtubeId` | YouTube 網址 `watch?v=` 後面那一串 |
| `videos[].badge` | 縮圖左上角徽章，例如觀看數里程碑 |

## 頭像是怎麼來的

成員頭像依序嘗試三個來源，前一個失敗就自動換下一個：

1. `members[].photo` — 自己放的照片（`assets/img/` 或任何圖片網址），最穩定。
2. `members[].instagram` — 該 IG 帳號的大頭貼。Instagram 官方不允許直接連圖，所以透過
   `assets/js/core.js` 最上方的 `config.igAvatarProxy`（預設 `unavatar.io`）取得；
   若哪天這個服務失效，只要改這一行就能整站換來源。
3. 都沒有或都失敗 → 用成員代表色漸層 ＋ 名字首字母。

> BABYMONSTER 目前**只有團體官方帳號** `@babymonster_ygofficial`（已用在首頁上方大頭貼），
> 成員沒有官方個人 IG，因此成員頭像維持首字母樣式。官方開通後，在
> `data/groups/babymonster.js` 對應成員填上 `instagram: '帳號'` 即可，不用改程式。

## 資料來源與維護

`data/groups/` 內的內容整理自官方社群與公開報導（整理時間 2026-09）。
成員生日、影片觀看里程碑等數字會隨時間變動，更新時只要改資料檔即可，不會動到程式。

本站為非官方粉絲介紹頁，圖片、影片與商標版權屬原經紀公司與各平台所有。
