# Promo 活動頁還原

- 狀態：完成，已部署並驗證 GitHub Pages。
- 開始指示：負責人已回覆「開始」，核准實作。
- 設計依據：使用者提供 codex-clipboard-53c09b07-e210-4584-b7f3-a752735981a3.png。

## 需求與版面

1. 新增獨立 React SPA 頁面 `#/promo`；首頁底部 Promo 由準備中面板改為導向此頁，支援直接開啟及重新整理。
2. 以截圖還原手機版比例、排列及視覺層次：深綠黑背景、薄荷綠主色、細框圓角、霓虹雞／金幣／禮物素材。英文介面；桌面維持手機容器置中，外側深色。沿用前台品牌與主色，避免影響其他頁面布局。
3. Header 固定置頂：左側返回首頁及 KUNKING，右側 Log In／Register 前往既有頁面。
4. 頂部活動 Banner：首張 Welcome Bonus，左文右圖、Claim Now、底部置中圓點。預計三張（Welcome Bonus、Daily Check-in、Lucky Spin），沿用既有滑動／淡入及文字分段進場模式，提供暫停、手勢、鍵盤切換與減少動態效果支援。
5. Featured Promotions：標題左側火焰 icon、右側 View all；下方兩欄兩列：Daily Check-in（綠）、Lucky Spin（紫）、Cashback Festival（紅）、Invite & Earn（藍）。各卡有上方標籤、主副標、CTA，雞及活動物件偏右。手機維持兩欄，窄螢幕調整字級與圖文占比，確保文案可讀。
6. My Missions：標題與 View all；三列 Deposit once、Play 3 games、Invite 1 friend。包含左側 icon、任務描述、進度條與數字、金幣獎勵區、右側按鈕，依截圖還原對齊；窄螢幕必要時將獎勵與操作放第二行，避免文字過小。
7. 下方 More Promotions Await 橫幅：左獎盃、中央文案、右 Explore All 與霓虹裝飾。
8. 底部固定 Home、Promo、Wallet、Affiliate、My；Promo 高亮，Wallet 中央凸起。內容保留足夠底部空間，操作不被導覽遮住。

## 素材與資料

- 使用圖片工具製作活動雞、金幣、禮物、輪盤、邀請與獎盃場景，存於 Design/promo，記錄提示詞；網站使用 public/promo 最佳化 WebP。
- 標題、描述、按鈕、進度條使用 HTML/CSS，避免將整張設計截圖當作頁面。盡量將活動數字也做為可修改文字。
- 100%／20% 與 +50／+30／+100、1/1／2/3／0/1 依參考圖作为示範資料，資料集中管理。頁面活動區與任務區清楚標示 Preview／Demo，細節面板說明獎勵及進度為示範，尚未開放領取，不代表使用者實際入金或邀請成果。
- 本輪為前端展示及互動，不實作支付、抽獎、真實領獎或帳號 API。

## 操作定義

- Banner／活動卡 CTA 開啟對應活動細節 dialog，含活動名稱、說明、尚未開放提示與 Log In／Register 入口；不顯示成功領獎或改變餘額。
- 活動 View all 及 Explore All 開啟完整活動清單面板，選取項目可查看細節；任務 View all 開啟任務清單與示範狀態說明。
- 任務 Claim／Invite 開啟對應說明；Go Play 返回首頁遊戲列表。
- Home 返回 #/frontend；Wallet／Affiliate／My 沿用現有入口行為，避免新增無作用按鈕。
- 所有 dialog 支援 X、Esc、遮罩關閉、焦點返回及背景捲動鎖定。
- 歡迎彈窗仍僅在首頁依原規則顯示，Promo 不自動彈出。

## 執行與交付

1. 製作活動素材，建立 Promo 頁面、資料及样式，整合必要的共用導覽與輪播能力。
2. 接入路由、活動詳情／清單、任務操作及既有帳號入口。
3. 檢查320、390、430px與桌面布局，對照截圖調整圖文比例與間距；測試輪播、路由、dialog和導覽回歸。
4. npm test、npm run build，更新 README 與 Finish/015-promo-page.md。
5. commit、push，驗證 GitHub Pages 對應新版本及 #/promo 直連。

## 驗收標準與用例

| 編號 | 操作 | 預期結果 |
| --- | --- | --- |
| P01 | 首頁點 Promo；直連／重新整理 #/promo | 顯示活動頁，Promo 高亮，資源正常載入 |
| P02 | 與截圖逐區比對 | Header、Banner、四活動卡、三任務、底部橫幅與導覽順序及主要色調一致 |
| P03 | 手勢／圓點／鍵盤切換 Banner | 切換正常，文字可讀；暫停與減少動態效果生效 |
| P04 | 點各活動 CTA 與 View all／Explore All | 開啟對應細節或清單，可關閉，不出現假成功狀態 |
| P05 | 點 Claim、Go Play、Invite | 分別開啟說明、返回遊戲列表、邀請說明；示範進度不被當作實際資料 |
| P06 | 點 Home、Log In、Register 及其他底部入口 | 導向或面板正確；首頁既有分類與歡迎彈窗規則正常 |
| P07 | 開啟面板後使用 Esc、X、遮罩、Tab | 可關閉，焦點限制／返回與捲動恢復正常 |
| P08 | 320／390／430px、桌面與短視窗檢查 | 無水平溢出、圖文不重疊、固定導覽不遮住主要操作 |
| P09 | 測試、建置、線上驗證 | 通過，Finish 記錄實測結果與未串接限制 |
