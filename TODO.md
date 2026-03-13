```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

# TODO.md — SnapTranscript 行動版

> 最後更新：2026-03-13

---

## 目前進度

**Slice 1–7 完成並部署至 Vercel。UI 功能驗證中。**
Vercel URL: https://snap-transcript.vercel.app/

---

## 下一步：測試 → 上線

### Step 1：Git + GitHub + Vercel ✅ 完成

- [x] git repo 初始化 + GitHub push
- [x] Vercel 部署（snap-transcript.vercel.app）
- [x] COOP/COEP headers 設定（FFmpeg.wasm 需要）
- [x] bundle.js tracked in git（確保 Vercel 服務正確版本）
- [ ] **GitHub Default Branch 改 master → main**（還沒做，需要進 GitHub Settings → General）
- [ ] 改完後刪除 origin/master：`git push origin --delete master`

### Step 2：Vercel 瀏覽器測試（進行中）

- [x] UI 正常顯示（header、底部 tab bar、選檔區）
- [x] i18n 多語言切換正常
- [x] 🔒 Privacy modal 顯示正常
- [x] ⚙️ Settings modal 顯示正常（含 Display Language）
- [x] History Tab Page（搜尋 + 重命名）
- [ ] 選音訊檔 → 顯示檔名 + 時長 → 翻譯開關（待測）
- [ ] DebugPanel 5-tap 觸發（待測）
- [ ] Start Transcription → FFmpeg 壓縮（最高風險點，待測）
- [ ] Gemini 轉錄（需要真實 API Key，待測）
- [ ] ResultView 顯示、Tab 切換、Save、Q&A（待測）
- [ ] History 儲存 + 開啟（待測）

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

## 已完成

- [x] Slice 1：config / ApiKeyService / ApiKeyModal
- [x] Debug 工具：DebugLogger + DebugPanel（5-tap 觸發）
- [x] Slice 2：音訊選檔 UI（file picker、檔案資訊、翻譯設定）
- [x] Slice 3：FFmpeg.wasm 壓縮 + 切割（`js/ffmpeg_service.js`）
- [x] Slice 4：Gemini 轉錄 / 翻譯 / 摘要 / 潤飾 / Q&A（`js/transcribe_service.js`）
- [x] Slice 5：ResultView（4 tabs + Q&A + Save + Share）
- [x] Slice 6：歷史記錄（`js/history_service.js`）
- [x] Slice 7：AdMob（`js/admob_service.js`）+ SettingsModal
- [x] 所有 CSS（processing / result / history / settings）
- [x] `vercel.json`（build 設定 + COOP/COEP headers for FFmpeg.wasm）
- [x] FFmpeg.wasm 本地化（www/ffmpeg/，download script）
- [x] i18n 完整（10 語言，全部元件 data-i18n 屬性）
- [x] PrivacyInfoModal（🔒 按鈕）
- [x] 底部 Tab Bar（🏠 首頁 / 📋 歷史）
- [x] History 改為 Tab Page（搜尋 + inline 重命名）
- [x] Vercel Production Branch 問題診斷 + 修復（master → main）
- [x] bundle.js commit 進 git（bypass Vercel build cache）

---

## 已決定（不再討論）

- [x] 商業模式：完全免費 + AdMob 廣告
- [x] BYOK：用戶填自己的 Gemini API Key，存手機本地，不上傳
- [x] 無後端：伺服器月費 $0
- [x] 所有 AI 功能全開放（無訂閱、無付費牆）
- [x] 歷史記錄：本機無限量純文字
- [x] 音訊前處理：FFmpeg.wasm Opus 32kbps + 30 分鐘切割
- [x] 翻譯 / UI 語言：10 種（繁中、簡中、英、日、韓、法、德、西、葡、泰）
