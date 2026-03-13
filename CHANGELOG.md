```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

# CHANGELOG.md — SnapTranscript 行動版

---

## 現狀總覽

- **上架狀態**：尚未開始開發
- **既有功能**：無
- **尚未完成**：全部

---

## 版本記錄

### 2026-03-12 — 架構大轉向（Pivot）

**商業模式改變：**
- 放棄訂閱制（Free / Pro / Pro-Max），改為完全免費 + AdMob 廣告
- 所有 AI 功能全開放，無付費牆

**技術架構改變：**
- 移除 Firebase（Auth / Firestore / Storage / Cloud Functions）
- 移除 Vercel Serverless Functions
- 移除 RevenueCat
- 改為 BYOK 模式：用戶填入自己的 Gemini API Key，App 直接從手機呼叫 Gemini API
- API Key 加密存於手機 SecureStorage，不上傳任何伺服器
- 歷史記錄改為本機無限量儲存（Capacitor Filesystem）
- 新增 AdMob 廣告（Interstitial，轉錄完成後顯示）
- 伺服器月費降為 $0

**保留不變：**
- FFmpeg.wasm 音訊壓縮（Opus 32kbps）+ 切割（每 30 分鐘）
- 支援 10 種翻譯語言 / UI 語言
- iOS 優先策略

### 2026-03-12 — Slice 1 程式碼審查 + 整合修復

**程式碼審查發現：**
- Slice 1 核心模組（config / ApiKeyService / ApiKeyModal / DebugLogger / DebugPanel）均已寫好
- 發現 4 個整合問題：
  1. `app.js` 未 import / 初始化 DebugPanel
  2. `index.html` h1 缺少 `id="app-title"`，DebugPanel 5-tap 觸發失效
  3. `language_manager.js` + `i18n_data.js` 仍為 BBC 內容
  4. `I18N.md` / `PITFALLS.md` 有 pivot 前的舊內容（訂閱制、Firebase）

**修復：**
- `app.js`：加入 DebugPanel import + init
- `index.html`：h1 加上 `id="app-title"`

**確認開發策略：**
- 無 Mac/Xcode 環境 → 用 GitHub Actions 打包送 TestFlight
- Debug 靠 in-app DebugPanel（5-tap 觸發，可複製 log）
- 所有邏輯先在瀏覽器（`pnpm start`）測完，TestFlight 僅驗原生插件
- FFmpeg.wasm 是最大風險點，在 Slice 4 優先驗證

---

### 2026-03-12 — 專案建立

- 完成需求訪談
- 建立專案文件骨架（README / ARCHITECTURE / CHANGELOG / PITFALLS / TODO）
