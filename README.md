# K-POP HUB

一個 K-POP 團體介紹網站，目前收錄 **BABYMONSTER**、**IU**、**LE SSERAFIM**、**IVE**、**aespa**、**ILLIT**、**TWS**、**NMIXX**，
用頁首的 tab 切換。以 **React 19 + Vite** 打造，部署在 GitHub Pages。

## 功能

- **團體切換**：頁首的膠囊列，之後加入新團體會自動出現。
- **成員介紹**：頭像列一鍵切換，也支援鍵盤左右鍵；每位成員有代表色、角色標籤、生日（自動算年齡）、簡介與 Instagram 連結。
- **Instagram 大頭貼**：填了 IG 帳號就自動把該帳號的大頭貼當成頭像，抓不到會退回本地照片或代表色首字母頭像。
- **近期發行**：自動抓 `releases` 裡最新的三筆作品，放在熱門影片上方，最新一張會標「最新」。
- **熱門影片**：依人氣排序的 YouTube 影片牆，點縮圖才載入 iframe，不會一進站就拖慢速度。嵌入用 `youtube.com`，瀏覽器已登入 YouTube Premium 就不會有廣告。
- **官方社群**：Instagram / YouTube / X / TikTok / 官網連結卡。
- **作品年表**：專輯與單曲時間軸。
- **可分享網址**：`#/babymonster/ahyeon` 這種網址會直接開到指定成員。
- RWD、深色主題，主題色由各團體資料自訂。
- 字體全部自架（`@fontsource`，不依賴外部 CDN），四套都是可變字體：
  標題 **Unbounded**、內文與 UI **Geist**、中文 **Noto Sans TC**、韓文 **Noto Sans KR**。
  中韓文有 unicode-range 分包，瀏覽器只會下載實際用到的區段。

