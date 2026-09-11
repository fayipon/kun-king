# Open Chest 四階段效果

- 計畫：[Plans/035](../Plans/035-open-chest-effect.md)。
- 日期：2026-09-11。實作與本地驗證完成；部署結果另補記。

## 完成範圍

Affiliate Open Chest 現在直接啟動1秒浮起、0.6秒輕抖加0.1秒停頓、0.9秒掀蓋與光束粒子，再顯示原圖金箱／遊戲雞插畫和₱50示範獎勵卡。

使用reducer管理idle／lifting／shaking／revealing／reward／claimed，依序使用5、10門檻。只在Claim preview後扣除本次記憶體中的示範箱數；取消不扣箱，Wallet不變。12/15維持，15門檻顯示灰色鎖箱，兩次領取後Open Chest (0)停用並聚焦Reset preview；重設或離頁刷新恢復2箱。

採獨立原生dialog、共用圓框X、Esc／遮罩／Not now、Tab循環與捲動鎖。取消恢復Open Chest焦點，零箱時恢復到Reset preview。卸載清除計時器與媒體查詢監聽。

## 驗證

- `npm test`：7個檔案、63項全部通過。
- `npm run build`：TypeScript及Vite通過。
- 逐階段時序、每階段取消、卸載清除timer、重複啟動／領取、兩次扣箱、零箱、重設、離頁重進、Wallet餘額不变均有自動測試。
- 減少動態測試涵蓋初始啟用、播放途中切換：直接進入reward且不再被舊timer推進。CSS也停用動畫與轉場；未在作業系統實際切換偏好。
- 瀏覽器已確認浮起／抖動金箱及掀蓋分層畫面，原圖獎勵插畫正常載入，取消後保留2箱與焦點。
- 獨立瀏覽器分頁完整點擊流程：5門檻領取後1箱，10門檻後0箱停用；兩個節點恢復原圖綠色打勾箱，標記Preview claimed，15仍Next chest、差3人。Reset preview恢復2箱。
- 320×700、390×844、480×900與1280×900檢查。320px沒有水平溢出，短視窗壓縮插畫高度；480px獎勵面板352px，dialog scrollWidth/clientWidth一致。桌面保留前台480px且獎勵面板352px置中。
- 鍵盤雙向循環、Esc／遮罩取消、最後一箱後焦點回Reset preview皆由測試驗證；本地實際領取也確認焦點回復。

## 原圖對照與限制

插畫沿用原圖，文字與操作是HTML；未重生成地圖。浮起箱蓋為2D分層鉸接動畫，並非3D模型；取出節點的底圖以空平台遮罩處理。獎勵面板新增示範標示與確認／取消按鈕，沒有照抄原圖「₱50 added to your account」的真實入帳宣稱。

原稿12次邀請卻開15門檻的矛盾已修正為5／10已達成門檻。金額只是視覺樣本，沒有推薦／發獎API或持久化。素材詳細紀錄見 [Design/chest](../Design/chest/README.md)。

## 狀態修正

初始5、10為原圖金色未領箱，15、20、25為灰色鎖箱。第一次Claim後只將5變為原圖打勾箱；10仍金色，15仍鎖定。瀏覽器已核對初始與第一次領取畫面，新增狀態回歸測試涵蓋Reset。

未領金箱恢復原本呼吸光暈與交錯星光；已領／鎖箱不閃光。瀏覽器已確認5與10節點，Vite建置通過。

## 部署結果

提交 1cef527 已推送main；[GitHub Pages部署](https://github.com/fayipon/kun-king/actions/runs/34550426902)成功，線上HTML確認載入本次index-Vwe4RGEW.js。63項測試與建置通過。
