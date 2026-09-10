# Home／Promo 固定位置驗收

- Plans/020已核准；已完成部署及線上驗證。
- 內容起點統一14px上距、16px左右距，透過共用框架覆蓋Promo差異；各頁內部卡片布局保留。
- html前台模式啟用scrollbar-gutter:stable，BottomNav改用左右0及auto margin置中，避免與內容捲軸基準不同。
- 前台路由使用useLayoutEffect在繪製前回頂部，其他頁面保留原流程；頁面內容仍可捲動。
- 桌面1280px瀏覽器實測：Home與Promo Header／BottomNav x=392.5；Banner x=408.5、y=86、width=448完全一致。歡迎彈窗開啟、關閉，Header／導覽x均392.5。
- My在320px量測內容寬305（捲軸占15px）、Header與BottomNav x均0，無水平溢出。480／390px視覺檢查正常。
- 33項既有及新增測試通過；npm run build通過。
- 限制：位置量測以Chromium為準，尚未實測Safari／Firefox。

- GitHub Actions 34485832689成功，版本74c9b2a。線上My直連正常，Home／Promo Banner x=408.5、y=86相同。
