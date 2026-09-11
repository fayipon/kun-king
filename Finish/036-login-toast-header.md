# 登入Toast與登入後Header

- 計畫：[Plans/036](../Plans/036-login-toast-header.md)。
- 日期：2026-09-11；本地完成，尚未提交或部署。

## 完成

- 依Design/toast.png建立深色細框Toast、成功青綠／錯誤紅色色條、圓形狀態圖示與X。
- 視窗右上角依序往下堆疊；各則4秒計時、懸停／聚焦暫停、獨立關閉；跨頁保留。過多通知可捲動，窄版左右保留16px。減少動態時停用浮入動畫。
- 登入驗證失敗顯示欄位錯誤及Toast；通過後進入首頁，顯示Demo sign-in successful · Preview only，並切換共用前台Header。
- Header包括示範餘額13,300.00、Wallet入口、未讀紅點鈴鐺、選單。通知面板清除紅點；選單提供My Account／Wallet／Log Out。原生dialog支援Esc、遮罩、Tab循環、捲動鎖與焦點回復。
- 示範登入只存在記憶體，跨前台路由有效，刷新恢復訪客；未儲存密碼、未接登入API。註冊與第三方登入維持原流程。

## 驗證

- npm test：8檔案65項通過，包含登入轉場、identifier-only儲存、Toast獨立計時與懸停、堆疊與個別關閉、Header切換、通知已讀、焦點回復及登出。
- npm run build：TypeScript／Vite通過；git diff --check通過。
- 瀏覽器實測登入、跨路由到Affiliate、通知面板、選單登出與兩則紅色Toast堆疊。
- 320px檢查Header與換行Toast，修正動畫造成的水平捲軸及scrollbar下安全邊距；390px登入Header、480px通知面板、桌面Header皆已視覺檢查。
- 系統減少動態偏好切換未手動測試；CSS已提供無動畫樣式。大量通知捲動及鍵盤長時間聚焦暫停未做瀏覽器手測。

## 限制

餘額與通知為固定示範資料，與真實帳戶服務無關。本次未改登入背景、地圖或開箱獎勵入帳行為。

Toast錯誤圖示已改為紅色漸層圓底、單一白色驚嘆號，移除雙重圓框；建置通過。
