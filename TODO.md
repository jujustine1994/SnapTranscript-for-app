```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

# TODO.md — SnapTranscript 行動版

> 最後更新：2026-03-12

---

## 目前進度

**Slice 1–7 程式碼全部寫完，build 成功。**
尚未測試（瀏覽器 / TestFlight）。

---

## 下一步：測試 → 上線

### Step 1：設定 Git + GitHub（還沒做）

- [ ] 在此目錄初始化 git repo：`git init`
- [ ] 建立 GitHub repo（`SnapTranscript-app` 或類似名稱）
- [ ] Push 到 GitHub
- [ ] 確認 `docs/CREDENTIALS.md` 在 `.gitignore`（已設定，確認一次）

### Step 2：Vercel 瀏覽器測試（等 Git 設好後做）

`vercel.json` 和所有設定已就位，只差 push。

- [ ] 到 `vercel.com` → New Project → Import GitHub repo
- [ ] Vercel 會自動讀取 `vercel.json`（build: `node build.js`，output: `www`）
- [ ] 確認以下功能在瀏覽器可用：
  - [ ] UI 正常顯示（header、選檔區、CSS 沒有壞掉）
  - [ ] ApiKeyModal 可開啟、填入 Key、儲存
  - [ ] 選音訊檔 → 顯示檔名 + 時長 → 翻譯開關
  - [ ] DebugPanel：點 "SnapTranscript" 標題 5 次 → 浮出 debug 面板
  - [ ] Start Transcription → FFmpeg 壓縮（瀏覽器有 WASM 支援，這是最高風險點）
  - [ ] Gemini 轉錄（需要真實 API Key）
  - [ ] ResultView 顯示、Tab 切換、Save、Q&A
  - [ ] History 清單

### Step 3：GitHub Actions CI/CD → TestFlight

- [ ] 建立 `.github/workflows/ios-build.yml`
- [ ] 設定 GitHub Secrets：
  - `APPLE_CERTIFICATE`（Base64 encoded .p12）
  - `APPLE_CERTIFICATE_PASSWORD`
  - `APPLE_PROVISIONING_PROFILE`
  - `APPLE_TEAM_ID`
- [ ] `npx cap add ios`（workflow 裡跑，或在 Mac 上跑一次）
- [ ] `ios/App/App/Info.plist` 填入 `GADApplicationIdentifier`（AdMob App ID）
- [ ] 推 code → Actions 自動 build → 上傳 TestFlight

### Step 4：TestFlight 驗證

- [ ] 安裝 TestFlight build
- [ ] 驗證原生插件：
  - [ ] `@capacitor/preferences`：API Key 存取（iOS Keychain）
  - [ ] `@capacitor/filesystem`：歷史記錄存取（Documents）
  - [ ] AdMob：廣告初始化 + interstitial 顯示
  - [ ] 麥克風權限（錄音功能 — Slice 8 待做）
- [ ] FFmpeg.wasm 在 WKWebView 是否正常（single-thread core，最高風險）
- [ ] 完整 end-to-end：選檔 → FFmpeg → Gemini 轉錄 → 結果頁 → 存歷史

---

## 待做功能（程式碼有 TODO 標記）

- [ ] **錄音功能**（Slice 8）：目前 "Start Recording" 按鈕是 disabled placeholder
  - 實作 `js/recording_service.js`（MediaRecorder API）
  - 錄音計時 UI（紅點 + 時間顯示）
  - 停止錄音 → 直接進 transcription pipeline
- [ ] **離線偵測**：偵測無網路 → disable Start 按鈕 + 顯示提示
- [ ] **Info.plist 隱私描述**：麥克風、Photos（送審必填，否則被拒）
- [ ] **AdMob Android**：Android 版 App ID / Ad Unit ID（待申請）
- [ ] **Bundle ID 最終確認**：`com.cthcompany.snaptranscript`（目前暫定）
- [ ] **App Store 上架資料**：截圖、描述、關鍵字

---

## 已完成（本 session）

- [x] Slice 1：config / ApiKeyService / ApiKeyModal
- [x] Debug 工具：DebugLogger + DebugPanel（5-tap 觸發）
- [x] Slice 2：音訊選檔 UI（file picker、檔案資訊、翻譯設定）
- [x] Slice 3：FFmpeg.wasm 壓縮 + 切割（`js/ffmpeg_service.js`）
- [x] Slice 4：Gemini 轉錄 / 翻譯 / 摘要 / 潤飾 / Q&A（`js/transcribe_service.js`）
- [x] Slice 5：ResultView（4 tabs + Q&A + Save + Share）
- [x] Slice 6：歷史記錄（`js/history_service.js` + `HistoryModal.js`）
- [x] Slice 7：AdMob（`js/admob_service.js`）+ SettingsModal
- [x] 所有 CSS（processing / result / history / settings）
- [x] `vercel.json`（build 設定 + COOP/COEP headers for FFmpeg.wasm）
- [x] `pnpm start` 修正（改 serve `www/` 而非根目錄）
- [x] PITFALLS.md 加入 FFmpeg.wasm WKWebView 風險說明

---

## 已決定（不再討論）

- [x] 商業模式：完全免費 + AdMob 廣告
- [x] BYOK：用戶填自己的 Gemini API Key，存手機本地，不上傳
- [x] 無後端：伺服器月費 $0
- [x] 所有 AI 功能全開放（無訂閱、無付費牆）
- [x] 歷史記錄：本機無限量純文字
- [x] 音訊前處理：FFmpeg.wasm Opus 32kbps + 30 分鐘切割
- [x] 翻譯 / UI 語言：10 種（繁中、簡中、英、日、韓、法、德、西、葡、泰）
