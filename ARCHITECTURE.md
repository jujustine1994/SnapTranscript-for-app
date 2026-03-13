```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

# ARCHITECTURE.md — SnapTranscript 行動版

> 最後更新：2026-03-12

---

## 專案總覽

- **功能**：手機錄音 / 上傳音訊 → App 端壓縮切割 → 直打 Gemini API → 逐字稿 / 翻譯 / AI摘要 / 潤飾 / 問答 → 本機歷史記錄
- **目標平台**：iOS（優先），Android（待定）
- **商業模式**：完全免費，AdMob 廣告收入

---

## 核心定位

**「專業人士的隱形秘書。手機放上桌，逐字稿、翻譯、AI摘要全部搞定，沒有人知道。」**

### 兩個隱私承諾

| 承諾 | 說明 |
|------|------|
| **No Bot** | 不派機器人加入會議，與會者完全不知道有錄音工具存在 |
| **No Storage** | 音訊與逐字稿只存在用戶手機本地，我們伺服器完全不碰 |

### API Key 隱私承諾

- 用戶自行填入 Gemini API Key
- Key 加密存於手機本地（SecureStorage），**絕對不上傳我們任何伺服器**
- App 直接從手機端打 Gemini API，我們伺服器不做任何中繼
- 首次設定 Key 時顯示明確提示說明此機制

---

## 技術堆疊

| 層級 | 技術 | 用途 |
|------|------|------|
| Frontend | Vanilla JS + Capacitor v8 | App UI |
| 音訊前處理 | FFmpeg.wasm（App 端） | 壓縮（Opus 32kbps）+ 切割（每 30 分鐘） |
| AI | Gemini API（用戶自己的 Key，直接呼叫） | 逐字稿 / 翻譯 / 摘要 / 潤飾 / 問答 |
| Key 儲存 | Capacitor SecureStorage | API Key 加密存本機，不上雲 |
| 本機儲存 | Capacitor Filesystem | 逐字稿、摘要等文字，無限量 |
| 廣告 | capacitor-community/admob | Interstitial（轉錄完成後顯示） |

**伺服器依賴：零。月費：$0。**（僅需 Apple Developer $99/年）

---

## 資料流

```
用戶首次設定 Gemini API Key
    → 加密存入 SecureStorage（不上傳，不經過我們伺服器）
    ↓
用戶選音訊（錄音 or 上傳既有檔案）
    ↓
【App 端前處理 — FFmpeg.wasm，單一 pass】
壓縮（Opus 32kbps）+ 切割（每 30 分鐘）同時完成
→ 輸出：part001.opus, part002.opus, ...
    ↓
【逐段處理，每段獨立，直接從 App 打 Gemini】
App → 讀取本機 SecureStorage 取得用戶 API Key
    → 呼叫 Gemini Files API 上傳 partN.opus
    → 呼叫 Gemini generateContent → 逐字稿文字
    →（若用戶選擇翻譯）呼叫 Gemini 翻譯 prompt → 翻譯文字
    → 處理完畢，App 端刪除暫存音訊片段
    ↓
（所有段落完成後）
App 合併所有段落
輸出格式：[全部原文] + [全部翻譯]（不輪流）
    ↓
存入 Capacitor Filesystem（本機，無限量，用戶自己管）
    ↓
顯示 AdMob Interstitial 廣告
```

---

## 功能清單（全開放，無訂閱限制）

| 功能 | 說明 |
|------|------|
| 逐字稿 | Gemini 語音轉文字，支援多語言輸入 |
| 翻譯 | 10 種語言，原文在上 / 翻譯在下 |
| 重點整理 | AI 摘要要點 |
| 潤飾逐字稿 | 去贅字版本，UI 提供「原稿 / 潤飾版」切換 |
| 逐字稿問答 | 針對當次逐字稿問答（關閉即清除，不存本機） |
| 歷史記錄 | 本機無限量，用戶自己管理 |
| 切割設定 | 自動每 30 分鐘 / 自訂切割點 |

---

## 檔案結構

```
js/
  config.js               # AppConfig（無 Firebase，無 adminUIDs）
  app.js                  # 主 App 物件、初始化
  transcribe_service.js   # FFmpeg 壓縮切割 + 直打 Gemini API
  history_service.js      # 本機歷史記錄（Capacitor Filesystem）
  api_key_service.js      # Gemini API Key 的存取（SecureStorage）
  i18n.js                 # 多語言 UI 支援
  components/
    modals/
      ApiKeyModal.js      # API Key 設定 UI + 隱私說明
      HistoryModal.js     # 歷史清單 UI
      SettingsModal.js    # 設定頁（語言、Key、廣告關閉選項等）

