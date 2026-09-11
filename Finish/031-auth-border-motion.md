# Login／Create Account 邊框效果

- 對應 Plans/031-auth-border-motion.md。
- 兩頁 `.auth-panel` 加上與首頁 Welcome Rewards 相同色票、300%漸層背景、9秒ease-in-out循環及青綠／紫色柔光。
- 遮罩偽元素僅繪製1.5px邊框，pointer-events:none；卡片原半透明背景、尺寸及X保持。
- 瀏覽器登入／註冊截圖均確認邊框顯示；計算樣式確認9s動畫、相同120deg漸層與exclude遮罩。登入切換註冊連結正常。
- 既有減少動態規則涵蓋卡片及偽元素，停用動畫後保留靜態漸層；本次未切換作業系統偏好實測。
- npm run build通過。純CSS外觀修改未新增測試；部署工作流程會執行既有完整測試。
