# My 頁共用公開 Header

- 狀態：已收到 start 核准，執行中。

## 需求與執行

1. My 頁的頂部 Header 與 Home、Promo 共用同一個公開樣式，右側統一顯示 Log In／Register。
2. 移除共用 Header 對 My 路由特別顯示通知鈴鐺與設定的分支，避免未登入頁面呈現登入後 Header。
3. 保留既有 Logo、返回連結、置頂行為、寬度與間距；My 內容及底部導覽不變。
4. 清理不再使用的 Header 圖示與專屬樣式，更新受影響測試及 README 的 My Header 說明。
5. 驗證後撰寫 Finish，commit、push 並確認 GitHub Pages 部署。

## 驗收標準及用例

| 編號 | 操作 | 預期結果 |
| --- | --- | --- |
| H01 | 依序開啟 Home、Promo、My | Header 右側皆為 Log In／Register，My 不顯示通知與設定圖示 |
| H02 | 在 My 點 Log In／Register | 分別前往 #/login、#/register |
| H03 | 在手機及桌面切換三頁並捲動 | Header 同寬、同高度且維持置頂，沒有額外位移或重疊 |
| H04 | 查看 My 內容及底部導覽 | 保留原有內容與 My 選中狀態 |
| H05 | 執行既有測試、建置及線上檢查 | 通過，結果記錄於 Finish |
