# 手機版前台 Landing Page 驗收及測試報告

- 對應計畫：[003-mobile-frontend-landing](../Plans/003-mobile-frontend-landing.md)
- 執行日期：2026-09-10
- 狀態：驗收完成；本機測試、CI 建置與 Pages 線上驗收通過。
- 線上前台：https://fayipon.github.io/kun-king/#/frontend
- 部署版本：`73b0166`；[Actions 執行記錄](https://github.com/fayipon/kun-king/actions/runs/34465904106)，build 與 deploy 皆 success。

## 完成內容

- `#/frontend` 改為深色手機遊戲大廳，桌面置中最大 480px。
- 建立三張 ImageGen 原創 Banner，約 450ms 淡入與位移轉場、5 秒輪播、手動控制、滑動、暫停及減少動態效果支援。
- 從使用者提供的 134 張遊戲封面挑選 32 張，建立名稱與示範分類；原檔完整保留。
- 實作搜尋、分類、展開列表、localStorage 收藏、原生 dialog 資訊面板及固定底部導覽。
- 原 Godot 承載功能保留在 `#/play`，從前台頁尾遊戲說明可進入。
- README 更新前台功能與路由；Pages 工作流程加入 `npm test`。

## 素材與產物

- 三張原圖：`Design/banners/crown.png`、`arcade.png`、`portal.png`。
- 工具與完整提示詞：[Banner 素材紀錄](../Design/banners/README.md)，使用內建 ImageGen。
- Web Banner：`public/banners/`，960px WebP，三張合計 155,100 bytes。
- 遊戲 Web 封面：`public/games/`，32 張、320px，合計 991,780 bytes；列表之外的原圖不在執行時載入。
- 生產 JS 約 286.61 kB（gzip 92.37 kB），CSS 約 18.11 kB（gzip 5.09 kB）；圖片另計。

## 環境與驗證方式

- 本機 Windows、Node.js 24.15.0，TypeScript + Vite 7.3.6 正式建置通過。
- Vitest 5 + jsdom 30：9 項自動化測試通過，使用可控制時間驗證輪播，合成事件驗證滑動與動態效果偏好。
- 內建 Chromium 瀏覽器：實際按鈕、搜尋、收藏重新整理、原生 dialog、鍵盤與版面測試。
- 手機視窗 320／390／430 × 844；DOM 可用寬度分別 305／375／415px（捲軸差異），scrollWidth 等於 clientWidth，皆為三欄。
- 桌面視窗 1280 × 844，大廳寬 480px，置中。

## 用例結果

| 編號 | 實際驗證 | 結果 |
| --- | --- | --- |
| L01 | 本機正式建置通過，9 項自動化測試通過 | 通過 |
| L02 | 瀏覽器查看首屏及頁尾，各區塊完整且無破圖 | 通過 |
| L03 | 自動化逐次推進 5 秒，驗證 1→2→3→1；瀏覽器觀察不同 Banner、固定高度與轉場 | 通過 |
| L04 | 瀏覽器圓點與前後切換正常；自動化驗證左右滑動與垂直捲動不誤切 | 通過 |
| L05 | 自動化驗證播放、暫停、hover、focus、頁籤隱藏及解除暫停；卸載清除計時器 | 通過 |
| L06 | 自動化驗證初始與動態修改 reduced-motion 時停播、手動切換正常；CSS 停用轉場 | 通過 |
| L07 | 瀏覽器搜尋 fortune 得 5 筆、無結果字串得 0 筆；清除與分類恢復正常 | 通過 |
| L08 | 人氣區 9 張展開為 16 張；自動化確認只展開指定區域 | 通過 |
| L09 | 加入 Fortune Rabbit 2、進收藏、重新整理後仍保留；移除後顯示空收藏；儲存失敗另有自動化涵蓋 | 通過 |
| L10 | 三種手機尺寸 DOM 無水平溢出，卡片三欄 | 通過 |
| L11 | 桌面大廳置中，最大 480px | 通過 |
| L12 | Enter 開啟面板、Tab 操作、Escape 關閉並回到觸發卡片；原生 modal 限制背景互動 | 通過 |
| L13 | 四個路由均可直接載入及重新整理；`#/play` 資源缺少時顯示準備中 | 通過 |
| L14 | 線上首屏正常；三張 Banner 圖片均載入，手動切換與 CTA 篩選正常；資訊面板、底部首頁導覽正常；手機 clientWidth 與 scrollWidth 同為 375px、無破圖 | 通過 |

頁尾 DOM 底部 758.875px，固定導覽頂部 777px，內容未遭遮擋。圖片檢查未發現已載入但解碼失敗的圖片。

## 限制

- 手機測試使用桌面瀏覽器視窗模擬，未在實體 iOS／Android 裝置驗證；滑動、背景頁籤與 reduced-motion 的邊界行為由 jsdom 自動化覆蓋。
- 遊戲與排行榜資料為展示編排，不包含遊戲執行檔、登入、真實活動、付款或遊戲引擎串接。
- 收藏僅保存於目前瀏覽器，無跨裝置同步；儲存遭封鎖時顯示提示並保留本次操作。
- Godot Web 成品仍未提供，準備中狀態屬預期。
