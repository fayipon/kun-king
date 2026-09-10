# Header、搜尋及遊戲卡片驗收

- 日期：2026-09-10
- 計畫：[Plans/007](../Plans/007-header-search-game-cards.md)
- 狀態：已完成，本機與線上驗收通過。

## 完成內容

Header 使用 sticky 持續置頂，透過共用高度變數調整分類、列表、Help 及搜尋的捲動間距。搜尋以 focus-within 高亮完整圓角容器，取消 input 自身方形焦點框；其他按鈕焦點樣式保留。遊戲卡片移除小字列，箭頭改與名稱同列，長名稱省略且箭頭固定寬度。

## 驗收結果

| 用例 | 結果 |
| --- | --- |
| H01 | 通過：捲至列表及 Help 後 Header top=0，桌面寬度480px |
| H02 | 通過：Explore 捲動後 Header bottom=72、列表 top=87；Help top=402，皆未被遮擋；其他入口共用已調整的 scroll-margin |
| H03 | 通過：捲動後遊戲對話框可開啟、關閉，使用原生 dialog top layer |
| H04 | 通過：搜尋聚焦時 input outline=none，容器 border=rgb(93,245,194)、radius=9px，390px 截圖確認完整高亮；既有搜尋及清除測試通過 |
| H05 | 通過：Tab 從搜尋 input 移至 Clear search，按鈕 outline=solid，Enter 可清除；容器 focus-within 保留 |
| H06 | 通過：共用卡片 markup 已移除 metadata；瀏覽器列表 metadata 數量0、全部箭頭宽度10px，既有分類及收藏測試通過 |
| H07 | 通過：320／390／430／1280px 無水平溢出、箭頭完整，名稱 text-overflow=ellipsis |
| H08 | 本機通過：npm test 14 項、npm run build、git diff --check 通過；線上通過：sticky Header、搜尋青綠外框與 input 無 outline、卡片 metadata 為0已確認 |

## 限制

使用桌面瀏覽器模擬手機尺寸，未於實體手機測試。

## 分隔線補充修改

依使用者直接修改指示移除分類列下方分隔線，原1px邊框改為等量內距保留布局；瀏覽器確認 border-bottom-width=0px，padding-bottom=18px。補充版本 `2b41c56` 建置通過並已推送，Pages 已發布，線上 border-bottom-width=0px、padding-bottom=18px。

## 部署結果

- Header／搜尋／卡片：`f054edd`，[Actions](https://github.com/fayipon/kun-king/actions/runs/34470657062) 成功。
- 分隔線補充：`2b41c56`，[Actions](https://github.com/fayipon/kun-king/actions/runs/34471060318) 成功。
- 正式前台已重新載入驗證兩次更新。