## 本機開發

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 產出 dist/
npm run preview   # 預覽 build 結果
```

`npm run build` 會把 `assets/img/`（成員照片）一併複製進 `dist/`。
部署到子目錄時用 `BASE_PATH` 指定，例如 GitHub Pages：`BASE_PATH=/kpop/ npm run build`。

## 影片每天自動更新

`.github/workflows/update-videos.yml` 每天台北時間早上 6 點跑一次
`scripts/update-videos.mjs`，把結果寫到 `src/data/generated/`，
有變化才 commit，並自動觸發重新部署。也可以到 Actions 手動執行。

產出兩份清單：

- `<團體id>-videos.json` — 官方頻道的 M/V
- `<團體id>-variety.json` — 綜藝節目片段

腳本有兩種模式，會自動判斷：

| 模式 | 條件 | 結果 |
| --- | --- | --- |
| **YouTube Data API** | repo secret 有設 `YOUTUBE_API_KEY` | 取得頻道所有 M/V 的實際觀看數，依人氣排序，徽章顯示「4.2 億觀看」這類即時數字 |
| **RSS**（預設） | 沒有設 key | 只讀頻道最新 15 支，把新的 M/V 併到資料檔原有清單前面，不會弄丟既有內容與徽章 |

要啟用 API 模式：到 [Google Cloud Console](https://console.cloud.google.com/) 建立專案 →
啟用 **YouTube Data API v3** → 建立 API 金鑰 → 在 repo 的
**Settings → Secrets and variables → Actions** 新增 `YOUTUBE_API_KEY`。
免費額度每天 10,000 單位，這支腳本一次大約用掉 10 單位。

腳本只會挑標題含 `M/V`／`MUSIC VIDEO`／`PERFORMANCE VIDEO` 的影片，
並排除 MAKING FILM、TEASER、REACTION 等衍生內容。任一團體抓取失敗都不會影響其他團體，
網站也會自動退回資料檔裡的清單。

外部服務（YouTube RSS、維基）暫時出錯時，腳本會自動重試三次；仍失敗只會在
Actions 上留下警告，不會讓整個排程失敗——網站沿用上次的清單，其他團體與照片步驟照常進行。

### 綜藝節目片段

綜藝片段在電視台／節目自己的頻道上，不在團體頻道，所以改成**監看那些頻道的 RSS**，
撿出標題提到團名的影片（不需要 API key）。要追蹤哪些頻道寫在團體資料的 `varietyChannels`：

```js
varietyChannels: [
  'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
  '@idolhumandocu'            // 也可以直接填 @handle
]
```

新撿到的排在最前面，資料檔裡 `variety` 手動整理的內容永遠保留在後面，不會被洗掉。
會自動略過直拍（직캠／FANCAM）。單一頻道抓失敗只會警告，不影響其他頻道。

### 影片狀態驗證

兩份清單寫檔前都會用 YouTube 的 oEmbed 逐支確認：

| 回應 | 處理 |
| --- | --- |
| 404／400 | 影片已下架或 ID 有誤 → 從清單移除 |
| 401／403 | 影片還在，但不允許外站嵌入 → 標記 `noEmbed`，前端改成點了開 YouTube |
| 其他錯誤 | 可能只是暫時性問題 → 原樣保留，不會誤刪 |

電視台的綜藝片段很常禁止嵌入，這個機制可以避免使用者點下去只看到「無法播放」。

### 成員照片（Wikipedia）

成員照片是從英文維基百科人物條目的主圖下載的，就放在 `assets/img/`
（例如 `assets/img/aespa-karina.jpg`），作者與授權記錄在 `assets/img/credits.json`。

這是**一次性**的步驟，不在每日排程裡。新增團體後到
**Actions → Fetch member photos → Run workflow** 執行一次即可，
只會補抓還沒有照片的成員（勾選 refresh 則全部重抓）。

- **只收 Wikimedia Commons 上的自由授權圖**（CC BY／CC BY-SA 等）；英文維基本地的
  「合理使用」非自由圖一律不抓，查不到作者或授權的也不用
- **確認是本人**：條目要同時提到團名與成員名、是人物條目，而且不能是團體本身的條目
  （避免抓到團體合照或同名的人）
- **沒有個人條目時，改到 Commons 找**：一是團體分類（例：`Category:Babymonster`），二是檔名搜尋
  （例：`Shinyu of TWS at ...`）。只收檔名或所在子分類寫著這位成員的照片，搜尋到的檔案另外要求
  檔名裡有團名（避免抓到其他團同名的人）；檔名同時出現其他成員名字的雙人照、團體照一律跳過。
  分類名稱不是團名時，在團體資料加 `commonsCategory: '分類名'`
- 下載後自動轉成 400px 寬的 JPEG（用 sharp），每張約 25～50 KB
- 成員卡顯示這些照片時會自動標註作者與授權，這是 CC 授權的使用條件，請勿移除
- 找錯人或想指定條目：在成員資料加 `wiki: '條目標題'`；想換成自己的照片就在 `photo` 填路徑，
  優先順序最高
- 個別照片構圖特殊（例如臉部特寫）時，在成員資料加
  `photoFocus: { position: '50% 38%', zoom: 1 }` 調整頭像的裁切焦點與放大倍率

## 上線（GitHub Pages）

第一次要手動開啟 Pages（只需一次）：
**Settings → Pages → Build and deployment → Source 選「GitHub Actions」**

> Actions 的 GITHUB_TOKEN 無法自動開啟 Pages（`enablement: true` 會回
> `Resource not accessible by integration`），這步只能由 repo 管理員手動做。
> 另外 Pages 要能開，repo 必須是 **public**，或帳號是 GitHub Pro 以上。

之後 `.github/workflows/deploy-pages.yml` 會在 **push 到 `main`** 時自動發佈。

上線後網址：`https://<帳號>.github.io/kpop/`

也可以到 repo 的 **Actions → Deploy to GitHub Pages → Run workflow** 手動觸發。
站內所有路徑都是相對路徑，放在子目錄（`/kpop/`）底下也能正常運作。

> `.nojekyll` 不能刪：GitHub Pages 預設會用 Jekyll 處理，而 Jekyll 會忽略底線開頭的檔案，
> 那會讓 `data/groups/_template.js` 消失。

## 目錄結構

