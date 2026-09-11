# 登入／註冊 X 移入卡片

- 對應：[Plans/028](../Plans/028-auth-panel-close.md)。
- 已將 Header 的 X 移至登入／註冊 `.auth-panel` 右上角，返回前台行為不變。
- `.auth-close` 與 `.auth-dialog-close` 共用 CSS：透明背景、40×40px 點擊區、21px X、top/right 8px，保留鍵盤外框與 hover 薄荷色。
- 卡片頂部52px預留空間，避免與登入標題／註冊首欄重疊。
- 瀏覽器：320px登入、560px註冊截圖確認；X位於卡片內，含邊框右／上距9px，與內容有4px淨空。Header 已無X。點擊返回 `#/frontend` 正常。
- 開啟 Terms 彈窗核對計算樣式：兩個 X 都是40×40px、rgba(0,0,0,0)背景、rgb(241,247,245)前景。
- `npm test`：57/57通過；`npm run build`：通過。未新增僅重複樣式實作的測試。
- 已推送2c76e87；GitHub Actions 34544697055部署成功。線上重新整理後，登入與註冊均確認 panelClose=true、headerClose=false；登入按鈕計算寬度40px。正式JS index-EzB9NSkV.js／CSS index-C5EC-Bxq.css與本次建置一致。
