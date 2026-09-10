# GitHub Pages 驗收及測試報告

- 對應計畫：[002-github-pages](../Plans/002-github-pages.md)
- 執行日期：2026-09-10
- 結果：本計畫驗收通過。
- 網址：https://fayipon.github.io/kun-king/
- 部署版本：`03830cd`
- [GitHub Actions 執行記錄](https://github.com/fayipon/kun-king/actions/runs/34461521775)：build、deploy 均為 success。

## 實際完成範圍

- 啟用公開儲存庫 GitHub Pages，發布來源設為 GitHub Actions。
- 新增工作流程，使用 Node.js 22、npm ci、正式建置與 Pages artifact 部署。
- `main` 的程式／設定推送自動部署，支援手動執行；僅 Markdown 變更略過部署。
- 保留既有 Vite 相對路徑與 HashRouter，線上 `/kun-king/` 子路徑可正常運作。
- README 已記錄網站、前後台連結、發布與更新方式、限制及官方參考文件。

## 測試環境

- 本機：Windows、Node.js 24.15.0、Vite 7.3.6；`npm run build` 通過。
- CI：GitHub Actions ubuntu-latest、Node.js 22；依鎖定檔安裝與建置成功。
- 線上 UI：Codex 內建瀏覽器，桌面視窗及 390 × 844 手機視窗設定；手機 DOM 可用寬度 375px（含捲軸差異）。

## 用例執行結果

| 編號 | 操作與實際結果 | 狀態 |
| --- | --- | --- |
| P01 | 本機 TypeScript 與 Vite 正式建置成功；CI build 同樣成功 | 通過 |
| P02 | 開啟 Pages 根網址，首頁標題、樣式、插圖與兩個入口正常顯示 | 通過 |
| P03 | 點前台後點返回入口，hash 路由切換至對應 React 頁面 | 通過 |
| P04 | 點後台顯示三個管理模組與尚未串接登入／後端提示 | 通過 |
| P05 | 前台及後台分別完整重新載入帶 hash 的網址，皆顯示正確頁面，無 404 | 通過 |
| P06 | 前台資源檢查後顯示「遊戲世界，準備中」，無啟動按鈕 | 通過 |
| P07 | 手機畫面卡片單欄；DOM grid 為單一 329px 欄，scrollWidth 與 clientWidth 皆為 375px，無水平溢出 | 通過 |
| P08 | 開啟 `#/not-found` 顯示找不到頁面，點返回入口正常回到首頁 | 通過 |

## 驗收標準對照

- 正式建置與 Pages 部署成功：通過，見 Actions 記錄。
- 公開網址、首頁與靜態資源正常：通過，見 P02。
- 前後台入口與 hash 路由重新整理正常：通過，見 P03–P05。
- 無 Godot 成品時顯示準備中：通過，見 P06。
- README 含實際網址與維護說明：通過。
- 完成逐項測試及驗收記錄：通過，本文件已記錄 P01–P08。

## 限制與後續待辦

- 本次發布 React 靜態頁面，未包含 Godot Web 成品；瀏覽器對缺少的 `game/index.js` 回傳 404 屬此版本的預期狀態，畫面會轉為準備中。
- Godot 遊戲匯出、自動發布與實際遊戲測試不在本計畫範圍，需後續 Plans。
- 後台為公開預覽骨架，尚無帳號驗證、管理 API 或資料庫。
- 手機驗證使用瀏覽器尺寸模擬，未進行實體手機或多瀏覽器相容性測試。
