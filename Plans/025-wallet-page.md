# Wallet 手機頁還原

- 狀態：已收到「開始」，完成驗收及部署。
- 設計來源：Design/wallet-mobile.png。

## 範圍與共用框架

1. 新增 React SPA 頁面 #/wallet，底部 Wallet 由準備中面板改為進入此頁並高亮；My 的 Wallet & transactions 亦導向此頁。
2. 沿用 FrontendLayout、共用 Header 及 BottomNav，最大寬度 480px、桌面置中、手機自適應，保持現有內容起點與切頁穩定性。
3. 依先前已確認的公開前台規格，Header 右側保留 Log In／Register，不採設計圖中的通知／設定。登入及註冊布局不變。

## 設計還原

- 純英文，沿用首頁深色背景、綠灰卡片、薄荷綠主色；圓角、分隔線、字級層次與排列參照設計圖。
- 頁首 Wallet、Your money, all in one place. 及 PREVIEW。
- 餘額卡：Total balance ₱13,300.00、PHP、顯示／隱藏金額按鈕。
- 卡片下方兩欄 Cash wallet ₱12,450.00、Promo wallet ₱850.00，流水進度分別 ₱8,000 / ₱10,000（80%）、₱1,500 / ₱5,000（30%）；Deposit 與 Withdraw 按鈕。
- My Statistics：期間選擇器及四卡，預設 Total deposit ₱12,450.00、Total withdrawal ₱8,000.00、Net deposit ₱4,450.00、Promo rewards ₱850.00。
- Transaction History：View all、All／Deposit／Withdraw／Promo 四分類及獨立期間選擇器。
- 初始五列：Deposit +₱1,000 Completed、Withdrawal −₱500 Pending、Welcome bonus +₱500 Credited、Daily check-in +₱25 Credited、Withdrawal −₱2,000 Completed，包含圖示、渠道、時間與右箭頭。
- 底部客服入口與 Design preview · Sample wallet data，預留固定導覽安全間距。
- 使用 HTML/CSS 與既有 Lucide 圖示完成，不將整張設計圖鋪成背景。

## 資料與互動

1. 本輪為前端預覽，所有金額、流水、交易及狀態使用集中管理的示範資料，保留預覽標示；不串接金流或真實帳戶。
2. 金額眼睛按鈕可切換餘額卡內總額、兩個子錢包金額與流水數字的顯示／遮蔽，按鈕名稱與狀態同步；本次頁面離開後恢復預設顯示。
3. 統計期間提供 This month／Last month／All time，切換相應示範數據；Net deposit 等於該期間 deposit 減 withdrawal。
4. 歷史分類與期間可組合篩選，提供空結果狀態；使用固定示範日期以穩定還原參考圖，不將資料視為即時交易。
5. View all 展開符合目前篩選的完整示範紀錄；點擊交易列顯示對應金額、狀態、渠道及時間詳情。
6. Deposit／Withdraw 開啟各自的服務準備中說明，可前往登入／註冊；不建立付款、提款或變更示範餘額。
7. 客服入口提供交易 FAQ 及尚未串接客服的說明。
8. 詳情面板沿用原生 dialog，支援 X／Esc／遮罩關閉、焦點回復及捲動鎖定；跳轉登入／註冊時正確解除鎖定。

## 執行與交付

1. 建立 Wallet 元件、資料及樣式，更新路由、頁面標題、共用導覽與 My 錢包入口。
2. 更新受影響的測試及 README，驗證 320／390／480px 與桌面布局。
3. 執行 npm test 與 npm run build，完成 Finish/025-wallet-page.md。
4. commit、push，確認 GitHub Pages 部署與 #/wallet 直連／刷新。

## 驗收標準與用例

| 編號 | 操作 | 預期結果 |
| --- | --- | --- |
| W01 | 各前台點 Wallet、My 錢包列，或直連／刷新 | 開啟 Wallet，底部正確高亮，只存在一組共用 Header／導覽 |
| W02 | 對照設計圖 | 餘額卡、流水、操作、統計、歷史、客服完整，Header 沿用公開前台版本 |
| W03 | 切換金額顯示 | 餘額卡數值正確遮蔽／還原，無布局跳動 |
| W04 | 切換統計期間 | 四個數值同步更新，淨存款計算一致 |
| W05 | 組合歷史分類及期間，包含無結果組合 | 紀錄正確篩選，無結果時呈現清楚空狀態 |
| W06 | View all 與交易詳情 | 展開符合篩選的完整清單，詳情與點擊列一致 |
| W07 | Deposit、Withdraw、客服及登入／註冊連結 | 對應說明正確，路由跳轉可用，不產生真實金流或修改餘額 |
| W08 | 面板 X／Esc／遮罩及鍵盤操作 | 正常關閉，焦點與捲動恢復，無 Logo 強制聚焦問題 |
| W09 | 320／390／480px 及桌面、切換 Home／Promo／My／Wallet | 同寬且無水平溢出，金額不裁切，底部不遮住操作，切頁不位移 |
| W10 | 既有功能回歸、測試、建置及部署 | 通過並在 Finish 如實記錄結果 |