```
.github/workflows/            GitHub Pages 自動部署（npm ci → build → 上傳 dist）
index.html                    Vite 進入點（字體與 meta 都在這）
vite.config.js                base path 由 BASE_PATH 環境變數決定
scripts/copy-assets.mjs       build 後把 assets/img 複製進 dist
scripts/update-videos.mjs     每日抓取影片清單（API 或 RSS）
scripts/fetch-wiki-photos.mjs 一次性下載成員照片（Wikipedia／Commons）
assets/img/                   成員照片與 credits.json（作者／授權）
src/main.jsx                  React 進入點
src/App.jsx                   路由（hash）與頁面組裝
src/styles.css                全站樣式（主題色用 CSS 變數，依團體注入）
src/lib/registry.js           自動載入 src/data/groups/ 的資料並補預設值
src/components/               Header / Hero / Members / Latest / Videos / Social / Timeline / Avatar
src/data/groups/babymonster.js  BABYMONSTER 資料
src/data/groups/_template.js    新增團體用的範本（底線開頭 = 不會被載入）
src/data/generated/             每日自動產生的影片清單（不要手改）
```

## 新增一個團體

1. 複製範本：

   ```bash
   cp src/data/groups/_template.js src/data/groups/blackpink.js
   ```

2. 編輯 `src/data/groups/blackpink.js`，填入團名、成員、影片、社群連結等資料。
   欄位說明都寫在範本的註解裡；沒有的欄位可以整個刪掉，程式會自動補預設值。

3. 存檔。**就這樣** —— `src/data/groups/` 底下的檔案會被自動掃描載入
   （`import.meta.glob`），不用 import、不用改任何畫面程式。

頁首切換列的順序由資料裡的 `order` 決定（數字小的在前，沒填預設 100）。

## 資料怎麼填

| 欄位 | 說明 |
| --- | --- |
| `theme.accent` / `theme.accent2` | 團體主題色，會套用到漸層、按鈕、標籤 |
| `members[].color` | 成員代表色，沒放照片時會變成漸層頭像底色 |
| `order` | 團體切換列的排序，數字小的在前 |
| `type` | 個人歌手填 `'solo'`：成員區改成單人「藝人介紹」版面，不顯示切換列 |
| `members[].photo` | 照片路徑或圖片網址，例如 `assets/img/ahyeon.jpg`；優先度最高 |
| `members[].instagram` | IG 帳號或網址；填了就自動抓該帳號大頭貼，按鈕也會直連本人頁面 |
| `videos[].youtubeId` | YouTube 網址 `watch?v=` 後面那一串 |
| `videos[].badge` | 縮圖左上角徽章，例如觀看數里程碑 |
| `releases[].youtubeId` | 選填；填了「近期發行」卡片就會有看 M/V 連結 |

## 頭像是怎麼來的

成員頭像依序嘗試三個來源，前一個失敗就自動換下一個：

1. `members[].photo` — 自己放的照片（`assets/img/` 或任何圖片網址），最穩定。
2. 維基照片 — `assets/img/` 裡從 Wikimedia Commons 下載的照片（見下方「成員照片」）。
3. `members[].instagram` — 該 IG 帳號的大頭貼。Instagram 官方不允許直接連圖，所以透過
   `src/lib/registry.js` 最上方的 `config.igAvatarProxy`（預設 `unavatar.io`）取得；
   若哪天這個服務失效，只要改這一行就能整站換來源。
4. 都沒有或都失敗 → 用成員代表色漸層 ＋ 名字首字母。

> BABYMONSTER 七位成員的 IG 帳號都已填在 `data/groups/babymonster.js`，
> 頭像即為各自的 IG 大頭貼；首頁上方則是團體官方帳號 `@babymonster_ygofficial` 的大頭貼。
> 帳號換了只要改該成員的 `instagram` 欄位，不用動程式。

## 資料來源與維護

`data/groups/` 內的內容整理自官方社群與公開報導（整理時間 2026-09）。
成員生日、影片觀看里程碑等數字會隨時間變動，更新時只要改資料檔即可，不會動到程式。

本站為非官方粉絲介紹頁，圖片、影片與商標版權屬原經紀公司與各平台所有。
