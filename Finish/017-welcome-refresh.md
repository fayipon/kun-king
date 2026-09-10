# 首頁彈窗刷新驗收

- Plans/017已核准；已完成部署並驗證。
- 取消sessionStorage關閉記錄，改用本次載入的記憶體狀態。重新整理重設；SPA切頁保留。
- 瀏覽器實測：首頁關閉→Promo→Home不重彈；重新整理Home再次彈出。Promo刷新→My Favorites→首頁首次顯示，body overflow為hidden，關閉後恢復。
- 測試涵蓋舊儲存記錄不影響顯示、重新載入狀態重設、重掛載不重彈、手動重開、各關閉方式、註冊導向與捲動恢復。

- npm test：27項通過；npm run build通過。GitHub Actions 34484116362成功，部署版本a747aac。線上確認Promo單一共用Header／導覽、480px；返回首頁不重彈、刷新後再次彈出。
