# 段考考務即時管理系統（Netlify Functions + Blobs）

## 部署步驟
1. 把整個資料夾放到 GitHub 儲存庫（或使用 Netlify CLI：`npm i -g netlify-cli`，在資料夾內執行 `netlify deploy --prod`）。
2. Netlify 後台 → Add new site → Import from Git，選擇該儲存庫。Build 設定保持預設即可（`netlify.toml` 已設定）。
3. Site configuration → Environment variables 新增：
   - `ADMIN_PASSWORD`：行政端密碼（請設定足夠長的密碼）
4. 重新部署（Deploys → Trigger deploy）。環境變數修改後需重新部署才生效。

## 各裝置使用網址
- 監考老師：`https://你的網站/?view=teacher&class=901`
- 行政端：`https://你的網站/?view=admin`
- 電子黑板：`https://你的網站/?view=board&class=901`（全螢幕大字顯示）

## 更換密碼
修改 `ADMIN_PASSWORD` 後重新部署，舊的登入狀態會自動失效。

## 注意事項
- `/api/state` 有 3 秒 CDN 快取，同步延遲約 3–8 秒。
- 教室端回報目前不需要密碼；若要防止他人亂填，可再加一組監考代碼。
- 音檔上限 4 MB（Netlify Functions 請求大小限制約 6 MB）。
- 每次考試前，可在 Netlify 後台 Blobs 頁面清除舊資料。
