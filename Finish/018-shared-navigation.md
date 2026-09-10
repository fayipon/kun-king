# 共用前台導覽驗收

- Plans/018已核准；已完成部署並驗證。
- 新增FrontendLayout、Header、BottomNav；首頁／Promo移除各自Header與導覽，Godot示範页套用框架。登入／註冊、項目入口、後台保留原布局。
- 路由驅動Home／Promo／My收藏選中狀態；Wallet／Affiliate／My共用面板。首頁與收藏以路由切換，Home清除收藏篩選。
- 清除Promo對Header／底部導覽的專屬樣式，寬度沿用480px，Header統一72px。
- 瀏覽器實测：首頁及Promo單一Header／BottomNav，桌面480px；320／390／480px視窗沒有水平溢出，Header與導覽等寬。
- Godot保留資源檢查與啟動條件，沿用前台英文及深色樣式；尚未提供Godot匯出，實際示範啟動未測。
- 面板前往首頁遇到歡迎彈窗仍正確鎖定背景，避免兩個面板的捲動清理互相覆寫。
- 27項測試通過；包含各前台路由導覽唯一性、登入／註冊與後台排除、收藏往返、既有活動／輪播／登入／歡迎彈窗回歸。

- npm test：27項通過；npm run build通過。GitHub Actions 34484116362成功，部署版本a747aac。線上確認Promo單一共用Header／導覽、480px；返回首頁不重彈、刷新後再次彈出。
