# 登入／註冊 X 移入卡片

- 對應：[Plans/028](../Plans/028-auth-panel-close.md)。
- 已將 Header 的 X 移至登入／註冊 `.auth-panel` 右上角，返回前台行為不變。
- `.auth-close` 與 `.auth-dialog-close` 共用 CSS：透明背景、40×40px 點擊區、21px X、top/right 8px，保留鍵盤外框與 hover 薄荷色。
- 卡片頂部52px預留空間，避免與登入標題／註冊首欄重疊。
- 瀏覽器：320px登入、560px註冊截圖確認；X位於卡片內，含邊框右／上距9px，與內容有4px淨空。Header 已無X。點擊返回 `#/frontend` 正常。
- 開啟 Terms 彈窗核對計算樣式：兩個 X 都是40×40px、rgba(0,0,0,0)背景、rgb(241,247,245)前景。
- `npm test`：57/57通過；`npm run build`：通過。未新增僅重複樣式實作的測試。
- 已推送2c76e87；GitHub Actions 34544697055部署成功。線上重新整理後，登入與註冊均確認 panelClose=true、headerClose=false；登入按鈕計算寬度40px。正式JS index-EzB9NSkV.js／CSS index-C5EC-Bxq.css與本次建置一致。

## 使用者更正：圓框 X

先前誤將「彈窗」理解為服務說明面板；使用者指定的是 Welcome Rewards 帶圓框版本。已將登入／註冊的關閉控制改為與 `.kk-welcome-close` 相同：30px、50%圓角、1px #b394c787 邊框、#110b20bd 底色、#ead9ff 前景、18px X、top12/right11。仍位於表單卡片內右上角。

本地瀏覽器截圖及計算樣式確認圓框／底色／圖示尺寸正確，正式建置通過。此段取代上方透明樣式的最終規格。

最新局部截圖再次更正：補上常駐外圈，以 ::after inset -7px、2px淡紫邊線呈現；內圈1px青綠。瀏覽器已確認 focused=false 時仍呈現雙圈。登入與註冊共用此控制，位置不變，正式建置通過。此為最終外觀規格。

配色更正：最終為外圈青綠 #5df5c2、內圈灰色 #8b9da8，取代前述內青綠／外淡紫。雙圈位置和大小不變。
