# Kun King

React SPA 與 Godot 遊戲整合專案。首頁提供「前台」與「後台」入口。

## 開發流程（必須遵守）

本流程適用於所有後續工作，包含新功能、問題修正、重構、設定與文件變更。PLANS 與 FINISH 分別對應現有的 `Plans/` 與 `Finish/` 資料夾，文件以 Markdown（`.md`）為主。

1. **先寫 Plans**：所有要做的事，必須先在 `Plans/` 建立或更新計畫文件，列出需求內容與預計執行事項，不得直接開始實作。
2. **提交審核並等待開始**：Plans 寫完後，交由專案負責人審核。若有修改意見，先修訂計畫並再次提交；只有在負責人審核後明確說「開始」，才能執行該計畫。提交計畫、未收到回覆或僅通過審核，都不代表可以開始。
3. **依核准計畫執行與驗證**：Plans 必須包含需求內容、驗收標準及用例，實作與測試依照核准範圍進行。若需新增或變更範圍，先更新 Plans，重新審核並收到「開始」後，才能執行變更部分。
4. **完成 Finish 報告**：執行後，在 `Finish/` 撰寫 Markdown 驗收及測試報告，連結對應的 Plans，逐項記錄驗收與測試結果。未測試、未通過或受阻的項目應如實列出，不得標記為完成。

### Plans 文件內容

- 需求內容：目標、工作範圍與預計執行事項。
- 驗收標準：可逐項判定通過或不通過的具體條件。
- 用例：前置條件、操作步驟與預期結果，涵蓋適用的正常、異常及邊界情境。
- 審核與執行狀態：待審核、待開始、執行中或已完成；記錄審核與「開始」指示。

### Finish 文件內容

- 對應計畫：Plans 文件連結與實際完成範圍。
- 驗收報告：逐項對照驗收標準，記錄結果及佐證。
- 測試報告：測試環境、執行日期、用例、實際結果與通過／失敗／未測試狀態。
- 未完成事項：已知問題、限制、受阻原因與後續待辦。

## GitHub Pages 靜態網站

本專案需要透過 GitHub Pages 提供 React SPA 靜態網站，包含首頁、前台及後台入口。發布計畫、驗收標準與用例見 [GitHub Pages 計畫](Plans/002-github-pages.md)。

