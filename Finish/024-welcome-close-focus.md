# 歡迎彈窗焦點修正驗收

- 對應：[Plans/024](../Plans/024-welcome-close-focus.md)，已核准開始。
- 移除自動彈窗關閉時強制聚焦 Logo 的預設行為，保留手動開啟按鈕的焦點回復。
- 42 項測試及正式建置通過；涵蓋 X、Maybe Later、Esc、遮罩關閉及捲動解鎖。
- 本機瀏覽器：點 X 後 Logo outline 為 none、焦點回到 BODY、scrollY 為 0、捲動鎖解除。
- 手動開啟再關閉：焦點回到 kk-welcome-trigger，Logo 無外框。
- 鍵盤 Tab 到 Logo 仍有焦點提示，未移除全域鍵盤導覽樣式。
- 部署版本 feb2287，GitHub Actions 34489758551 成功。線上點 X 後彈窗關閉、Logo outline 為 none、scrollY 保持 0。
