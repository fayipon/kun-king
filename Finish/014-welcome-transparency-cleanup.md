# 歡迎彈窗透明殘影驗收

- Plans/014 已核准；本機完成，待部署。
- 原 WebP 含 alpha；圖片工具重製的兩版不含 alpha 且帶格紋，均未套用。
- 使用瀏覽器 SVG alpha transfer：clamp(6a−5,0,1)，移除低透明背景霧層並保留高透明度主體及過渡邊緣。取消素材額外 drop-shadow。原始圖片保留。
- 深色面板底層原本不透明，維持原樣；全頁 blur 8px 與9秒漸層框保留。
- 瀏覽器檢查390×844、320×480與桌面；主體完整，未見矩形底或大範圍光霧殘影，短視窗可捲動。
- 實際驗證重開、X關閉與 Create Account 導向正常。
- npm test：19 項通過；npm run build 通過。
- 限制：已以目前 Chromium 瀏覽器驗證，尚未實測 Safari／Firefox。