www/                      # build 產出（勿直接編輯）
ios/                      # Xcode 專案（勿手動亂改）
```

**已移除：**
- `api/` — Vercel Serverless Functions（不再需要）
- `functions/` — Firebase Cloud Functions（不再需要）

---

## 本機儲存結構

```
SecureStorage:
  gemini_api_key          # 用戶的 Gemini API Key（加密）

Capacitor Filesystem（Documents/SnapTranscript/）:
  transcripts/
    {timestamp}_{filename}/
      meta.json           # audioFileName, durationSec, segments, hasTranslation, targetLanguage, createdAt
      original.txt        # 完整原文
      translated.txt      # 完整翻譯（nullable）
      polished.txt        # 潤飾版（nullable）
      summary.txt         # 重點整理（nullable）
```

---

## 廣告策略

| 格式 | 時機 | 說明 |
|------|------|------|
| Interstitial | 每次轉錄完成後 | 用戶剛完成任務，接受度較高 |

- 使用 `capacitor-community/admob`
- iOS / Android 各自設定 AdMob App ID

---

## 音訊前處理（FFmpeg.wasm）

- 壓縮 + 切割在同一個 FFmpeg pass 完成（不跑兩次）
- 目標格式：**Opus 32kbps**（語音辨識夠用，壓縮率高）
- 兩小時音訊壓縮後約 30 MB，切成 4 段各約 7.5 MB
- 硬性上限：壓縮後單段超過 **100 MB** 拒絕處理並提示用戶

---

## 離線行為

| 功能 | 離線 | 說明 |
|------|:----:|------|
| 錄音（存本機） | ✅ | 純裝置功能 |
| 上傳 / 轉錄 / 翻譯 / AI功能 | ❌ | 需要連到 Gemini API |
| 查看本機歷史逐字稿 | ✅ | 純本機文字 |

UI 處理：偵測無網路時，disable 上傳按鈕，顯示「目前離線，錄音已儲存，連線後可上傳」。

---

## API 成本估算（用戶自己承擔）

> 基於 Gemini Flash（gemini-flash-latest）定價，2026-03-12 確認

| 項目 | 單價 |
|------|------|
| 音訊輸入 | $1.00 / 1M tokens |
| 文字輸入 | $0.50 / 1M tokens |
| 輸出 | $3.00 / 1M tokens |

**單次 session 成本（以 2 小時會議估算）**

| 情境 | 成本 |
|------|------|
| 僅逐字稿 | ~$0.067 |
| 逐字稿 + 翻譯 | ~$0.137 |
| 重點整理 | +~$0.026 |
| 潤飾逐字稿 | +~$0.140 |
| Q&A 單題 | ~$0.013 |

> 這些費用由用戶自己的 Google API 帳號承擔，開發者無需支付任何 AI 成本。

---

## 重要設定位置

| 項目 | 位置 |
|---|---|
| Gemini API Key | 用戶手機 SecureStorage（`gemini_api_key`） |
| Gemini 模型名稱 | `gemini-flash-latest`（`js/config.js` 內定義） |
| AdMob App ID | `capacitor.config.json` + `AndroidManifest.xml` |
| Bundle ID | `capacitor.config.json`（待確認） |

---

## 上架資訊（待填入）

| 項目 | 值 |
|---|---|
| App ID | 待定 |
| Bundle ID | `com.cthcompany.snaptranscript`（待確認） |
| versionCode | 1 |
| versionName | 1.0.0 |
