# 登入註冊頁驗收

- 日期：2026-09-10
- 計畫：[Plans/008](../Plans/008-login-register-pages.md)
- 狀態：已完成，部署及線上驗收通過。

## 完成內容

- /login、/register 獨立 SPA 頁，透過 HashRouter 發布。
- 內建 ImageGen 原創背景，原圖及提示詞保存於 Design/auth；1200×800 WebP 約114KB。登入與註冊共用素材、採不同構圖；CSS 光暈以5／6秒呼吸循環。
- 登入及註冊表單、密碼顯示、必填／email／密碼長度及確認／條款驗證、Remember me 僅保留識別名稱。
- 社群、忘記密碼與條款說明面板，Guest／品牌返回前台，頁面切換清除密碼；無假登入或註冊成功狀態。
- Header 雙入口、搜尋移至列表標題旁；分類與首個列表間距8px。

## 測試與驗收

| 用例 | 結果 |
| --- | --- |
| A01 | 本機通過：兩頁独立呈現，title 正確，無大廳底部導航；線上兩頁重整通過，英文title／lang正確 |
| A02 | 通過：路由切換測試清除密碼；瀏覽器 Guest 返回前台，Log In 可重新進入 |
| A03 | 通過：Login 空白定位識別欄位，有效提交顯示服務未連接 |
| A04 | 通過：錯誤email、短密碼、不一致及未勾條款均有提示；瀏覽器空白提交焦點為username |
| A05 | 通過：密碼獨立顯示、識別名稱保存與取消移除、重掛載密碼空白，localStorage 無密碼 |
| A06 | 通過：Google／Apple／Facebook、忘記密碼、條款面板皆有開關測試 |
| A07 | 動畫已實作並確認 computed animation-name=auth-breathe；減少動態效果CSS已檢查，本輪無作業系統偏好切換實測 |
| A08 | 通過：瀏覽器確認間距8px，320px搜尋top=74、Header bottom=64；搜尋Fortune有5張卡片，清除正常 |
| A09 | 通過：兩頁320／390／430／1280px無水平或Header溢出；390px截圖確認構圖、欄位與主要按鈕完整 |
| A10 | 本機通過：npm test 17項，npm run build、git diff --check通過；線上通過：#/login、#/register重整正常，背景資源與auth-breathe載入，首頁8px間距及搜尋Fortune 5款確認 |

## 限制

目前僅前端，無真實帳號服務或正式政策；三步驟為流程展示。手機以瀏覽器尺寸模擬，未使用實體裝置。背景霓虹物件合成於圖片，呼吸效果來自獨立光暈。

## 部署

版本 `c1cd60f` 已推送；[GitHub Actions](https://github.com/fayipon/kun-king/actions/runs/34473953561) success。正式 [Login](https://fayipon.github.io/kun-king/#/login) 與 [Register](https://fayipon.github.io/kun-king/#/register) 已驗證。鍵盤由識別欄位 Tab 至 Password，容器青綠邊框正確，有效登入提交顯示未連接服務提示。
