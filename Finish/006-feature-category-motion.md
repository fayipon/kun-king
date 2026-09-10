# Feature 分類與轉場驗收

- 日期：2026-09-10
- 計畫：[Plans/006](../Plans/006-feature-category-motion.md)
- 狀態：已完成實作與線上部署；F07 實測限制如下。

## 實作

新增第六項 Feature 與徽章圖示，使用既有精選集合（22 款，與 Popular 相同）。分類採六等寬欄；選中背景 300ms 自然減速滑移，Icon 上提 3px、放大 1.1 倍並顯示淡光暈，顏色同步轉場。CSS transition 直接銜接最新狀態，無額外動畫計時器；收藏頁隱藏分類背景。減少動態效果 CSS 停用 transition 與圖示 transform。

## 驗收與測試

| 用例 | 結果 |
| --- | --- |
| F01 | 通過：六項順序與 Feature 22 GAMES 已於瀏覽器確認 |
| F02 | 通過：選中背景位置、300ms 曲線與 Icon matrix(1.1,0,0,1.1,0,-3) 已確認；390px 截圖無裁切或跳版 |
| F03 | 通過：快速依序切換及重複點擊後停留 Feature；採原生 CSS transition，未新增計時器或重播 keyframe |
| F04 | 通過：測試 Feature 搜尋 Fortune Ox、Mahjong Ways 及清除搜尋，結果符合精選集合 |
| F05 | 通過：測試及瀏覽器確認 Favorites 隱藏背景，返回 ALL 恢復選中 |
| F06 | 通過：瀏覽器 Enter 切換 ALL，焦點外框為 solid |
| F07 | 部分驗證：已檢查 reduced-motion CSS，transition 為 none、選中圖示 transform 為 none；本輪未在瀏覽器切換作業系統偏好實測 |
| F08 | 通過：320／390／430／1280px 六項 y 座標一致，按鈕高度 72px，文字無截斷，無水平溢出 |
| F09 | 本機通過：npm test 14 項通過，npm run build 與 git diff --check 通過；線上通過：六分類、Feature 22 GAMES、快速切換及動畫樣式皆已確認 |

## 限制

手機尺寸以瀏覽器 viewport 模擬，未使用實體手機；Perya 延續既有準備中提示。Feature 與 Popular 依核准計畫共用精選集合。

## 部署

- 版本：`78a8f71`，已 push 至 main。
- [GitHub Actions](https://github.com/fayipon/kun-king/actions/runs/34469742343)：success。
- [正式網站](https://fayipon.github.io/kun-king/#/frontend)：已確認六分類、快速切換後 Feature 狀態、300ms 背景轉場及 Icon 上提縮放。
