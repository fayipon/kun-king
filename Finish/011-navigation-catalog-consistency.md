# 底部導覽與分類一致性驗收

- 日期：2026-09-10
- 計畫：[Plans/011](../Plans/011-navigation-catalog-consistency.md)
- 狀態：本機完成，待部署。

## 完成範圍

底部改為 Home、Promo、Wallet、Affiliate、My，Wallet 中央突出。新增三個準備中面板及 My 帳號／收藏入口。ALL 與單分類共用分類定義及篩選函式，標題統一，未登入搜尋入口與輸入框移除；頁尾說明同步更新。

## 驗收及測試

- N01：五入口順序與圖示確認，Wallet 在中央。
- N02：面板開關及 cancel 事件測試通過；瀏覽器 Wallet 按 Escape 關閉並恢復焦點。
- N03：My 登入、註冊 href 測試通過，收藏跨重掛載、移除及儲存失敗處理正常；瀏覽器 My Favorites 入口確認。
- N04：測試 ALL 每區全部展開，逐一切换對應分類並展開，比對完整遊戲清單及順序均一致；Hot16、Perya0、Popular22、New16、Feature22。
- N05：Perya 在兩種模式皆使用相同準備中內容。
- N06：各分類及收藏無搜尋輸入或Open search入口；Banner View picks 選中Popular測試通過。
- N07：320／390／430／1280px均無水平溢出，底部文字無截斷；390px截圖檢視導覽及My面板通過。
- N08：npm test共15項通過；npm run build及git diff --check通過；線上待驗證。

## 限制

未提供真實登入、錢包、活動及推薦服務；面板如實顯示準備中。Popular與Feature沿用相同展示集合。手機以桌面viewport模擬，未使用實體裝置。
