# Kun King

React SPA 與 Godot 遊戲整合專案。首頁提供「前台」與「後台」入口。

## 開發流程（必須遵守）

本流程適用於所有後續工作，包含新功能、問題修正、重構、設定與文件變更。PLANS 與 FINISH 分別對應現有的 `Plans/` 與 `Finish/` 資料夾，文件以 Markdown（`.md`）為主。

1. **先寫 Plans**：所有要做的事，必須先在 `Plans/` 建立或更新計畫文件，列出需求內容與預計執行事項，不得直接開始實作。
2. **提交審核並等待開始**：Plans 寫完後，交由專案負責人審核。若有修改意見，先修訂計畫並再次提交；只有在負責人審核後明確說「開始」，才能執行該計畫。提交計畫、未收到回覆或僅通過審核，都不代表可以開始。
3. **依核准計畫執行與驗證**：Plans 必須包含需求內容、驗收標準及用例，實作與測試依照核准範圍進行。若需新增或變更範圍，先更新 Plans，重新審核並收到「開始」後，才能執行變更部分。
4. **完成 Finish 報告**：執行後，在 `Finish/` 撰寫 Markdown 驗收及測試報告，連結對應的 Plans，逐項記錄驗收與測試結果。未測試、未通過或受阻的項目應如實列出，不得標記為完成。

### Plans 文件內容

- 需求內容：目標、工作範圍與預計執行事項。
- 驗收標準：可逐項判定通過或不通過的具體條件。
- 用例：前置條件、操作步驟與預期結果，涵蓋適用的正常、異常及邊界情境。
- 審核與執行狀態：待審核、待開始、執行中或已完成；記錄審核與「開始」指示。

### Finish 文件內容

- 對應計畫：Plans 文件連結與實際完成範圍。
- 驗收報告：逐項對照驗收標準，記錄結果及佐證。
- 測試報告：測試環境、執行日期、用例、實際結果與通過／失敗／未測試狀態。
- 未完成事項：已知問題、限制、受阻原因與後續待辦。

## GitHub Pages 靜態網站

本專案需要透過 GitHub Pages 提供 React SPA 靜態網站，包含首頁、前台及後台入口。發布計畫、驗收標準與用例見 [GitHub Pages 計畫](Plans/002-github-pages.md)。

