# 前台標語移除與五分類

- 狀態：已完成。
- 開始指示：負責人已回覆「開始」，核准本計畫。

## 需求與執行事項

1. 移除 Banner 下方整行標語，包含圖示、`Your next favorite is here.` 及右側 `Explore · Discover · Save`，清除該列占用的空間。
2. 分類列改為五個等寬項目，依序使用精確英文標籤：`ALL`、`Hot`、`Perya`、`Popular`、`New`。保留圖示、選中樣式及可點擊篩選功能。
3. 手機維持單列五欄，調整 Banner 與分類列間距，320／390／430px 下文字完整、按鈕不重疊且無水平溢出。
4. 篩選對應：ALL 顯示全部；Hot 沿用現有 hot 展示集合；Popular 沿用現有 featured 精選集合；New 沿用 fresh 集合。第二張 Banner 的 View picks 連動 Popular。
5. 新增獨立 Perya 分類欄位。目前展示資料沒有已確認的 Perya 遊戲，先以空集合呈現英文 `Perya games are coming soon.`，提供返回 ALL 的操作；待確認遊戲清單後再加入，避免任意將其他遊戲標為 Perya。
6. 更新受影響的互動測試，執行測試與建置，檢查手機版面；完成 Finish 驗收報告，commit、push 並驗證 GitHub Pages。

## 驗收標準

- Banner 下方不再出現整行標語，也沒有原標語列留下的空白高度。
- 分類列恰好五項，順序及大小寫為 ALL、Hot、Perya、Popular、New，預設選中 ALL。
- 點擊各分類後，選中狀態與對應內容同步；Perya 顯示明確英文空狀態，可返回 ALL。
- 搜尋可搭配分類篩選；收藏及 Banner CTA 操作維持可用。
- 320／390／430px 及桌面五欄排列完整，無文字截斷或水平溢出，鍵盤焦點可辨識。
- 測試與正式建置通過，線上版本與核准內容一致；Finish 如實記錄結果及限制。

## 用例

| 編號 | 前置條件與操作 | 預期結果 |
| --- | --- | --- |
| C01 | 開啟前台首頁 | 標語列消失；五分類順序正確，ALL 選中 |
| C02 | 依序點擊 Hot、Popular、New、ALL | 各自顯示對應集合，選中狀態正確，ALL 恢復全部展示 |
| C03 | 點擊 Perya，再使用返回 ALL 操作 | 顯示英文準備中提示，返回後正常顯示遊戲 |
| C04 | 在分類內搜尋存在及不存在的名稱，再清除搜尋 | 結果符合分類及名稱；無結果時提示正常 |
| C05 | 點第二張 Banner 的 View picks | 切換至 Popular 並捲動到遊戲內容 |
| C06 | 加入收藏後切換分類，再開啟 Favorites | 收藏仍存在，遊戲資訊面板可開關 |
| C07 | 320／390／430px 及桌面檢視，使用 Tab 與 Enter | 五項同列且完整，間距合理，鍵盤可操作 |
| C08 | 執行 npm test、npm run build，部署後重做 C01–C03 | 測試、建置及線上驗收通過 |

## 完成報告

已完成實作與 Pages 部署，詳見 [Finish/005](../Finish/005-lobby-categories.md)。