發布網址：[Kun King](https://fayipon.github.io/kun-king/)。2026-09-10 已完成首次部署與線上驗收，詳見 [驗收及測試報告](Finish/002-github-pages.md)。

- [遊戲前台](https://fayipon.github.io/kun-king/#/frontend)
- [管理後台](https://fayipon.github.io/kun-king/#/admin)

發布來源為 GitHub Actions，工作流程位於 [pages.yml](.github/workflows/pages.yml)。推送程式或設定變更至 `main` 後，會自動使用 Node.js 22、`npm ci`、`npm test` 與 `npm run build` 驗證及建置，再將 `dist/` 部署至 Pages。僅 Markdown 文件變更不觸發部署；也可在 [Actions](https://github.com/fayipon/kun-king/actions/workflows/pages.yml) 選擇 **Run workflow** 手動發布。

儲存庫 **Settings → Pages → Source** 使用 **GitHub Actions**。Vite 使用相對資源路徑 `base: './'`，路由使用 HashRouter，適用 `/kun-king/` 子路徑；分享子頁面時請保留 `#/frontend` 或 `#/admin`。

目前部署包含可互動的 React 手機遊戲大廳。Godot Web 匯出成品未納入 Git，工作流程也尚未匯出遊戲，因此 `#/play` 示範頁顯示準備中；後台為公開預覽骨架，尚無登入或管理 API。Godot 成品的自動發布另列後續計畫。

部署失敗時請查看 Actions 的 build／deploy 記錄；修正後重新推送，或手動重新執行工作流程。發布方式參考 [GitHub Pages 官方文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 快速開始

需求：Node.js 22.22.2+（22.x）、24.15.0+（24.x）或 26+、npm，版本要求包含測試環境；遊戲開發另需 Godot 4.3+ 及相同版本的 Export Templates。

```sh
npm install
npm run dev
```

開啟終端機顯示的本機網址（預設 http://127.0.0.1:5173）。

```sh
npm run build    # TypeScript 檢查與正式建置，輸出 dist/
npm run preview  # 預覽正式建置
npm test         # 輪播、搜尋、分類及收藏互動測試
```

## 頁面

| 路徑 | 說明 |
| --- | --- |
| `#/` | 項目入口：前台與後台 |
| `#/frontend` | 手機遊戲大廳：三張輪播、遊戲搜尋、分類、收藏與資訊面板 |
| `#/play` | Godot 示範：檢查 Web 資源，完成匯出後提供啟動按鈕 |
| `#/admin` | 管理後台骨架：遊戲內容、項目設定、資源管理 |

使用 HashRouter 實現 SPA，重新整理與靜態主機不需額外路由 rewrite。後台目前為開發預覽，尚未實作帳號登入、權限驗證、API 或資料儲存。

## 手機版前台

前台介面使用純英文，包含 Banner、搜尋、分类、收藏、資訊面板、頁尾與無障礙標籤；原始遊戲封面中的文字屬圖片素材。

前台採深色手機優先版面，桌面置中並限制 480px 寬。三張原創 Banner 每 5 秒輪播，支援手指／滑鼠跟手拖曳、短距離回彈及鍵盤左右鍵。圓點疊放於圖片底部正中央，播放／暫停位於右上角，不再顯示頁碼、箭頭或底部控制列。圖片以 650ms 滑移淡化、輕微縮放轉場，眉題、主標、副文案與 CTA 依序滑入淡入。拖曳中、滑鼠停留、鍵盤焦點進入或頁籤隱藏時暫停；啟用減少動態效果時停用自動播放與動畫。

2026-09-10 已部署並驗收，詳見 [手機版前台驗收及測試報告](Finish/003-mobile-frontend-landing.md)。

遊戲可搜尋、依展示分類篩選、展開更多卡片，並在資訊面板加入收藏。收藏使用瀏覽器 localStorage 保存，不跨裝置同步；目前各遊戲只展示資訊，尚未串接實際遊戲。人氣與新作為示範編排。

Banner 下方直接呈現六分類：ALL、Hot、Perya、Popular、New、Feature。Hot 沿用熱門展示集合，Popular 與 Feature 目前共用精選集合，New 為新作集合；Perya 尚無確認的遊戲資料，顯示英文準備中提示，可返回 ALL。詳見 [五分類計畫](Plans/005-lobby-categories.md)。

- 原始遊戲圖：`Design/games/`，共 134 張，保留原檔；目前挑選 32 張作為展示資料。
- 前端封面：`public/games/`，320px WebP，依可見區域延遲載入。
- 原創 Banner：`Design/banners/`；[生成提示詞與素材紀錄](Design/banners/README.md)。使用內建 ImageGen 生成，前端以 `public/banners/` 的 960px WebP 載入，文案為 HTML 疊加。
- 展示資料與元件：`src/landing/`；測試：`tests/landing.test.tsx`。

## Godot 開發與整合

1. 使用 Godot 匯入 `godot/project.godot`，按 F6/F5 可執行互動示範場景。
2. 從 Godot「Editor → Manage Export Templates」安裝與編輯器相符的範本。
3. 將 `godot` 加入 PATH，於儲存庫根目錄執行：

   ```sh
   npm run godot:export
   ```

   或從 Godot「Project → Export → Web」匯出至 `public/game/index.html`。
4. `npm run dev` 開啟 `#/play`（或前台頁尾「遊戲說明 → Godot 示範」），按「啟動遊戲」。React 透過 iframe 載入 Godot Web 成品；切換頁面會卸載遊戲，示範步數不保存。
5. 正式發布請先匯出遊戲，再執行 `npm run build`，將完整 `dist/` 部署至靜態主機。

Web 使用 Compatibility renderer 與單執行緒；主機須正確提供 `.js` JavaScript 與 `.wasm` `application/wasm` MIME 類型。瀏覽器需支援 WebGL 2.0 與 WebAssembly。匯出成品不納入 Git，新的 checkout 需重新匯出；尚未匯出時 Godot 示範頁會顯示準備中。參考 [Godot 官方 Web 匯出文件](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)。

## 專案結構

```text
Design/              設計規格與視覺方向
Plans/               待審核的開發計畫、需求、驗收標準與用例
Finish/              驗收及測試報告
src/                 React SPA、路由與樣式
godot/               Godot 專案、場景、GDScript 與 Web 匯出設定
public/game/         Godot Web 匯出輸出位置
```

首頁採繁體中文、柔和綠色與米色視覺，支援桌機和手機。字型透過 Google Fonts 載入，離線時使用系統字型。

分類切換使用 300ms 選中背景滑移、圖示上提及縮放、光暈與文字顏色轉場；減少動態效果設定下即時切換。詳見 [分類轉場計畫](Plans/006-feature-category-motion.md)。

前台 Header 捲動時保持置頂；搜尋焦點以完整圓角外框呈現。遊戲卡片僅保留名稱與右側箭頭，長名稱省略顯示。詳見 [調整計畫](Plans/007-header-search-game-cards.md)。
