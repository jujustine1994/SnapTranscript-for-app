```
/*  ================================  *\
 *                                    *
 *          C  T  H                   *
 *        created by CTH              *
 *                                    *
\*  ================================  */
```

規則檔: capacitor-app.md
類型: Capacitor 行動 App

# SnapTranscript — 行動版

**專業人士的隱形秘書。手機放上桌，逐字稿、翻譯、AI摘要全部搞定，沒有人知道。**

- 無 Bot 加入會議，零侵入感
- 用你自己的 Gemini API Key，音訊 / 逐字稿完全不經過我們伺服器
- 不綁定任何會議平台，任何場合都能用

專為重視隱私的專業人士設計——商務、金融、法律、顧問，任何不想留下紀錄的場合。

- **平台**: iOS 優先，Android 待定
- **目標市場**: 台灣 / 亞洲繁中用戶
- **App Store**: 尚未上架
- **Package**: `com.cthcompany.snaptranscript`（待確認）

---

## 核心定位

**兩個隱私承諾，競品都沒有同時做到：**

1. **No Bot** — 不派機器人加入你的會議，與會者完全不知道有錄音工具存在
2. **No Storage** — 音訊與逐字稿只存在你的手機，我們伺服器完全不碰

**BYOK（Bring Your Own Key）：**
- 使用你自己的 Gemini API Key，App 直接從手機打 Gemini API
- Key 加密存在手機本地，不上傳任何地方
- 燒的是你自己的額度，我們不做中繼、不看內容

---

## 商業模式

**完全免費，AdMob 廣告支撐。**
所有功能全開放，無訂閱、無限制、無付費牆。

---

## 技術堆疊

| 層級 | 技術 |
|---|---|
| Frontend | Vanilla JS (ES6 Modules)，無框架 |
| Mobile | Capacitor v8 |
| 音訊前處理 | FFmpeg.wasm（App 端壓縮 + 切割） |
| AI | Gemini API（用戶自己的 Key，直接呼叫） |
| Key 儲存 | Capacitor SecureStorage（本機加密） |
| 本機儲存 | Capacitor Filesystem（無限量） |
| 廣告 | AdMob（capacitor-community/admob） |

**後端：無。伺服器月費：$0。**

---

## 核心功能（全開放）

- 手機錄音或上傳既有音訊（支援任何格式，自動壓縮）
- 自動切割（每 30 分鐘）或自訂切割點
- Gemini 逐字稿生成
- 翻譯：10 種語言，原文在上 / 翻譯在下
- 重點整理、潤飾逐字稿、逐字稿問答
- 歷史記錄：本機無限量儲存（純文字）
- 10 種語言 UI

---

## 常用指令

```bash
pnpm run build
npx cap sync ios
npx cap open ios
```

---

## 相關文件

- `ARCHITECTURE.md` — 架構與資料流
- `CHANGELOG.md` — 版本記錄
- `PITFALLS.md` — 已知坑
- `TODO.md` — 待辦事項
- `docs/I18N.md` — 多語言字串總表
