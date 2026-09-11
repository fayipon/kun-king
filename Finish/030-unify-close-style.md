# 三處 X 統一及註冊步驟配色

- 對應 Plans/030-unify-close-style.md。
- 將首頁 Welcome Rewards、Login、Create Account 的關閉樣式集中至 src/close-control.css，由兩份頁面CSS匯入；移除各自重複規則。
- 三處瀏覽器計算樣式一致：30px、1px rgba(179,148,199,.53)內圈、2px rgb(93,245,194)外圈、3px間距。18px X與右上位置保持。
- 註冊三步驟數字、標題、副標均為 #5df5c2；後續步驟圓框及連線為55%青綠，第1步保留較亮邊框及原發光。
- 瀏覽器註冊截圖確認配色；登入 X 返回首頁正常，首頁彈窗及登入／註冊的計算樣式逐一核對一致。
- npm test：57/57通過；npm run build：通過。