發布網址：[Kun King](https://fayipon.github.io/kun-king/)。2026-09-10 已完成首次部署與線上驗收，詳見 [驗收及測試報告](Finish/002-github-pages.md)。

- [遊戲前台](https://fayipon.github.io/kun-king/#/frontend)
- [管理後台](https://fayipon.github.io/kun-king/#/admin)

發布來源為 GitHub Actions，工作流程位於 [pages.yml](.github/workflows/pages.yml)。推送程式或設定變更至 `main` 後，會自動使用 Node.js 22、`npm ci`、`npm test` 與 `npm run build` 驗證及建置，再將 `dist/` 部署至 Pages。僅 Markdown 文件變更不觸發部署；也可在 [Actions](https://github.com/fayipon/kun-king/actions/workflows/pages.yml) 選擇 **Run workflow** 手動發布。

儲存庫 **Settings → Pages → Source** 使用 **GitHub Actions**。Vite 使用相對資源路徑 `base: './'`，路由使用 HashRouter，適用 `/kun-king/` 子路徑；分享子頁面時請保留 `#/frontend` 或 `#/admin`。

目前部署包含可互動的 React 手機遊戲大廳。Godot Web 匯出成品未納入 Git，工作流程也尚未匯出遊戲，因此 `#/play` 示範頁顯示準備中；後台為公開預覽骨架，尚無登入或管理 API。Godot 成品的自動發布另列後續計畫。

部署失敗時請查看 Actions 的 build／deploy 記錄；修正後重新推送，或手動重新執行工作流程。發布方式參考 [GitHub Pages 官方文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 快速開始

需求：Node.js 22.22.2+（22.x）、24.15.0+（24.x）或 26+、npm，版本要求包含測試環境；遊戲開發另需 Godot 4.3+ 及相同版本的 Export Templates。

```sh
npm install
npm run dev
```

開啟終端機顯示的本機網址（預設 http://127.0.0.1:5173）。

```sh
npm run build    # TypeScript 檢查與正式建置，輸出 dist/
npm run preview  # 預覽正式建置
npm test         # 輪播、搜尋、分類及收藏互動測試
```

## 頁面

| 路徑 | 說明 |
| --- | --- |
| `#/` | 項目入口：前台與後台 |
| `#/frontend` | 手機遊戲大廳：三張輪播、遊戲搜尋、分類、收藏與資訊面板 |
| `#/login` | 英文登入獨立頁：前端驗證、密碼顯示與識別名稱記憶 |
| `#/register` | 英文註冊獨立頁：欄位、密碼確認與條款勾選驗證 |
| `#/play` | Godot 示範：檢查 Web 資源，完成匯出後提供啟動按鈕 |
| `#/admin` | 管理後台骨架：遊戲內容、項目設定、資源管理 |

使用 HashRouter 實現 SPA，重新整理與靜態主機不需額外路由 rewrite。後台目前為開發預覽，尚未實作帳號登入、權限驗證、API 或資料儲存。

## 手機版前台

前台介面使用純英文，包含 Banner、搜尋、分类、收藏、資訊面板、頁尾與無障礙標籤；原始遊戲封面中的文字屬圖片素材。

前台採深色手機優先版面，桌面置中並限制 480px 寬。三張原創 Banner 每 5 秒輪播，支援手指／滑鼠跟手拖曳、短距離回彈及鍵盤左右鍵。圓點疊放於圖片底部正中央，播放／暫停位於右上角，不再顯示頁碼、箭頭或底部控制列。圖片以 650ms 滑移淡化、輕微縮放轉場，眉題、主標、副文案與 CTA 依序滑入淡入。拖曳中、滑鼠停留、鍵盤焦點進入或頁籤隱藏時暫停；啟用減少動態效果時停用自動播放與動畫。

2026-09-10 已部署並驗收，詳見 [手機版前台驗收及測試報告](Finish/003-mobile-frontend-landing.md)。

遊戲可依展示分類篩選、展開更多卡片，並在資訊面板加入收藏。收藏使用瀏覽器 localStorage 保存，不跨裝置同步；目前各遊戲只展示資訊，尚未串接實際遊戲。人氣與新作為示範編排。

Banner 下方直接呈現六分類：ALL、Hot、Perya、Popular、New、Feature。Hot 沿用熱門展示集合，Popular 與 Feature 目前共用精選集合，New 為新作集合；Perya 尚無確認的遊戲資料，顯示英文準備中提示，可返回 ALL。詳見 [五分類計畫](Plans/005-lobby-categories.md)。

- 原始遊戲圖：`Design/games/`，共 134 張，保留原檔；目前挑選 32 張作為展示資料。
- 前端封面：`public/games/`，320px WebP，依可見區域延遲載入。
- 原創 Banner：`Design/banners/`；[生成提示詞與素材紀錄](Design/banners/README.md)。使用內建 ImageGen 生成，前端以 `public/banners/` 的 960px WebP 載入，文案為 HTML 疊加。
- 展示資料與元件：`src/landing/`；測試：`tests/landing.test.tsx`。

## Godot 開發與整合

1. 使用 Godot 匯入 `godot/project.godot`，按 F6/F5 可執行互動示範場景。
2. 從 Godot「Editor → Manage Export Templates」安裝與編輯器相符的範本。
3. 將 `godot` 加入 PATH，於儲存庫根目錄執行：

   ```sh
   npm run godot:export
   ```

   或從 Godot「Project → Export → Web」匯出至 `public/game/index.html`。
4. `npm run dev` 開啟 `#/play`（或前台頁尾「遊戲說明 → Godot 示範」），按「啟動遊戲」。React 透過 iframe 載入 Godot Web 成品；切換頁面會卸載遊戲，示範步數不保存。
5. 正式發布請先匯出遊戲，再執行 `npm run build`，將完整 `dist/` 部署至靜態主機。

Web 使用 Compatibility renderer 與單執行緒；主機須正確提供 `.js` JavaScript 與 `.wasm` `application/wasm` MIME 類型。瀏覽器需支援 WebGL 2.0 與 WebAssembly。匯出成品不納入 Git，新的 checkout 需重新匯出；尚未匯出時 Godot 示範頁會顯示準備中。參考 [Godot 官方 Web 匯出文件](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)。

## 專案結構

```text
Design/              設計規格與視覺方向
Plans/               待審核的開發計畫、需求、驗收標準與用例
Finish/              驗收及測試報告
src/                 React SPA、路由與樣式
godot/               Godot 專案、場景、GDScript 與 Web 匯出設定
public/game/         Godot Web 匯出輸出位置
```

首頁採繁體中文、柔和綠色與米色視覺，支援桌機和手機。字型透過 Google Fonts 載入，離線時使用系統字型。

分類切換使用 300ms 選中背景滑移、圖示上提及縮放、光暈與文字顏色轉場；減少動態效果設定下即時切換。詳見 [分類轉場計畫](Plans/006-feature-category-motion.md)。

前台 Header 捲動時保持置頂；搜尋焦點以完整圓角外框呈現。遊戲卡片僅保留名稱與右側箭頭，長名稱省略顯示。詳見 [調整計畫](Plans/007-header-search-game-cards.md)。

## 登入與註冊

前台 Header 提供 Log In／Register，分別前往 [登入](https://fayipon.github.io/kun-king/#/login) 與 [註冊](https://fayipon.github.io/kun-king/#/register)。使用既有 HashRouter；GitHub Pages 分享網址需保留 #。

兩頁採使用者參考圖編輯的霓虹遊戲雞背景、玻璃表單與紫色／青綠呼吸光暈；減少動態效果設定下停用動畫。素材與提示詞見 [Design/auth](Design/auth/README.md)。未登入首頁不顯示搜尋入口，分類與第一個標題間距為 8px。

目前未連接驗證 API、OAuth、忘記密碼及正式條款服務。表單只做前端驗證並顯示英文未連接提示，不建立帳號或登入 session；密碼不寫入儲存空間。Remember me 只保存識別名稱至本機，取消勾選即移除。社群、忘記密碼與條款入口提供可關閉的說明面板。

登入與註冊背景頂部對齊、不重複鋪排，圖片外側及底部延伸為純黑；表單沿用原玻璃框。舊熊素材保留作為設計紀錄。

登入與註冊介面以首頁薄荷綠 #5df5c2 為主色，搭配綠灰面板；頁面上下外距及底部額外padding已移除，表單內部間距保留。

## 前台導覽與分類一致性

底部入口為 Home、Promo、Wallet、Affiliate、My，Wallet 位於中央。Promo、Wallet、My 開啟各自頁面；Affiliate 開啟邀請獎勵頁，My 個人資料面板提供 Log In、Register、My Favorites。ALL 依序顯示 Hot、Perya、Popular、New、Feature，與單分類共用名稱、遊戲集合及排序。Popular／Feature 共用既有精選資料，故 ALL 部分分區會有重複遊戲；Perya 目前為準備中。

目前無真實登入狀態，公開前台不顯示搜尋圖示或搜尋框；待接上帳號服務再提供登入後搜尋。詳見 [Plans/011](Plans/011-navigation-catalog-consistency.md)。

## 首頁歡迎彈窗

前台首頁於每次頁面載入後首次進入時顯示 Welcome Rewards 彈窗，背景暗化並模糊 8px，青綠／紫色邊框以 9 秒循環緩慢變色。X、Maybe Later、Esc 或遮罩均可關閉，頁尾 Welcome Rewards 可重新開啟。Create Account 前往註冊；目前獎勵僅為 Coming Soon 預告。減少動態效果設定下停用漸層動畫。詳見 [Plans/012](Plans/012-welcome-modal.md) 及 [素材與提示詞](Design/welcome/README.md)。

登入與註冊表單卡片右上角提供 X，採用 Welcome Rewards 彈窗相同的淡紫圓框關閉樣式，返回前台首頁。歡迎彈窗的裝飾素材透過瀏覽器 alpha 濾鏡清理低透明度殘影，保留原始素材及全頁模糊遮罩。

## Promo 活動頁

[活動頁](https://fayipon.github.io/kun-king/#/promo) 提供 Welcome Bonus／Daily Check-in／Lucky Spin 三張輪播、四張活動卡、三列任務、完整活動清單與詳情面板。首頁底部 Promo 直接進入本頁。Home 返回首頁；Go Play 定位遊戲列表；My Favorites 開啟收藏列表。

活動百分比、獎勵數字與進度均為示範，頁面標示 Preview／Demo，尚未串接領獎、支付、邀請或帳號服務。詳見 [Plans/015](Plans/015-promo-page.md)、[驗收報告](Finish/015-promo-page.md) 與 [素材提示詞](Design/promo/README.md)。

## 共用前台框架與彈窗刷新

首頁、Promo及Godot示範頁共用 FrontendLayout、Header與BottomNav，統一480px最大寬度、72px置頂Header、底部安全區與Wallet／Affiliate／My入口。登入／註冊保留目前布局，項目入口與後台不套用。新增前台內容頁應接入此框架。

歡迎彈窗每次重新整理首頁皆顯示；關閉狀態只保存在本次載入的記憶體中，同次SPA切頁再回首頁不重彈。舊sessionStorage關閉記錄不再使用；其他頁面刷新後首次進入首頁仍會顯示。

## My 帳戶預覽

[My頁](https://fayipon.github.io/kun-king/#/my)依Design/kunking_my_reference_aligned.png實作，包含個人資料、VIP進度、期間統計、帳戶選單與遊戲紀錄。底部My開啟獨立頁，共用Header與Home、Promo一致顯示Log In／Register；登入、註冊與收藏位於個人資料面板。

帳戶狀態、金額與紀錄均為示範；未串接帳戶、2FA、KYC或金流。複製ID有成功／失敗提示，Log Out確認後離開預覽返回登入，不清除收藏。

前台共用內容起點（上14px／左右16px）與穩定捲軸空間，固定導覽使用相同置中基準，路由切換在繪製前回頂部，減少Home／Promo切換位移。

## Wallet 錢包預覽

[Wallet 頁](https://fayipon.github.io/kun-king/#/wallet)依 Design/wallet-mobile.png 還原，沿用 480px 共用前台 Header 與導覽，右側為 Log In／Register。底部 Wallet 及 My 的 Wallet & transactions 直接進入。

提供餘額卡顯示／隱藏、流水進度、期間統計、交易類別與期間篩選、展開完整示範清單、交易詳情及客服說明。示範日期固定於 2026 年 9 月（Today 為 2026-09-10）；交易清單為選取的範例紀錄，並非統計數字的完整帳本。

Deposit／Withdraw 僅顯示服務準備中及登入／註冊入口，不接受付款、不提交提款、不變更餘額。詳見 [Plans/025](Plans/025-wallet-page.md) 與 [Finish/025](Finish/025-wallet-page.md)。

## Affiliate 邀請獎勵預覽

[Affiliate 頁](https://fayipon.github.io/kun-king/#/affiliate) 依 Design/invite.png 呈現三欄統計、原圖旅程地圖、五階段寶箱、邀請進度與最近好友。初始5／10 invites為金色未領寶箱，15／20／25為灰色鎖箱；領取後對應寶箱變綠色打勾，未領金箱周圍柔和發光；旗幟字樣柔和變色；減少動態時改為靜態高亮。

View Rewards／寶箱節點顯示門檻；Invite Friends 提供示範碼、註冊連結、複製與登入／註冊入口；Open Chest 提供浮起、輕抖、掀蓋光效及獎勵面板；View all 與好友列可查看完整示範紀錄。原生 dialog 支援 Esc、遮罩、X、焦點回復與捲動鎖。

資料集中於 src/affiliate/data.ts，示範日固定 2026-09-11。未連接真實推薦關係、資格判定或獎勵服務，開箱取消不扣箱；Claim preview 只扣本次頁面的示範箱數，不變動 Wallet。詳見 [Plans/027](Plans/027-affiliate-page.md)、[Finish/027](Finish/027-affiliate-page.md)、[素材紀錄](Design/affiliate/README.md)。

### Open Chest 動畫

Open Chest 依序預覽5／10次門檻寶箱：浮起→輕抖三下→停頓→掀蓋及光芒→₱50示範獎勵卡。Claim preview 後剩餘箱數2→1→0；中途取消不扣箱。Reset preview、刷新或離開重進會恢復2箱；沒有真實發獎或Wallet入帳。減少動態時直接顯示靜態獎勵卡。

詳見 [Plans/035](Plans/035-open-chest-effect.md)、[Finish/035](Finish/035-open-chest-effect.md) 及 [開箱素材紀錄](Design/chest/README.md)。
