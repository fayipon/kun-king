# 分類頁驗收

- 對應：[Plans/037](../Plans/037-category-games.md)。
- 日期：2026-09-11；已提交並部署。

## 完成範圍

首頁各區View all改為#/games?category=對應分類。分類頁沿用固定Header／BottomNav與登入狀態，依序呈現Banner、可橫向捲動的分類列、搜尋、遊戲列表。Banner隨頁面捲動。

搜尋忽略大小寫及首尾空白，分類／關鍵字放入URL；未知分類視為All。初始12筆，IntersectionObserver接近底部追加12筆，同時提供Load more。到底停止，空結果可清除或回All；不複製遊戲或虛構API。沿用原有卡片、詳情與收藏操作。

## 驗證結果

- npm test：8檔案67項通過。新增View all路由、首批12／Hot共16筆、搜尋、清除、無結果、Perya空狀態、未知分類及Observer追加／清理驗證。
- npm run build與git diff --check通過。
- 瀏覽器檢查390px Banner／篩選／列表、320px搜尋rabbit單一結果、480px完整分類畫面；Top與Bottom保持可見，搜尋框與卡片正常。
- 現有遊戲詳情與收藏回歸測試通過；分類頁重用同一操作程式。
- 瀏覽器返回／前進及重新整理由URL讀取分類／搜尋，尚未逐項手動驗證；真實滾動觸發由Observer測試驗證，未手動覆蓋所有載入批次。

## 限制

目前為本地遊戲清單分批顯示，沒有遠端分頁API；熱門16款，資料較少的分類很快會到底。分類與搜尋變更時回到結果區域，不隱藏或固定Banner。

依使用者修正：分類頁移除圖示分類列及Search games可見標題，移除搜尋外框卡片，只保留Input（清除控制在輸入框內）；首頁分類列不變。67項測試與建置通過。

## 部署結果

程式提交d9233ad已推送main，[Pages部署](https://github.com/fayipon/kun-king/actions/runs/34574304344)成功。線上確認index-4k7uaDRs.js及index-pYw6VIbm.css。
