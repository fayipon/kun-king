# 登入註冊留白與色調驗收

- 計畫：[Plans/010](../Plans/010-auth-outer-spacing.md)
- 日期：2026-09-10
- 狀態：已完成，線上驗收通過。

## 完成內容

移除桌面上下24px margin與頁面底部32px padding。保留min-height:100vh，剩餘視窗以純黑填滿。按鈕、品牌、連結、步驟、焦點、勾選框及強調文字統一為首頁#5df5c2，表單及輸入框改用首頁綠灰中性色。保留遊戲雞背景與社群圖示原色、獨立錯誤提示色，未修改表單尺寸及互動。

## 驗收

- S01／S02：兩頁320／390／430／1280px確認page top=0、上下margin=0、padding-bottom=0，無水平溢出。
- S03：註冊輸入、密碼顯示及空白提交正常；表單尺寸與內部間距未更動，390px截圖確認完整。
- S04：npm run build、git diff --check通過；線上確認上下margin及底部padding=0，登入與註冊主要按鈕、Account強調文字皆為#5df5c2。
- S05：主要按鈕computed background為rgb(93,245,194)，與首頁主色一致。
- S06：聚焦輸入邊框、checkbox accent為rgb(93,245,194)；錯誤提示仍rgb(255,180,199)，空白提交顯示4個待修正欄位。

## 限制

手機使用桌面瀏覽器viewport模擬；CSS外觀調整未新增測試或重跑未受影響的表單測試。內容短於視窗時保留純黑填滿，不將表單拉伸至視窗底部。

版本 `886855e` 已推送，[GitHub Actions](https://github.com/fayipon/kun-king/actions/runs/34476446983) success。
