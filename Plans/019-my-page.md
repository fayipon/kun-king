# My 帳戶頁還原

- 狀態：完成，已部署並驗證。
- 設計來源：Design/kunking_my_reference_aligned.png。

## 範圍與路由

1. 新增React SPA獨立頁面#/my，所有前台底部My由面板改為導向此頁；直連與重新整理正常。
2. 沿用FrontendLayout、共用Header及BottomNav，最大480px、手機自適應、桌面置中；My導覽高亮，登入／註冊維持現有布局。
3. 共用Header新增可配置右側動作：My頁依設計顯示通知鈴鐺（提示點）與設定；其他頁保持Log In／Register。返回箭頭及品牌回首頁。不得在My另寫一份Header或底部導覽。

## 版面還原

- 深色背景、綠灰卡片、薄荷綠強調色，維持設計圖留白、圓角、分隔線及對齊；介面純英文。
- 頁首My、Your account, all in one place.與PREVIEW標籤。
- 個人卡：雞頭像、Player123、ID 8891023、複製與編輯按鈕；下方VIP 3、View benefits、Progress to VIP 4、12,450 / 20,000、7,550 points to your next level與進度條。
- My Statistics：This month期間選擇器、兩欄四卡。初始Total deposit ₱12,450.00、Total withdrawal ₱8,000.00、Total bet ₱98,320.00、Net result −₱1,250.00；負數紅色、正數綠色。
- Account：Personal information、Account security（2FA on）、Verification（Verified）、Wallet & transactions、Preferences（English）、Help center，各列對應icon、狀態及右箭頭。
- Game History：View all及三列紀錄，使用現有遊戲封面。Fortune Ox +₱250.00／Bet ₱1,000.00、Mahjong Ways +₱120.00／Bet ₱500.00、Plushie Frenzy −₱300.00／Bet ₱300.00，依參考圖顯示時間。
- 底部Log Out及Design preview · Sample account data；保留固定導覽所需安全間距。
- 優先沿用既有雞素材以CSS裁切作頭像、Design/games對應網站封面與Lucide icon；不將整張設計圖當作頁面背景。

## 示範資料與操作

1. 本輪為設計預覽，帳戶、VIP、統計、2FA／驗證狀態及遊戲紀錄均為集中管理的示範資料。保留圖中的PREVIEW及Sample account data說明，細節面板亦標示示範，不能將狀態當成實際已登入或已完成驗證。
2. 複製ID使用Clipboard API；成功或失敗均有英文提示，失敗時提供可選取的ID，不假報成功。
3. 編輯與Personal information開啟相同資料面板，展示範例資料與尚未連接帳戶服務提示；不假裝儲存成功。
4. VIP benefits開啟權益預覽說明；通知開啟通知面板；Header設定與Preferences共用偏好設定面板。
5. 統計期間提供This month、Last month、All time，切換顯示明確標示的示範資料，數字與期間一起更新，不查詢真實帳戶。
6. Account security、Verification、Wallet & transactions、Preferences開啟各自細節預覽；不啟用支付、KYC、密碼或2FA真實操作。Help center提供英文FAQ與返回遊戲大廳入口。
7. 保留原My中的Log In、Register、My Favorites入口，安排在個人資料面板內；Favorites返回首頁收藏列表。
8. Game History的View all開啟完整示範紀錄面板；單列點擊開啟對應紀錄詳情，展示遊戲、示範時間、投注及結果。
9. Log Out開啟確認面板，明確表示將離開預覽；確認返回登入頁，取消留在My。不清除收藏，不宣稱已撤銷伺服器登入狀態。
10. 所有面板沿用原生dialog，支援X、Esc、遮罩、焦點限制／返回及背景捲動鎖定。My頁不自動出現首頁歡迎彈窗。

## 執行與交付

1. 建立My資料、元件與樣式；接入共用框架、路由及Header動作配置。
2. 對照參考圖完成手機布局、狀態及互動面板；保留既有頁面行為。
3. 驗證320／390／480px及桌面，檢查金額、選單、紀錄與底部按鈕不溢出／不遮蔽。
4. 更新相關測試，執行npm test與npm run build；更新README及Finish/019-my-page.md。
5. commit、push，驗證GitHub Pages部署版本與#/my直連。

## 驗收標準與用例

| 編號 | 操作 | 預期結果 |
| --- | --- | --- |
| M01 | 各前台點My、直連或刷新#/my | 顯示My頁並高亮；只有一組共用Header／BottomNav |
| M02 | 對照設計圖逐區檢查 | 個人／VIP、統計四卡、帳戶六列、紀錄三列、Log Out與預覽提示完整 |
| M03 | 複製ID，另模擬剪貼簿失敗 | 成功提示正確；失敗提供可選取ID，不假報成功 |
| M04 | 切換統計期間 | 對應示範數字更新；貨幣格式與正負顏色正確 |
| M05 | 通知、設定、編輯、VIP、各帳戶列 | 開啟對應面板；設定與Preferences、編輯與個資使用一致內容 |
| M06 | View all及紀錄列 | 完整示範清單或正確紀錄詳情，可關閉 |
| M07 | 個資內登入／註冊／收藏 | 正確導向既有頁面及收藏列表 |
| M08 | Log Out取消及確認 | 取消保留My；確認返回登入，不清除收藏 |
| M09 | Esc、X、遮罩、Tab | 焦點及捲動恢復正確，無面板互相覆蓋鎖定狀態 |
| M10 | 320／390／480px及桌面 | 同首頁480px上限，無橫向溢出；底部操作可見可達 |
| M11 | 首頁／Promo／Godot／登入回歸、測試與建置 | 通過，Finish記錄實測與未串接限制 |
