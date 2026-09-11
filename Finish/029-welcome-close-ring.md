# 首頁 Welcome Rewards 關閉 X

- 對應 Plans/029-welcome-close-ring.md。
- 僅修改 src/landing/welcome.css：原內圈保留，2px薄荷青綠外圈、3px間距改為常駐；鍵盤焦點增加內側細線。
- 使用者截圖確有外觀差異；先前僅憑原規則未改就否定外觀改變並不準確。舊外圈依賴焦點，現在失焦也保持圖一外觀。
- 瀏覽器點擊彈窗標題移開焦點後，focused=false，outline仍為 rgb(93,245,194) solid 2px、offset3px；截圖確認雙圈。X關閉操作正常。
- npm test：57/57通過；npm run build：通過。
- 登入／註冊檔案未修改。
