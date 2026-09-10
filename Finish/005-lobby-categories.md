# 前台五分類驗收及測試報告

- 日期：2026-09-10
- 對應計畫：[Plans/005](../Plans/005-lobby-categories.md)
- 狀態：本機驗收通過，待線上部署驗證。

## 完成內容

- 移除 Banner 下方整行標語及其樣式，以 14px 間距直接銜接分類列。
- 分類為 ALL、Hot、Perya、Popular、New，單列五等寬欄。
- Hot、Popular、New 分別對應既有熱門、精選、新作集合；第二張 Banner 的 View picks 對應 Popular。
- 新增 perya 資料欄位，目前皆為 false；Perya 顯示英文準備中提示，可返回 ALL。

## 驗收與測試

| 用例 | 結果與佐證 |
| --- | --- |
| C01 | 通過：瀏覽器確認標語列消失，五分類順序及預設 ALL 正確 |
| C02 | 通過：互動測試驗證各分類選中狀態及遊戲內容，原 New 排除熱門遊戲的測試通過 |
| C03 | 通過：瀏覽器及互動測試確認 Perya 英文提示、無遊戲卡片及返回 ALL |
| C04 | 通過：Popular 搜尋 Mahjong Ways 無結果，切換 ALL 後找到該遊戲；搜尋清除及不存在名稱測試通過 |
| C05 | 通過：互動測試確認 View picks 選中 Popular |
| C06 | 通過：既有收藏保存、重掛載恢復、刪除及面板開關測試通過 |
| C07 | 通過：瀏覽器 320／390／430／1280px 檢查，五項 y 座標一致，按鈕無截斷，頁面無水平溢出；390px 截圖檢視通過，Perya Enter 操作及 solid 焦點外框確認 |
| C08 | 本機通過：npm test 共 13 項通過；npm run build 通過；git diff --check 通過。線上待確認 |

## 限制

- Perya 尚無已確認的遊戲清單，依核准計畫保留空狀態。
- 手機尺寸以桌面瀏覽器 viewport 模擬，未使用實體手機。
