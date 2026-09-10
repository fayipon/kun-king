# 首頁歡迎彈窗驗收報告

- 對應計畫：Plans/012-welcome-modal.md。
- 狀態：完成。本機驗收通過；GitHub Actions 34478548178 成功，線上首次進入前台已確認顯示歡迎彈窗。部署版本 cd607ad。
- 功能：原生 dialog、整頁暗色模糊遮罩、9 秒漸層框、雞與禮物透明素材、三個英文獎勵預告、註冊入口。

## 驗證

- npm test：3 個測試檔，19 項通過。涵蓋工作階段顯示記錄、重新開啟、X／Escape／遮罩關閉、內容點擊不關閉、焦點與捲動恢復、註冊導向、sessionStorage 不可用。
- npm run build：通過。
- 瀏覽器：390×844、320×480、430×932 及桌面檢查；整頁模糊且主要操作可達，短視窗可內捲動。430px 頁面寬度未溢出。
- 實際操作 Maybe Later、Escape、手動重開、重新整理不重彈及 Create Account 到 register；導向後 body overflow 已恢復。
- 瀏覽器樣式確認 blur(8px)、animation-duration 9s；減少動態效果已寫入 CSS，未實際切換作業系統設定。
- 獎勵服務尚未串接，均使用 Coming Soon 預告，不宣稱領取成功。

登入／註冊右上角 X 為下一份 Plans/013，尚待開始指示。
