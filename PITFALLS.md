```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

# PITFALLS.md — SnapTranscript 行動版

---

## 已知問題與解決方案

### Vercel Hobby Plan 10 秒 Timeout
- **問題**：Gemini 轉錄 30 分鐘音訊可能需要 30～90 秒，Vercel Hobby 上限 10 秒
- **原因**：Vercel Hobby plan Serverless Function 執行上限 10 秒
- **解法**：轉錄邏輯改用 **Firebase Cloud Functions Gen 2**（timeout 上限 60 分鐘，免費層 200 萬次/月）；Vercel 只留 Apple / Google OAuth callback（這類請求很快，不會 timeout）
- **禁止**：不升 Vercel Pro，不換其他付費平台

### iOS Google 登入需要 Patch
- **問題**：`@codetrix-studio/capacitor-google-auth` 套件 iOS 會 crash
- **原因**：套件寫死 GoogleSignIn SDK v6，iOS 需要 v7
- **解法**：從 `lib-firebase-auth-member/patches/` 複製 patch 檔，加入 `patch-package` postinstall
- **參考**：`lib-firebase-auth-member/SETUP.md` — iOS Google 登入：必要的 Patch 設定

### FFmpeg.wasm 在 Capacitor WKWebView 的相容性（高風險）
- **問題**：FFmpeg.wasm 預設需要 SharedArrayBuffer（COOP/COEP headers），WKWebView 預設不提供這些 headers
- **原因**：Apple 對 WKWebView 的 cross-origin isolation 限制
- **解法（已採用）**：改用 `@ffmpeg/core-st`（single-thread 版），不需要 SharedArrayBuffer
- **CDN 路徑**：`unpkg.com/@ffmpeg/core-st@0.12.9/...`，確保 `capacitor.config.json` 的 `allowNavigation` 包含 `https://unpkg.com`
- **若 CDN 仍失敗**：改把 core-st 的 `.js` 和 `.wasm` 打包進 `www/ffmpeg/`（增加 ~6MB App 體積），從 local path 載入

### Gemini Files API 大檔上傳穩定性
- **問題**：手機網路不穩時大檔（100MB+）上傳容易中斷
- **原因**：行動網路不穩定
- **解法**：實作 retry 邏輯，分段上傳後個別處理，失敗只重試該段
