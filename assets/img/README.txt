成員照片放在這個資料夾。

<團體id>-<成員id>.jpg 是從 Wikimedia Commons 下載的自由授權照片，
作者與授權記錄在 credits.json，網站會自動標註出處（CC 授權的要求，請勿刪除 credits.json）。
要補抓新團體的照片：GitHub Actions → Fetch member photos → Run workflow。

想換成自己的照片：把檔案放進來，並在 src/data/groups/<團體>.js 對應成員的
photo 欄位填路徑，例如 photo: 'assets/img/my-karina.jpg'，優先度最高。
