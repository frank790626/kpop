這個資料夾由 `scripts/update-videos.mjs` 自動產生，請不要手動編輯。

GitHub Actions 每天跑一次（`.github/workflows/update-videos.yml`），把各團體的
影片清單寫成 `<團體id>-videos.json`。網站啟動時若讀得到對應的檔案，
就用它取代資料檔裡手寫的 `videos`；讀不到就維持原本的清單。

刪掉這裡的檔案不會弄壞網站，只會退回資料檔裡的版本。
