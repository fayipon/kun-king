# Promo 活動頁验收報告

- 計畫：Plans/015-promo-page.md；已核准執行。
- 狀態：完成，GitHub Pages 已驗證。

## 成果

- 新增 #/promo；首頁 Promo 入口改為導向新頁。
- 還原參考圖主要區塊、深綠色調、四活動卡色系、任務進度與獎勵列、底部橫幅及固定導覽。
- 六張 ImageGen 原創素材保存 Design/promo，最佳化 WebP 位於 public/promo。素材姿勢及背景細節屬重製，非截圖逐像素複製。
- 共用既有 Banner，支援自動播放、圓點、暫停、手勢、鍵盤與減少動態設定。
- 活動詳情／清單、任務清單、Wallet／Affiliate／My面板、帳號導向均可操作。Go Play 定位遊戲列表；My Favorites開啟收藏。
- 百分比、金幣與進度為示範資料，未連接實際帳號、支付、抽獎、領獎、邀請服務。

## 驗收

- npm test：4個測試檔、24項通過。新增5項整合測試涵蓋首頁往返、各活動面板、焦點與捲動恢復、清單進入詳情、示範進度不變、Go Play及登入導向。
- npm run build：通過。
- 瀏覽器已檢查320×600、390×844、430×932及580px版型，無水平溢出；320px任務改兩列維持可讀性，固定導覽不遮住捲到底部的操作。
- 實際操作活動詳情、Esc、X、Invite、Explore All、My Favorites。關閉後焦點回到觸發入口，body overflow恢復。
- 390px確認所有圖片成功載入。手機窄版已修正Check-in斷字及圖片裁切。
- 減少動態效果沿用既有已測試的輪播實作；本次未實際切換作業系統設定或使用Safari／Firefox。

部署版本2feb323；GitHub Actions 34482206233成功。線上 #/promo 直連正常，所有圖片載入成功，Cashback詳情可開啟。桌面1280px確認頁面置中。
