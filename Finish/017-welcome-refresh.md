# 首頁彈窗刷新驗收

- Plans/017已核准；本機完成，待部署。
- 取消sessionStorage關閉記錄，改用本次載入的記憶體狀態。重新整理重設；SPA切頁保留。
- 瀏覽器實測：首頁關閉→Promo→Home不重彈；重新整理Home再次彈出。Promo刷新→My Favorites→首頁首次顯示，body overflow為hidden，關閉後恢復。
- 測試涵蓋舊儲存記錄不影響顯示、重新載入狀態重設、重掛載不重彈、手動重開、各關閉方式、註冊導向與捲動恢復。
