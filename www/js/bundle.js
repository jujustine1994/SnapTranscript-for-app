var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// js/config.js
var AppConfig;
var init_config = __esm({
  "js/config.js"() {
    AppConfig = {
      APP_NAME: "SnapTranscript",
      // ---- Debug ----
      // Set to false before App Store submission
      DEBUG_MODE: true,
      // ---- Gemini API ----
      GEMINI_MODEL: "gemini-flash-latest",
      GEMINI_API_BASE: "https://generativelanguage.googleapis.com/v1beta",
      GEMINI_UPLOAD_BASE: "https://generativelanguage.googleapis.com/upload/v1beta",
      // ---- Storage keys ----
      STORAGE_KEYS: {
        API_KEY: "gemini_api_key",
        UI_LANGUAGE: "ui_language",
        TRANSCRIPTION_LANGUAGE: "transcription_language",
        TRANSLATION_LANGUAGE: "translation_language"
      },
      // ---- Audio processing (FFmpeg.wasm) ----
      // @ffmpeg/core@0.12.9 = single-thread build (no SharedArrayBuffer — WKWebView compatible)
      // Files served locally from www/ffmpeg/ (downloaded by scripts/download-ffmpeg.js)
      FFMPEG_CORE_URL: "/ffmpeg/ffmpeg-core.js",
      FFMPEG_WASM_URL: "/ffmpeg/ffmpeg-core.wasm",
      AUDIO_BITRATE: "32k",
      SEGMENT_DURATION_SEC: 1800,
      // 30 minutes
      MAX_SEGMENT_SIZE_MB: 100,
      // Refuse if a single compressed segment exceeds this
      // ---- AdMob ----
      ADMOB_AD_UNIT_IOS: "ca-app-pub-6861772624103964/4607229612",
      ADMOB_AD_UNIT_ANDROID: "",
      // TODO: apply when Android version starts
      // ---- Languages ----
      // Transcription input languages (what language the audio is in)
      TRANSCRIPTION_LANGUAGES: [
        { code: "auto", label: "Auto Detect" },
        { code: "zh-TW", label: "\u7E41\u9AD4\u4E2D\u6587" },
        { code: "zh-CN", label: "\u7B80\u4F53\u4E2D\u6587" },
        { code: "en", label: "English" },
        { code: "ja", label: "\u65E5\u672C\u8A9E" },
        { code: "ko", label: "\uD55C\uAD6D\uC5B4" },
        { code: "fr", label: "Fran\xE7ais" },
        { code: "de", label: "Deutsch" },
        { code: "es", label: "Espa\xF1ol" },
        { code: "pt", label: "Portugu\xEAs" },
        { code: "th", label: "\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22" }
      ],
      // Translation target languages
      TRANSLATION_LANGUAGES: [
        { code: "none", label: "No Translation" },
        { code: "zh-TW", label: "\u7E41\u9AD4\u4E2D\u6587" },
        { code: "zh-CN", label: "\u7B80\u4F53\u4E2D\u6587" },
        { code: "en", label: "English" },
        { code: "ja", label: "\u65E5\u672C\u8A9E" },
        { code: "ko", label: "\uD55C\uAD6D\uC5B4" },
        { code: "fr", label: "Fran\xE7ais" },
        { code: "de", label: "Deutsch" },
        { code: "es", label: "Espa\xF1ol" },
        { code: "pt", label: "Portugu\xEAs" },
        { code: "th", label: "\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22" }
      ],
      // UI display languages (must match keys in i18n_data.js)
      UI_LANGUAGES: [
        { code: "zh-TW", label: "\u7E41\u9AD4\u4E2D\u6587" },
        { code: "zh-CN", label: "\u7B80\u4F53\u4E2D\u6587" },
        { code: "en-US", label: "English" },
        { code: "ja-JP", label: "\u65E5\u672C\u8A9E" },
        { code: "ko-KR", label: "\uD55C\uAD6D\uC5B4" },
        { code: "vi-VN", label: "Ti\u1EBFng Vi\u1EC7t" },
        { code: "es-ES", label: "Espa\xF1ol" },
        { code: "fr-FR", label: "Fran\xE7ais" },
        { code: "tl-PH", label: "Filipino" },
        { code: "id-ID", label: "Bahasa Indonesia" }
      ],
      // Default settings
      DEFAULT_TRANSCRIPTION_LANGUAGE: "auto",
      DEFAULT_TRANSLATION_LANGUAGE: "none",
      DEFAULT_UI_LANGUAGE: "zh-TW"
    };
  }
});

// js/utils/debug_logger.js
function _record(level, module, message, data) {
  const entry = {
    time: (/* @__PURE__ */ new Date()).toISOString().substring(11, 23),
    // HH:MM:SS.mmm
    level,
    // 'LOG' | 'WARN' | 'ERROR'
    module,
    message,
    data: data !== void 0 ? String(
      typeof data === "object" ? JSON.stringify(data) : data
    ) : ""
  };
  if (AppConfig.DEBUG_MODE) {
    _logs.push(entry);
    if (_logs.length > MAX_ENTRIES) _logs.shift();
    window.__debugLogs = _logs;
    window.dispatchEvent(new CustomEvent("debugLogAdded", { detail: entry }));
  }
  const prefix = `[${entry.time}][${module}]`;
  if (level === "ERROR") console.error(prefix, message, data ?? "");
  else if (level === "WARN") console.warn(prefix, message, data ?? "");
  else console.log(prefix, message, data ?? "");
}
var MAX_ENTRIES, _logs, DebugLogger;
var init_debug_logger = __esm({
  "js/utils/debug_logger.js"() {
    init_config();
    MAX_ENTRIES = 500;
    _logs = [];
    DebugLogger = {
      log: (module, msg, data) => _record("LOG", module, msg, data),
      warn: (module, msg, data) => _record("WARN", module, msg, data),
      error: (module, msg, data) => _record("ERROR", module, msg, data),
      getLogs: () => [..._logs],
      clear: () => {
        _logs.length = 0;
      }
    };
  }
});

// js/components/BaseComponent.js
var BaseComponent;
var init_BaseComponent = __esm({
  "js/components/BaseComponent.js"() {
    BaseComponent = class {
      constructor(id) {
        this.id = id;
        this.element = null;
      }
      /**
       * Renders the component's HTML and returns the element.
       * @returns {HTMLElement}
       */
      render() {
        throw new Error("Render method must be implemented");
      }
      /**
       * Mounts the component to a parent element.
       * @param {HTMLElement} parentElement 
       */
      mount(parentElement) {
        this.element = this.render();
        if (this.id) this.element.id = this.id;
        parentElement.appendChild(this.element);
        this.postMount();
      }
      /**
       * Called after mounting. Use for event binding.
       */
      postMount() {
      }
      /**
       * Utility to create element from HTML string
       * @param {string} htmlString 
       * @returns {HTMLElement}
       */
      createElementFromHTML(htmlString) {
        const div = document.createElement("div");
        div.innerHTML = htmlString.trim();
        return div.firstChild;
      }
      $(selector) {
        return this.element ? this.element.querySelector(selector) : null;
      }
    };
  }
});

// js/components/DebugPanel.js
function _escape(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var DebugPanel;
var init_DebugPanel = __esm({
  "js/components/DebugPanel.js"() {
    init_BaseComponent();
    init_debug_logger();
    init_config();
    DebugPanel = class extends BaseComponent {
      constructor() {
        super("debug-panel");
        this._isVisible = false;
      }
      /** Call once after app init. Sets up the 5-tap trigger on the header title. */
      init() {
        if (!AppConfig.DEBUG_MODE) return;
        this.mount(document.body);
        const title = document.getElementById("app-title");
        if (!title) return;
        let tapCount = 0;
        let resetTimer = null;
        title.addEventListener("click", () => {
          tapCount++;
          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            tapCount = 0;
          }, 1500);
          if (tapCount >= 5) {
            tapCount = 0;
            this._show();
          }
        });
        window.addEventListener("debugLogAdded", () => {
          if (this._isVisible) this._renderLogs();
        });
      }
      render() {
        return this.createElementFromHTML(`
      <div id="debug-panel" class="debug-panel hidden">
        <div class="debug-panel-header">
          <span class="debug-panel-title">\u{1F41B} Debug Log</span>
          <div class="debug-panel-actions">
            <button id="debug-copy-btn" class="debug-action-btn">Copy</button>
            <button id="debug-clear-btn" class="debug-action-btn">Clear</button>
            <button id="debug-close-btn" class="debug-action-btn debug-close">\u2715</button>
          </div>
        </div>
        <div class="debug-log-list" id="debug-log-list"></div>
      </div>
    `);
      }
      postMount() {
        this.$("#debug-close-btn")?.addEventListener("click", () => this._hide());
        this.$("#debug-clear-btn")?.addEventListener("click", () => {
          DebugLogger.clear();
          this._renderLogs();
        });
        this.$("#debug-copy-btn")?.addEventListener("click", () => this._copyLogs());
      }
      // ---- Private ----
      _show() {
        this._renderLogs();
        this.element.classList.remove("hidden");
        this._isVisible = true;
      }
      _hide() {
        this.element.classList.add("hidden");
        this._isVisible = false;
      }
      _renderLogs() {
        const list = this.$("#debug-log-list");
        if (!list) return;
        const logs = DebugLogger.getLogs();
        if (logs.length === 0) {
          list.innerHTML = '<p class="debug-empty">No logs yet.</p>';
          return;
        }
        list.innerHTML = [...logs].reverse().map((e) => `
      <div class="debug-entry debug-${e.level.toLowerCase()}">
        <span class="debug-time">${e.time}</span>
        <span class="debug-module">[${e.module}]</span>
        <span class="debug-msg">${_escape(e.message)}</span>
        ${e.data ? `<span class="debug-data">${_escape(e.data)}</span>` : ""}
      </div>
    `).join("");
      }
      async _copyLogs() {
        const lines = DebugLogger.getLogs().map((e) => `${e.time} [${e.level}][${e.module}] ${e.message} ${e.data}`).join("\n");
        try {
          await navigator.clipboard.writeText(lines);
          this.$("#debug-copy-btn").textContent = "Copied!";
          setTimeout(() => {
            this.$("#debug-copy-btn").textContent = "Copy";
          }, 2e3);
        } catch (err) {
          console.error("Copy failed", err);
        }
      }
    };
  }
});

// js/i18n_data.js
var TRANSLATIONS;
var init_i18n_data = __esm({
  "js/i18n_data.js"() {
    TRANSLATIONS = {
      // ============================================================
      "zh-TW": {
        "app.title": "SnapTranscript",
        "app.loading": "\u8F09\u5165\u4E2D\u2026",
        "app.error.generic": "\u767C\u751F\u932F\u8AA4\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66",
        "app.cancel": "\u53D6\u6D88",
        "app.confirm": "\u78BA\u8A8D",
        "app.close": "\u95DC\u9589",
        "app.save": "\u5132\u5B58",
        "app.copy": "\u8907\u88FD",
        "app.copied": "\u5DF2\u8907\u88FD\uFF01",
        "app.share": "\u5206\u4EAB",
        "app.delete": "\u522A\u9664",
        "app.back": "\u8FD4\u56DE",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "\u60A8\u7684 Key \u50C5\u5B58\u5728\u6B64\u88DD\u7F6E\u4E0A\u3002SnapTranscript \u5B8C\u5168\u770B\u4E0D\u5230\u5B83\u2014\u2014App \u76F4\u63A5\u5F9E\u60A8\u7684\u624B\u6A5F\u547C\u53EB Gemini\u3002",
        "apikey.set_badge": "\u2705 API Key \u5DF2\u8A2D\u5B9A",
        "apikey.remove": "\u79FB\u9664 Key",
        "apikey.not_set": "\u5C1A\u672A\u8A2D\u5B9A API Key\u3002",
        "apikey.input_label": "\u8CBC\u4E0A\u60A8\u7684 Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "\u514D\u8CBB\u53D6\u5F97 Key\uFF1A<strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": "\u683C\u5F0F\u4E0D\u7B26\u3002Gemini Key \u4EE5\u300CAIza\u300D\u958B\u982D\uFF0C\u5171 39 \u5B57\u5143\u3002",
        "apikey.save": "\u5132\u5B58 Key",
        "home.select_audio": "\u9078\u64C7\u97F3\u8A0A\u6A94\u6848",
        "home.selected_file": "\u5DF2\u9078\u64C7\uFF1A{filename}",
        "home.duration": "\u9577\u5EA6\uFF1A{duration}",
        "home.start": "\u958B\u59CB\u8F49\u9304",
        "home.history": "\u6B77\u53F2\u8A18\u9304",
        "home.settings": "\u8A2D\u5B9A",
        "home.empty_title": "\u6E96\u5099\u597D\u4E86",
        "home.empty_subtitle": "\u9EDE\u4E0B\u65B9\u6309\u9215\u958B\u59CB\u9304\u97F3\uFF0C\u6216\u4E0A\u50B3\u97F3\u8A0A\u6A94\u6848\u3002",
        "split.title": "\u5207\u5272\u8A2D\u5B9A",
        "split.auto": "\u81EA\u52D5\uFF08\u6BCF 30 \u5206\u9418\uFF09",
        "split.custom": "\u81EA\u8A02\u5207\u5272\u9EDE",
        "split.add_point": "\u65B0\u589E\u5207\u5272\u9EDE",
        "split.segments": "\u5171 {n} \u6BB5",
        "translate.enable": "\u540C\u6642\u7FFB\u8B6F",
        "translate.target_lang": "\u7FFB\u8B6F\u76EE\u6A19\u8A9E\u8A00",
        "process.compressing": "\u58D3\u7E2E\u97F3\u8A0A\u4E2D\u2026",
        "process.uploading": "\u4E0A\u50B3\u4E2D\u2026 ({n}/{total} \u6BB5)",
        "process.transcribing": "\u8F49\u9304\u4E2D\u2026 ({n}/{total} \u6BB5)",
        "process.translating": "\u7FFB\u8B6F\u4E2D\u2026",
        "process.merging": "\u5408\u4F75\u4E2D\u2026",
        "process.done": "\u5B8C\u6210\uFF01",
        "process.error.upload": "\u4E0A\u50B3\u5931\u6557\uFF0C\u8ACB\u91CD\u8A66",
        "process.error.transcribe": "\u8F49\u9304\u5931\u6557",
        "process.error.size_exceeded": "\u58D3\u7E2E\u5F8C\u55AE\u6BB5\u8D85\u904E 100 MB\uFF0C\u7121\u6CD5\u8655\u7406\u3002\u8ACB\u7E2E\u77ED\u9304\u97F3\u9577\u5EA6\u3002",
        "process.retry": "\u91CD\u8A66\u9019\u4E00\u6BB5",
        "result.title": "\u8F49\u9304\u7D50\u679C",
        "result.original": "\u539F\u6587",
        "result.translation": "\u7FFB\u8B6F",
        "result.summary": "\u91CD\u9EDE\u6574\u7406",
        "result.copy_all": "\u8907\u88FD\u5168\u6587",
        "result.copy_original": "\u8907\u88FD\u539F\u6587",
        "result.copy_translation": "\u8907\u88FD\u7FFB\u8B6F",
        "result.share": "\u5206\u4EAB",
        "result.save_done": "\u5DF2\u5132\u5B58\u81F3\u6B77\u53F2\u8A18\u9304",
        "history.title": "\u6B77\u53F2\u8A18\u9304",
        "history.empty": "\u5C1A\u7121\u8F49\u9304\u8A18\u9304",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} \u6BB5",
        "history.item_has_translation": "\u542B\u7FFB\u8B6F",
        "history.delete_confirm": "\u78BA\u5B9A\u8981\u522A\u9664\u9019\u7B46\u8A18\u9304\u55CE\uFF1F",
        "history.delete_done": "\u5DF2\u522A\u9664",
        "settings.title": "\u8A2D\u5B9A",
        "settings.ui_language": "\u4ECB\u9762\u8A9E\u8A00",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "\u96B1\u79C1\u6B0A\u653F\u7B56",
        "settings.terms": "\u670D\u52D9\u689D\u6B3E",
        "privacy.title": "\u670D\u52D9\u689D\u6B3E\u8207\u96B1\u79C1\u6B0A",
        "privacy.agree": "\u540C\u610F\u4E26\u7E7C\u7E8C",
        "privacy.disagree": "\u4E0D\u540C\u610F",
        "offline.banner": "\u76EE\u524D\u96E2\u7DDA\u3002\u9304\u97F3\u5DF2\u5132\u5B58\uFF0C\u9023\u7DDA\u5F8C\u53EF\u4E0A\u50B3\u8F49\u9304\u3002",
        "lang.zh-TW": "\u7E41\u9AD4\u4E2D\u6587",
        "lang.zh-CN": "\u7C21\u9AD4\u4E2D\u6587",
        "lang.en-US": "\u82F1\u6587",
        "lang.ja-JP": "\u65E5\u6587",
        "lang.ko-KR": "\u97D3\u6587",
        "lang.vi-VN": "\u8D8A\u5357\u6587",
        "lang.es-ES": "\u897F\u73ED\u7259\u6587",
        "lang.fr-FR": "\u6CD5\u6587",
        "lang.tl-PH": "\u83F2\u5F8B\u8CD3\u6587",
        "lang.id-ID": "\u5370\u5C3C\u6587",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "\u6216",
        "home.start_recording": "\u958B\u59CB\u9304\u97F3",
        "home.coming_soon": "\u5373\u5C07\u63A8\u51FA",
        "home.recording": "\u9304\u97F3\u4E2D\u2026",
        "home.stop_recording": "\u23F9 \u505C\u6B62\u9304\u97F3",
        "home.change": "\u66F4\u63DB",
        "result.gen_summary": "\u2728 \u751F\u6210\u91CD\u9EDE\u6574\u7406",
        "result.regen": "\u{1F504} \u91CD\u65B0\u751F\u6210",
        "result.prompt_edit_hint": "\u53EF\u7DE8\u8F2F Prompt \u5F8C\u518D\u9001\u51FA",
        "result.prompt_send": "\u9001\u51FA",
        "result.gen_translation": "\u2728 \u751F\u6210\u7FFB\u8B6F",
        "result.qa": "Q&A",
        "result.qa_placeholder": "\u91DD\u5C0D\u9019\u4EFD\u9010\u5B57\u7A3F\u63D0\u554F\u2026",
        "result.qa_send": "\u9001\u51FA",
        "result.save": "\u5132\u5B58",
        "result.saved": "\u2713 \u5DF2\u5132\u5B58",
        "settings.display_language": "\u986F\u793A\u8A9E\u8A00",
        "settings.app_language": "App \u8A9E\u8A00",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "\u7BA1\u7406",
        "settings.defaults": "\u9810\u8A2D\u503C",
        "settings.audio_language": "\u97F3\u8A0A\u8A9E\u8A00",
        "settings.translate_to": "\u7FFB\u8B6F\u70BA",
        "settings.about": "\u95DC\u65BC",
        "settings.privacy_note": "\u60A8\u7684 API Key \u50C5\u5B58\u5728\u672C\u6A5F\u3002\u6240\u6709\u8CC7\u6599\u4E0D\u7D93\u904E\u6211\u5011\u4F3A\u670D\u5668\u3002",
        "history.open": "\u958B\u555F",
        "history.loading": "\u8F09\u5165\u4E2D\u2026",
        "privacy_info.title": "\u{1F512} \u96B1\u79C1\u67B6\u69CB\u8AAA\u660E",
        "privacy_info.your_device": "\u4F60\u7684\u88DD\u7F6E",
        "privacy_info.device_sub": "API Key \xB7 \u97F3\u8A0A \xB7 \u8F49\u9304\u7D50\u679C",
        "privacy_info.direct_conn": "\u76F4\u63A5\u9023\u7DDA",
        "privacy_info.google_sub": "AI \u8F49\u9304\u670D\u52D9",
        "privacy_info.no_server": "SnapTranscript \u6C92\u6709\u5F8C\u7AEF\u4F3A\u670D\u5668\u3002\u9019\u500B App \u5728\u4F60\u7684\u88DD\u7F6E\u4E0A\u76F4\u63A5\u547C\u53EB Google API\uFF0C\u8CC7\u6599\u4E0D\u6703\u7D93\u904E\u6211\u5011\u4EFB\u4F55\u5730\u65B9\u3002",
        "privacy_info.guarantees_title": "\u6211\u5011\u7684\u4FDD\u8B49",
        "privacy_info.check_key": "API Key \u53EA\u5B58\u5728\u4F60\u7684\u88DD\u7F6E\u672C\u5730\uFF0CSnapTranscript \u6C38\u9060\u770B\u4E0D\u5230",
        "privacy_info.check_audio": "\u97F3\u8A0A\u76F4\u63A5\u5F9E\u4F60\u7684\u88DD\u7F6E\u4E0A\u50B3\u5230 Google\uFF0C\u4E0D\u7D93\u904E\u6211\u5011\u4EFB\u4F55\u4F3A\u670D\u5668",
        "privacy_info.check_result": "\u8F49\u9304\u7D50\u679C\u53EA\u5B58\u5728\u4F60\u7684\u88DD\u7F6E\uFF0C\u6211\u5011\u6C92\u6709\u8CC7\u6599\u5EAB\u5132\u5B58\u4F60\u7684\u5167\u5BB9",
        "privacy_info.check_opensource": "\u539F\u59CB\u78BC\u516C\u958B\uFF0C\u4EFB\u4F55\u4EBA\u90FD\u53EF\u4EE5\u81EA\u884C\u5BE9\u67E5\u9A57\u8B49",
        "privacy_info.verify_title": "\u5982\u4F55\u81EA\u884C\u9A57\u8B49",
        "privacy_info.verify_steps": "\u5728\u96FB\u8166\u700F\u89BD\u5668\u6309 F12 \u958B\u555F\u958B\u767C\u8005\u5DE5\u5177 \u2192 \u5207\u5230 Network \u9801\u7C64 \u2192 \u57F7\u884C\u4E00\u6B21\u8F49\u9304 \u2192 \u78BA\u8A8D\u6240\u6709 API \u8ACB\u6C42\u53EA\u767C\u5F80 generativelanguage.googleapis.com\uFF0C\u5B8C\u5168\u6C92\u6709\u4EFB\u4F55\u8ACB\u6C42\u5230 SnapTranscript \u7684\u4F3A\u670D\u5668\u3002",
        "privacy_info.ai_tip": "\u770B\u4E0D\u61C2\u4E0A\u9762\u9019\u4E9B\uFF1F\u622A\u5716\u9019\u500B\u9801\u9762\uFF0C\u8CBC\u5230 ChatGPT \u6216 Claude \u554F\uFF1A\u300C\u9019\u500B App \u5B89\u5168\u55CE\uFF1F\u6211\u7684 API Key \u6703\u5916\u6D29\u55CE\uFF1F\u300D\u8B93 AI \u5E6B\u4F60\u89E3\u91CB\u3002",
        "privacy_info.warning_title": "\u26A0\uFE0F \u91CD\u8981\u63D0\u9192",
        "privacy_info.warning_body": "\u8ACB\u52FF\u5C07\u4F60\u7684 API Key \u63D0\u4F9B\u7D66\u4EFB\u4F55\u4EBA\uFF0C\u5305\u62EC\u4EFB\u4F55\u8072\u7A31\u662F SnapTranscript \u5BA2\u670D\u7684\u4EBA\u3002\u6211\u5011\u6C38\u9060\u4E0D\u6703\u7D22\u53D6\u4F60\u7684 Key\u3002\u4ED8\u8CBB API Key \u5916\u6D29\u53EF\u80FD\u5C0E\u81F4\u4ED6\u4EBA\u76DC\u7528\u4F60\u7684 Google \u984D\u5EA6\u3002",
        "privacy_info.view_source": "\u67E5\u770B\u539F\u59CB\u78BC",
        "privacy_info.got_it": "\u4E86\u89E3\u4E86",
        "tab.home": "\u9996\u9801",
        "tab.history": "\u6B77\u53F2",
        "history.search": "\u641C\u5C0B\u2026",
        "history.rename": "\u91CD\u65B0\u547D\u540D"
      },
      // ============================================================
      "zh-CN": {
        "app.title": "SnapTranscript",
        "app.loading": "\u52A0\u8F7D\u4E2D\u2026",
        "app.error.generic": "\u53D1\u751F\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",
        "app.cancel": "\u53D6\u6D88",
        "app.confirm": "\u786E\u8BA4",
        "app.close": "\u5173\u95ED",
        "app.save": "\u4FDD\u5B58",
        "app.copy": "\u590D\u5236",
        "app.copied": "\u5DF2\u590D\u5236\uFF01",
        "app.share": "\u5206\u4EAB",
        "app.delete": "\u5220\u9664",
        "app.back": "\u8FD4\u56DE",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "\u60A8\u7684 Key \u4EC5\u5B58\u5728\u6B64\u8BBE\u5907\u4E0A\u3002SnapTranscript \u5B8C\u5168\u770B\u4E0D\u5230\u5B83\u2014\u2014App \u76F4\u63A5\u4ECE\u60A8\u7684\u624B\u673A\u8C03\u7528 Gemini\u3002",
        "apikey.set_badge": "\u2705 API Key \u5DF2\u8BBE\u7F6E",
        "apikey.remove": "\u79FB\u9664 Key",
        "apikey.not_set": "\u5C1A\u672A\u8BBE\u7F6E API Key\u3002",
        "apikey.input_label": "\u7C98\u8D34\u60A8\u7684 Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "\u514D\u8D39\u83B7\u53D6 Key\uFF1A<strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": "\u683C\u5F0F\u4E0D\u7B26\u3002Gemini Key \u4EE5\u300CAIza\u300D\u5F00\u5934\uFF0C\u5171 39 \u4E2A\u5B57\u7B26\u3002",
        "apikey.save": "\u4FDD\u5B58 Key",
        "home.select_audio": "\u9009\u62E9\u97F3\u9891\u6587\u4EF6",
        "home.selected_file": "\u5DF2\u9009\u62E9\uFF1A{filename}",
        "home.duration": "\u65F6\u957F\uFF1A{duration}",
        "home.start": "\u5F00\u59CB\u8F6C\u5F55",
        "home.history": "\u5386\u53F2\u8BB0\u5F55",
        "home.settings": "\u8BBE\u7F6E",
        "home.empty_title": "\u51C6\u5907\u597D\u4E86",
        "home.empty_subtitle": "\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u5F00\u59CB\u5F55\u97F3\uFF0C\u6216\u4E0A\u4F20\u97F3\u9891\u6587\u4EF6\u3002",
        "split.title": "\u5206\u5272\u8BBE\u7F6E",
        "split.auto": "\u81EA\u52A8\uFF08\u6BCF 30 \u5206\u949F\uFF09",
        "split.custom": "\u81EA\u5B9A\u4E49\u5206\u5272\u70B9",
        "split.add_point": "\u6DFB\u52A0\u5206\u5272\u70B9",
        "split.segments": "\u5171 {n} \u6BB5",
        "translate.enable": "\u540C\u65F6\u7FFB\u8BD1",
        "translate.target_lang": "\u7FFB\u8BD1\u76EE\u6807\u8BED\u8A00",
        "process.compressing": "\u538B\u7F29\u97F3\u9891\u4E2D\u2026",
        "process.uploading": "\u4E0A\u4F20\u4E2D\u2026 ({n}/{total} \u6BB5)",
        "process.transcribing": "\u8F6C\u5F55\u4E2D\u2026 ({n}/{total} \u6BB5)",
        "process.translating": "\u7FFB\u8BD1\u4E2D\u2026",
        "process.merging": "\u5408\u5E76\u4E2D\u2026",
        "process.done": "\u5B8C\u6210\uFF01",
        "process.error.upload": "\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
        "process.error.transcribe": "\u8F6C\u5F55\u5931\u8D25",
        "process.error.size_exceeded": "\u538B\u7F29\u540E\u5355\u6BB5\u8D85\u8FC7 100 MB\uFF0C\u65E0\u6CD5\u5904\u7406\u3002\u8BF7\u7F29\u77ED\u5F55\u97F3\u65F6\u957F\u3002",
        "process.retry": "\u91CD\u8BD5\u8FD9\u4E00\u6BB5",
        "result.title": "\u8F6C\u5F55\u7ED3\u679C",
        "result.original": "\u539F\u6587",
        "result.translation": "\u7FFB\u8BD1",
        "result.summary": "\u8981\u70B9\u6574\u7406",
        "result.copy_all": "\u590D\u5236\u5168\u6587",
        "result.copy_original": "\u590D\u5236\u539F\u6587",
        "result.copy_translation": "\u590D\u5236\u7FFB\u8BD1",
        "result.share": "\u5206\u4EAB",
        "result.save_done": "\u5DF2\u4FDD\u5B58\u81F3\u5386\u53F2\u8BB0\u5F55",
        "history.title": "\u5386\u53F2\u8BB0\u5F55",
        "history.empty": "\u6682\u65E0\u8F6C\u5F55\u8BB0\u5F55",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} \u6BB5",
        "history.item_has_translation": "\u542B\u7FFB\u8BD1",
        "history.delete_confirm": "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u8BB0\u5F55\u5417\uFF1F",
        "history.delete_done": "\u5DF2\u5220\u9664",
        "settings.title": "\u8BBE\u7F6E",
        "settings.ui_language": "\u754C\u9762\u8BED\u8A00",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "\u9690\u79C1\u653F\u7B56",
        "settings.terms": "\u670D\u52A1\u6761\u6B3E",
        "privacy.title": "\u670D\u52A1\u6761\u6B3E\u4E0E\u9690\u79C1\u6743",
        "privacy.agree": "\u540C\u610F\u5E76\u7EE7\u7EED",
        "privacy.disagree": "\u4E0D\u540C\u610F",
        "offline.banner": "\u5F53\u524D\u79BB\u7EBF\u3002\u5F55\u97F3\u5DF2\u4FDD\u5B58\uFF0C\u8FDE\u7EBF\u540E\u53EF\u4E0A\u4F20\u8F6C\u5F55\u3002",
        "lang.zh-TW": "\u7E41\u4F53\u4E2D\u6587",
        "lang.zh-CN": "\u7B80\u4F53\u4E2D\u6587",
        "lang.en-US": "\u82F1\u6587",
        "lang.ja-JP": "\u65E5\u6587",
        "lang.ko-KR": "\u97E9\u6587",
        "lang.vi-VN": "\u8D8A\u5357\u6587",
        "lang.es-ES": "\u897F\u73ED\u7259\u6587",
        "lang.fr-FR": "\u6CD5\u6587",
        "lang.tl-PH": "\u83F2\u5F8B\u5BBE\u6587",
        "lang.id-ID": "\u5370\u5C3C\u6587",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "\u6216",
        "home.start_recording": "\u5F00\u59CB\u5F55\u97F3",
        "home.coming_soon": "\u5373\u5C06\u63A8\u51FA",
        "home.recording": "\u5F55\u97F3\u4E2D\u2026",
        "home.stop_recording": "\u23F9 \u505C\u6B62\u5F55\u97F3",
        "home.change": "\u66F4\u6362",
        "result.gen_summary": "\u2728 \u751F\u6210\u8981\u70B9\u6574\u7406",
        "result.regen": "\u{1F504} \u91CD\u65B0\u751F\u6210",
        "result.prompt_edit_hint": "\u53EF\u7F16\u8F91 Prompt \u540E\u518D\u53D1\u9001",
        "result.prompt_send": "\u53D1\u9001",
        "result.gen_translation": "\u2728 \u751F\u6210\u7FFB\u8BD1",
        "result.qa": "Q&A",
        "result.qa_placeholder": "\u9488\u5BF9\u8FD9\u4EFD\u8BB0\u5F55\u63D0\u95EE\u2026",
        "result.qa_send": "\u53D1\u9001",
        "result.save": "\u4FDD\u5B58",
        "result.saved": "\u2713 \u5DF2\u4FDD\u5B58",
        "settings.display_language": "\u663E\u793A\u8BED\u8A00",
        "settings.app_language": "App \u8BED\u8A00",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "\u7BA1\u7406",
        "settings.defaults": "\u9ED8\u8BA4\u503C",
        "settings.audio_language": "\u97F3\u9891\u8BED\u8A00",
        "settings.translate_to": "\u7FFB\u8BD1\u4E3A",
        "settings.about": "\u5173\u4E8E",
        "settings.privacy_note": "\u60A8\u7684 API Key \u4EC5\u5B58\u5728\u672C\u673A\u3002\u6240\u6709\u6570\u636E\u4E0D\u7ECF\u8FC7\u6211\u4EEC\u7684\u670D\u52A1\u5668\u3002",
        "history.open": "\u6253\u5F00",
        "history.loading": "\u52A0\u8F7D\u4E2D\u2026",
        "privacy_info.title": "\u{1F512} \u9690\u79C1\u67B6\u6784\u8BF4\u660E",
        "privacy_info.your_device": "\u4F60\u7684\u8BBE\u5907",
        "privacy_info.device_sub": "API Key \xB7 \u97F3\u9891 \xB7 \u8F6C\u5F55\u7ED3\u679C",
        "privacy_info.direct_conn": "\u76F4\u63A5\u8FDE\u63A5",
        "privacy_info.google_sub": "AI \u8F6C\u5F55\u670D\u52A1",
        "privacy_info.no_server": "SnapTranscript \u6CA1\u6709\u540E\u7AEF\u670D\u52A1\u5668\u3002\u8FD9\u4E2A App \u5728\u4F60\u7684\u8BBE\u5907\u4E0A\u76F4\u63A5\u8C03\u7528 Google API\uFF0C\u6570\u636E\u4E0D\u4F1A\u7ECF\u8FC7\u6211\u4EEC\u4EFB\u4F55\u5730\u65B9\u3002",
        "privacy_info.guarantees_title": "\u6211\u4EEC\u7684\u4FDD\u8BC1",
        "privacy_info.check_key": "API Key \u53EA\u5B58\u5728\u4F60\u7684\u8BBE\u5907\u672C\u5730\uFF0CSnapTranscript \u6C38\u8FDC\u770B\u4E0D\u5230",
        "privacy_info.check_audio": "\u97F3\u9891\u76F4\u63A5\u4ECE\u4F60\u7684\u8BBE\u5907\u4E0A\u4F20\u5230 Google\uFF0C\u4E0D\u7ECF\u8FC7\u6211\u4EEC\u4EFB\u4F55\u670D\u52A1\u5668",
        "privacy_info.check_result": "\u8F6C\u5F55\u7ED3\u679C\u53EA\u5B58\u5728\u4F60\u7684\u8BBE\u5907\uFF0C\u6211\u4EEC\u6CA1\u6709\u6570\u636E\u5E93\u5B58\u50A8\u4F60\u7684\u5185\u5BB9",
        "privacy_info.check_opensource": "\u6E90\u4EE3\u7801\u516C\u5F00\uFF0C\u4EFB\u4F55\u4EBA\u90FD\u53EF\u4EE5\u81EA\u884C\u5BA1\u67E5\u9A8C\u8BC1",
        "privacy_info.verify_title": "\u5982\u4F55\u81EA\u884C\u9A8C\u8BC1",
        "privacy_info.verify_steps": "\u5728\u7535\u8111\u6D4F\u89C8\u5668\u6309 F12 \u6253\u5F00\u5F00\u53D1\u8005\u5DE5\u5177 \u2192 \u5207\u5230 Network \u6807\u7B7E \u2192 \u6267\u884C\u4E00\u6B21\u8F6C\u5F55 \u2192 \u786E\u8BA4\u6240\u6709 API \u8BF7\u6C42\u53EA\u53D1\u5F80 generativelanguage.googleapis.com\uFF0C\u5B8C\u5168\u6CA1\u6709\u4EFB\u4F55\u8BF7\u6C42\u5230 SnapTranscript \u7684\u670D\u52A1\u5668\u3002",
        "privacy_info.ai_tip": "\u770B\u4E0D\u61C2\u4E0A\u9762\u8FD9\u4E9B\uFF1F\u622A\u56FE\u8FD9\u4E2A\u9875\u9762\uFF0C\u8D34\u5230 ChatGPT \u6216 Claude \u95EE\uFF1A\u300C\u8FD9\u4E2A App \u5B89\u5168\u5417\uFF1F\u6211\u7684 API Key \u4F1A\u5916\u6CC4\u5417\uFF1F\u300D\u8BA9 AI \u5E2E\u4F60\u89E3\u91CA\u3002",
        "privacy_info.warning_title": "\u26A0\uFE0F \u91CD\u8981\u63D0\u9192",
        "privacy_info.warning_body": "\u8BF7\u52FF\u5C06\u4F60\u7684 API Key \u63D0\u4F9B\u7ED9\u4EFB\u4F55\u4EBA\uFF0C\u5305\u62EC\u4EFB\u4F55\u58F0\u79F0\u662F SnapTranscript \u5BA2\u670D\u7684\u4EBA\u3002\u6211\u4EEC\u6C38\u8FDC\u4E0D\u4F1A\u7D22\u53D6\u4F60\u7684 Key\u3002\u4ED8\u8D39 API Key \u5916\u6CC4\u53EF\u80FD\u5BFC\u81F4\u4ED6\u4EBA\u76D7\u7528\u4F60\u7684 Google \u989D\u5EA6\u3002",
        "privacy_info.view_source": "\u67E5\u770B\u6E90\u4EE3\u7801",
        "privacy_info.got_it": "\u4E86\u89E3\u4E86",
        "tab.home": "\u9996\u9875",
        "tab.history": "\u5386\u53F2",
        "history.search": "\u641C\u7D22\u2026",
        "history.rename": "\u91CD\u547D\u540D"
      },
      // ============================================================
      "en-US": {
        "app.title": "SnapTranscript",
        "app.loading": "Loading\u2026",
        "app.error.generic": "Something went wrong, please try again",
        "app.cancel": "Cancel",
        "app.confirm": "Confirm",
        "app.close": "Close",
        "app.save": "Save",
        "app.copy": "Copy",
        "app.copied": "Copied!",
        "app.share": "Share",
        "app.delete": "Delete",
        "app.back": "Back",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Your key is stored only on this device. SnapTranscript never sees it \u2014 the app calls Gemini directly from your phone.",
        "apikey.set_badge": "\u2705 API Key is set",
        "apikey.remove": "Remove Key",
        "apikey.not_set": "No API key set yet.",
        "apikey.input_label": "Paste your Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "Get your free key at <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": 'Invalid format. Gemini keys start with "AIza" (39 characters).',
        "apikey.save": "Save Key",
        "home.select_audio": "Select Audio File",
        "home.selected_file": "Selected: {filename}",
        "home.duration": "Duration: {duration}",
        "home.start": "Start Transcription",
        "home.history": "History",
        "home.settings": "Settings",
        "home.empty_title": "Ready to transcribe",
        "home.empty_subtitle": "Tap below to start recording or upload an audio file.",
        "split.title": "Split Settings",
        "split.auto": "Auto (every 30 min)",
        "split.custom": "Custom Split Points",
        "split.add_point": "Add Split Point",
        "split.segments": "{n} segments total",
        "translate.enable": "Also Translate",
        "translate.target_lang": "Target Language",
        "process.compressing": "Compressing audio\u2026",
        "process.uploading": "Uploading\u2026 ({n}/{total} segments)",
        "process.transcribing": "Transcribing\u2026 ({n}/{total} segments)",
        "process.translating": "Translating\u2026",
        "process.merging": "Merging\u2026",
        "process.done": "Done!",
        "process.error.upload": "Upload failed, please retry",
        "process.error.transcribe": "Transcription failed",
        "process.error.size_exceeded": "A compressed segment exceeds 100 MB. Please shorten the recording.",
        "process.retry": "Retry this segment",
        "result.title": "Transcription Result",
        "result.original": "Original",
        "result.translation": "Translation",
        "result.summary": "Summary",
        "result.copy_all": "Copy All",
        "result.copy_original": "Copy Original",
        "result.copy_translation": "Copy Translation",
        "result.share": "Share",
        "result.save_done": "Saved to history",
        "history.title": "History",
        "history.empty": "No transcripts yet",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} segments",
        "history.item_has_translation": "With translation",
        "history.delete_confirm": "Delete this record?",
        "history.delete_done": "Deleted",
        "settings.title": "Settings",
        "settings.ui_language": "Interface Language",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Privacy Policy",
        "settings.terms": "Terms of Service",
        "privacy.title": "Terms & Privacy",
        "privacy.agree": "Agree & Continue",
        "privacy.disagree": "Disagree",
        "offline.banner": "You're offline. Recording saved \u2014 connect to transcribe.",
        "lang.zh-TW": "Traditional Chinese",
        "lang.zh-CN": "Simplified Chinese",
        "lang.en-US": "English",
        "lang.ja-JP": "Japanese",
        "lang.ko-KR": "Korean",
        "lang.vi-VN": "Vietnamese",
        "lang.es-ES": "Spanish",
        "lang.fr-FR": "French",
        "lang.tl-PH": "Filipino",
        "lang.id-ID": "Indonesian",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "or",
        "home.start_recording": "Start Recording",
        "home.coming_soon": "Coming Soon",
        "home.recording": "Recording\u2026",
        "home.stop_recording": "\u23F9 Stop Recording",
        "home.change": "Change",
        "result.gen_summary": "\u2728 Generate Summary",
        "result.regen": "\u{1F504} Regenerate",
        "result.prompt_edit_hint": "Edit the prompt before sending",
        "result.prompt_send": "Send",
        "result.gen_translation": "\u2728 Generate Translation",
        "result.qa": "Q&A",
        "result.qa_placeholder": "Ask a question about this transcript\u2026",
        "result.qa_send": "Send",
        "result.save": "Save",
        "result.saved": "\u2713 Saved",
        "settings.display_language": "Display Language",
        "settings.app_language": "App Language",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "Manage",
        "settings.defaults": "Defaults",
        "settings.audio_language": "Audio Language",
        "settings.translate_to": "Translate to",
        "settings.about": "About",
        "settings.privacy_note": "Your API Key is stored locally only. No data passes through our servers.",
        "history.open": "Open",
        "history.loading": "Loading\u2026",
        "privacy_info.title": "\u{1F512} Privacy Architecture",
        "privacy_info.your_device": "Your Device",
        "privacy_info.device_sub": "API Key \xB7 Audio \xB7 Transcripts",
        "privacy_info.direct_conn": "Direct connection",
        "privacy_info.google_sub": "AI Transcription",
        "privacy_info.no_server": "SnapTranscript has no backend server. This app calls Google's API directly from your device \u2014 your data never passes through us.",
        "privacy_info.guarantees_title": "Our Guarantees",
        "privacy_info.check_key": "Your API Key is stored only on your device \u2014 SnapTranscript never sees it",
        "privacy_info.check_audio": "Audio is uploaded directly from your device to Google, never through our servers",
        "privacy_info.check_result": "Transcripts are stored only on your device \u2014 we have no database of your content",
        "privacy_info.check_opensource": "Source code is public \u2014 anyone can audit it",
        "privacy_info.verify_title": "Verify It Yourself",
        "privacy_info.verify_steps": "Open browser DevTools (F12) \u2192 Network tab \u2192 run a transcription \u2192 confirm all API requests go only to generativelanguage.googleapis.com with zero requests to SnapTranscript's servers.",
        "privacy_info.ai_tip": `Don't understand the above? Screenshot this page and ask ChatGPT or Claude: "Is this app safe? Can my API Key be stolen?" Let AI explain it to you.`,
        "privacy_info.warning_title": "\u26A0\uFE0F Important Warning",
        "privacy_info.warning_body": "Never share your API Key with anyone, including anyone claiming to be SnapTranscript support. We will never ask for your Key. A leaked paid API Key could result in others consuming your Google quota.",
        "privacy_info.view_source": "View Source Code",
        "privacy_info.got_it": "Got it",
        "tab.home": "Home",
        "tab.history": "History",
        "history.search": "Search\u2026",
        "history.rename": "Rename"
      },
      // ============================================================
      "ja-JP": {
        "app.title": "SnapTranscript",
        "app.loading": "\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",
        "app.error.generic": "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044",
        "app.cancel": "\u30AD\u30E3\u30F3\u30BB\u30EB",
        "app.confirm": "\u78BA\u8A8D",
        "app.close": "\u9589\u3058\u308B",
        "app.save": "\u4FDD\u5B58",
        "app.copy": "\u30B3\u30D4\u30FC",
        "app.copied": "\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\uFF01",
        "app.share": "\u5171\u6709",
        "app.delete": "\u524A\u9664",
        "app.back": "\u623B\u308B",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Key\u306F\u3053\u306E\u30C7\u30D0\u30A4\u30B9\u306B\u306E\u307F\u3042\u308A\u307E\u3059\u3002SnapTranscript\u306FKey\u3092\u898B\u308B\u3053\u3068\u306A\u304F\u3001\u30A2\u30D7\u30EA\u304C\u76F4\u63A5Gemini\u3092\u547C\u3073\u51FA\u3057\u307E\u3059\u3002",
        "apikey.set_badge": "\u2705 API Key \u304C\u8A2D\u5B9A\u6E08\u307F",
        "apikey.remove": "Key \u3092\u524A\u9664",
        "apikey.not_set": "API Key \u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",
        "apikey.input_label": "Gemini API Key \u3092\u8CBC\u308A\u4ED8\u3051",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "\u7121\u6599\u3067 Key \u3092\u53D6\u5F97\uFF1A<strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": "\u5F62\u5F0F\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002Gemini Key \u306F\u300CAIza\u300D\u3067\u59CB\u307E\u308B 39 \u6587\u5B57\u3067\u3059\u3002",
        "apikey.save": "Key \u3092\u4FDD\u5B58",
        "home.select_audio": "\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E",
        "home.selected_file": "\u9078\u629E\u6E08\u307F\uFF1A{filename}",
        "home.duration": "\u9577\u3055\uFF1A{duration}",
        "home.start": "\u6587\u5B57\u8D77\u3053\u3057\u958B\u59CB",
        "home.history": "\u5C65\u6B74",
        "home.settings": "\u8A2D\u5B9A",
        "home.empty_title": "\u6E96\u5099\u5B8C\u4E86",
        "home.empty_subtitle": "\u4E0B\u306E\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u3066\u9332\u97F3\u3059\u308B\u304B\u3001\u97F3\u58F0\u30D5\u30A1\u30A4\u30EB\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        "split.title": "\u5206\u5272\u8A2D\u5B9A",
        "split.auto": "\u81EA\u52D5\uFF0830 \u5206\u3054\u3068\uFF09",
        "split.custom": "\u30AB\u30B9\u30BF\u30E0\u5206\u5272\u70B9",
        "split.add_point": "\u5206\u5272\u70B9\u3092\u8FFD\u52A0",
        "split.segments": "\u5408\u8A08 {n} \u30BB\u30B0\u30E1\u30F3\u30C8",
        "translate.enable": "\u7FFB\u8A33\u3082\u884C\u3046",
        "translate.target_lang": "\u7FFB\u8A33\u5148\u8A00\u8A9E",
        "process.compressing": "\u97F3\u58F0\u3092\u5727\u7E2E\u4E2D\u2026",
        "process.uploading": "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E2D\u2026 ({n}/{total} \u30BB\u30B0\u30E1\u30F3\u30C8)",
        "process.transcribing": "\u6587\u5B57\u8D77\u3053\u3057\u4E2D\u2026 ({n}/{total} \u30BB\u30B0\u30E1\u30F3\u30C8)",
        "process.translating": "\u7FFB\u8A33\u4E2D\u2026",
        "process.merging": "\u7D50\u5408\u4E2D\u2026",
        "process.done": "\u5B8C\u4E86\uFF01",
        "process.error.upload": "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5931\u6557\u3002\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044",
        "process.error.transcribe": "\u6587\u5B57\u8D77\u3053\u3057\u5931\u6557",
        "process.error.size_exceeded": "\u5727\u7E2E\u5F8C\u306E\u30BB\u30B0\u30E1\u30F3\u30C8\u304C 100 MB \u3092\u8D85\u3048\u3066\u3044\u307E\u3059\u3002\u9332\u97F3\u3092\u77ED\u304F\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        "process.retry": "\u3053\u306E\u30BB\u30B0\u30E1\u30F3\u30C8\u3092\u518D\u8A66\u884C",
        "result.title": "\u6587\u5B57\u8D77\u3053\u3057\u7D50\u679C",
        "result.original": "\u539F\u6587",
        "result.translation": "\u7FFB\u8A33",
        "result.summary": "\u8981\u7D04",
        "result.copy_all": "\u5168\u6587\u30B3\u30D4\u30FC",
        "result.copy_original": "\u539F\u6587\u30B3\u30D4\u30FC",
        "result.copy_translation": "\u7FFB\u8A33\u30B3\u30D4\u30FC",
        "result.share": "\u5171\u6709",
        "result.save_done": "\u5C65\u6B74\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F",
        "history.title": "\u5C65\u6B74",
        "history.empty": "\u6587\u5B57\u8D77\u3053\u3057\u8A18\u9332\u304C\u3042\u308A\u307E\u305B\u3093",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} \u30BB\u30B0\u30E1\u30F3\u30C8",
        "history.item_has_translation": "\u7FFB\u8A33\u3042\u308A",
        "history.delete_confirm": "\u3053\u306E\u8A18\u9332\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F",
        "history.delete_done": "\u524A\u9664\u3057\u307E\u3057\u305F",
        "settings.title": "\u8A2D\u5B9A",
        "settings.ui_language": "\u8868\u793A\u8A00\u8A9E",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC",
        "settings.terms": "\u5229\u7528\u898F\u7D04",
        "privacy.title": "\u5229\u7528\u898F\u7D04\u3068\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC",
        "privacy.agree": "\u540C\u610F\u3057\u3066\u7D9A\u3051\u308B",
        "privacy.disagree": "\u540C\u610F\u3057\u306A\u3044",
        "offline.banner": "\u30AA\u30D5\u30E9\u30A4\u30F3\u3067\u3059\u3002\u9332\u97F3\u306F\u4FDD\u5B58\u6E08\u307F \u2014 \u63A5\u7D9A\u5F8C\u306B\u6587\u5B57\u8D77\u3053\u3057\u53EF\u80FD\u3067\u3059\u3002",
        "lang.zh-TW": "\u7E41\u4F53\u5B57\u4E2D\u56FD\u8A9E",
        "lang.zh-CN": "\u7C21\u4F53\u5B57\u4E2D\u56FD\u8A9E",
        "lang.en-US": "\u82F1\u8A9E",
        "lang.ja-JP": "\u65E5\u672C\u8A9E",
        "lang.ko-KR": "\u97D3\u56FD\u8A9E",
        "lang.vi-VN": "\u30D9\u30C8\u30CA\u30E0\u8A9E",
        "lang.es-ES": "\u30B9\u30DA\u30A4\u30F3\u8A9E",
        "lang.fr-FR": "\u30D5\u30E9\u30F3\u30B9\u8A9E",
        "lang.tl-PH": "\u30D5\u30A3\u30EA\u30D4\u30F3\u8A9E",
        "lang.id-ID": "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2\u8A9E",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "\u307E\u305F\u306F",
        "home.start_recording": "\u9332\u97F3\u3092\u958B\u59CB",
        "home.coming_soon": "\u8FD1\u65E5\u516C\u958B",
        "home.recording": "\u9332\u97F3\u4E2D\u2026",
        "home.stop_recording": "\u23F9 \u9332\u97F3\u3092\u505C\u6B62",
        "home.change": "\u5909\u66F4",
        "result.gen_summary": "\u2728 \u8981\u7D04\u3092\u751F\u6210",
        "result.regen": "\u{1F504} \u518D\u751F\u6210",
        "result.prompt_edit_hint": "\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u7DE8\u96C6\u3057\u3066\u9001\u4FE1",
        "result.prompt_send": "\u9001\u4FE1",
        "result.gen_translation": "\u2728 \u7FFB\u8A33\u3092\u751F\u6210",
        "result.qa": "Q&A",
        "result.qa_placeholder": "\u3053\u306E\u6587\u5B57\u8D77\u3053\u3057\u306B\u3064\u3044\u3066\u8CEA\u554F\u3059\u308B\u2026",
        "result.qa_send": "\u9001\u4FE1",
        "result.save": "\u4FDD\u5B58",
        "result.saved": "\u2713 \u4FDD\u5B58\u6E08\u307F",
        "settings.display_language": "\u8868\u793A\u8A00\u8A9E",
        "settings.app_language": "\u30A2\u30D7\u30EA\u8A00\u8A9E",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "\u7BA1\u7406",
        "settings.defaults": "\u30C7\u30D5\u30A9\u30EB\u30C8",
        "settings.audio_language": "\u97F3\u58F0\u8A00\u8A9E",
        "settings.translate_to": "\u7FFB\u8A33\u5148",
        "settings.about": "\u30A2\u30D7\u30EA\u306B\u3064\u3044\u3066",
        "settings.privacy_note": "API Key \u306F\u3053\u306E\u30C7\u30D0\u30A4\u30B9\u306B\u306E\u307F\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002\u3059\u3079\u3066\u306E\u30C7\u30FC\u30BF\u306F\u5F53\u793E\u30B5\u30FC\u30D0\u30FC\u3092\u7D4C\u7531\u3057\u307E\u305B\u3093\u3002",
        "history.open": "\u958B\u304F",
        "history.loading": "\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",
        "tab.home": "\u30DB\u30FC\u30E0",
        "tab.history": "\u5C65\u6B74",
        "history.search": "\u691C\u7D22\u2026",
        "history.rename": "\u540D\u524D\u5909\u66F4"
      },
      // ============================================================
      "ko-KR": {
        "app.title": "SnapTranscript",
        "app.loading": "\uB85C\uB529 \uC911\u2026",
        "app.error.generic": "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694",
        "app.cancel": "\uCDE8\uC18C",
        "app.confirm": "\uD655\uC778",
        "app.close": "\uB2EB\uAE30",
        "app.save": "\uC800\uC7A5",
        "app.copy": "\uBCF5\uC0AC",
        "app.copied": "\uBCF5\uC0AC\uB428!",
        "app.share": "\uACF5\uC720",
        "app.delete": "\uC0AD\uC81C",
        "app.back": "\uB4A4\uB85C",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Key\uB294 \uC774 \uAE30\uAE30\uC5D0\uB9CC \uC800\uC7A5\uB429\uB2C8\uB2E4. SnapTranscript\uB294 Key\uB97C \uBCFC \uC218 \uC5C6\uC73C\uBA70, \uC571\uC774 \uC9C1\uC811 Gemini\uB97C \uD638\uCD9C\uD569\uB2C8\uB2E4.",
        "apikey.set_badge": "\u2705 API Key \uC124\uC815\uB428",
        "apikey.remove": "Key \uC81C\uAC70",
        "apikey.not_set": "API Key\uAC00 \uC124\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.",
        "apikey.input_label": "Gemini API Key \uBD99\uC5EC\uB123\uAE30",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "\uBB34\uB8CC Key \uBC1B\uAE30\uFF1A<strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": '\uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. Gemini Key\uB294 "AIza"\uB85C \uC2DC\uC791\uD558\uB294 39\uC790\uC785\uB2C8\uB2E4.',
        "apikey.save": "Key \uC800\uC7A5",
        "home.select_audio": "\uC624\uB514\uC624 \uD30C\uC77C \uC120\uD0DD",
        "home.selected_file": "\uC120\uD0DD\uB428: {filename}",
        "home.duration": "\uAE38\uC774: {duration}",
        "home.start": "\uC804\uC0AC \uC2DC\uC791",
        "home.history": "\uAE30\uB85D",
        "home.settings": "\uC124\uC815",
        "home.empty_title": "\uC900\uBE44\uB428",
        "home.empty_subtitle": "\uC544\uB798 \uBC84\uD2BC\uC744 \uD0ED\uD558\uC5EC \uB179\uC74C\uD558\uAC70\uB098 \uC624\uB514\uC624 \uD30C\uC77C\uC744 \uC5C5\uB85C\uB4DC\uD558\uC138\uC694.",
        "split.title": "\uBD84\uD560 \uC124\uC815",
        "split.auto": "\uC790\uB3D9 (30\uBD84\uB9C8\uB2E4)",
        "split.custom": "\uC0AC\uC6A9\uC790 \uC815\uC758 \uBD84\uD560\uC810",
        "split.add_point": "\uBD84\uD560\uC810 \uCD94\uAC00",
        "split.segments": "\uCD1D {n}\uAC1C \uAD6C\uAC04",
        "translate.enable": "\uBC88\uC5ED\uB3C4 \uD568\uAED8",
        "translate.target_lang": "\uBC88\uC5ED \uB300\uC0C1 \uC5B8\uC5B4",
        "process.compressing": "\uC624\uB514\uC624 \uC555\uCD95 \uC911\u2026",
        "process.uploading": "\uC5C5\uB85C\uB4DC \uC911\u2026 ({n}/{total} \uAD6C\uAC04)",
        "process.transcribing": "\uC804\uC0AC \uC911\u2026 ({n}/{total} \uAD6C\uAC04)",
        "process.translating": "\uBC88\uC5ED \uC911\u2026",
        "process.merging": "\uBCD1\uD569 \uC911\u2026",
        "process.done": "\uC644\uB8CC!",
        "process.error.upload": "\uC5C5\uB85C\uB4DC \uC2E4\uD328. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694",
        "process.error.transcribe": "\uC804\uC0AC \uC2E4\uD328",
        "process.error.size_exceeded": "\uC555\uCD95\uB41C \uAD6C\uAC04\uC774 100 MB\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4. \uB179\uC74C\uC744 \uC9E7\uAC8C \uD574 \uC8FC\uC138\uC694.",
        "process.retry": "\uC774 \uAD6C\uAC04 \uC7AC\uC2DC\uB3C4",
        "result.title": "\uC804\uC0AC \uACB0\uACFC",
        "result.original": "\uC6D0\uBB38",
        "result.translation": "\uBC88\uC5ED",
        "result.summary": "\uC694\uC57D",
        "result.copy_all": "\uC804\uCCB4 \uBCF5\uC0AC",
        "result.copy_original": "\uC6D0\uBB38 \uBCF5\uC0AC",
        "result.copy_translation": "\uBC88\uC5ED \uBCF5\uC0AC",
        "result.share": "\uACF5\uC720",
        "result.save_done": "\uAE30\uB85D\uC5D0 \uC800\uC7A5\uB428",
        "history.title": "\uAE30\uB85D",
        "history.empty": "\uC804\uC0AC \uAE30\uB85D \uC5C6\uC74C",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n}\uAC1C \uAD6C\uAC04",
        "history.item_has_translation": "\uBC88\uC5ED \uD3EC\uD568",
        "history.delete_confirm": "\uC774 \uAE30\uB85D\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?",
        "history.delete_done": "\uC0AD\uC81C\uB428",
        "settings.title": "\uC124\uC815",
        "settings.ui_language": "\uC778\uD130\uD398\uC774\uC2A4 \uC5B8\uC5B4",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68",
        "settings.terms": "\uC11C\uBE44\uC2A4 \uC57D\uAD00",
        "privacy.title": "\uC57D\uAD00 \uBC0F \uAC1C\uC778\uC815\uBCF4",
        "privacy.agree": "\uB3D9\uC758\uD558\uACE0 \uACC4\uC18D",
        "privacy.disagree": "\uB3D9\uC758 \uC548 \uD568",
        "offline.banner": "\uC624\uD504\uB77C\uC778 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uB179\uC74C\uC774 \uC800\uC7A5\uB428 \u2014 \uC5F0\uACB0 \uD6C4 \uC804\uC0AC \uAC00\uB2A5\uD569\uB2C8\uB2E4.",
        "lang.zh-TW": "\uBC88\uCCB4 \uC911\uAD6D\uC5B4",
        "lang.zh-CN": "\uAC04\uCCB4 \uC911\uAD6D\uC5B4",
        "lang.en-US": "\uC601\uC5B4",
        "lang.ja-JP": "\uC77C\uBCF8\uC5B4",
        "lang.ko-KR": "\uD55C\uAD6D\uC5B4",
        "lang.vi-VN": "\uBCA0\uD2B8\uB0A8\uC5B4",
        "lang.es-ES": "\uC2A4\uD398\uC778\uC5B4",
        "lang.fr-FR": "\uD504\uB791\uC2A4\uC5B4",
        "lang.tl-PH": "\uD544\uB9AC\uD540\uC5B4",
        "lang.id-ID": "\uC778\uB3C4\uB124\uC2DC\uC544\uC5B4",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "\uB610\uB294",
        "home.start_recording": "\uB179\uC74C \uC2DC\uC791",
        "home.coming_soon": "\uACE7 \uCD9C\uC2DC",
        "home.recording": "\uB179\uC74C \uC911\u2026",
        "home.stop_recording": "\u23F9 \uB179\uC74C \uC911\uC9C0",
        "home.change": "\uBCC0\uACBD",
        "result.gen_summary": "\u2728 \uC694\uC57D \uC0DD\uC131",
        "result.regen": "\u{1F504} \uB2E4\uC2DC \uC0DD\uC131",
        "result.prompt_edit_hint": "\uD504\uB86C\uD504\uD2B8\uB97C \uD3B8\uC9D1\uD558\uACE0 \uC804\uC1A1",
        "result.prompt_send": "\uC804\uC1A1",
        "result.gen_translation": "\u2728 \uBC88\uC5ED \uC0DD\uC131",
        "result.qa": "Q&A",
        "result.qa_placeholder": "\uC774 \uC804\uC0AC\uBCF8\uC5D0 \uB300\uD574 \uC9C8\uBB38\uD558\uAE30\u2026",
        "result.qa_send": "\uC804\uC1A1",
        "result.save": "\uC800\uC7A5",
        "result.saved": "\u2713 \uC800\uC7A5\uB428",
        "settings.display_language": "\uD45C\uC2DC \uC5B8\uC5B4",
        "settings.app_language": "\uC571 \uC5B8\uC5B4",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "\uAD00\uB9AC",
        "settings.defaults": "\uAE30\uBCF8\uAC12",
        "settings.audio_language": "\uC624\uB514\uC624 \uC5B8\uC5B4",
        "settings.translate_to": "\uBC88\uC5ED \uB300\uC0C1",
        "settings.about": "\uC571 \uC815\uBCF4",
        "settings.privacy_note": "API Key\uB294 \uC774 \uAE30\uAE30\uC5D0\uB9CC \uC800\uC7A5\uB429\uB2C8\uB2E4. \uBAA8\uB4E0 \uB370\uC774\uD130\uB294 \uB2F9\uC0AC \uC11C\uBC84\uB97C \uD1B5\uD574 \uCC98\uB9AC\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
        "history.open": "\uC5F4\uAE30",
        "history.loading": "\uB85C\uB529 \uC911\u2026",
        "tab.home": "\uD648",
        "tab.history": "\uAE30\uB85D",
        "history.search": "\uAC80\uC0C9\u2026",
        "history.rename": "\uC774\uB984 \uBCC0\uACBD"
      },
      // ============================================================
      "vi-VN": {
        "app.title": "SnapTranscript",
        "app.loading": "\u0110ang t\u1EA3i\u2026",
        "app.error.generic": "\u0110\xE3 x\u1EA3y ra l\u1ED7i, vui l\xF2ng th\u1EED l\u1EA1i",
        "app.cancel": "H\u1EE7y",
        "app.confirm": "X\xE1c nh\u1EADn",
        "app.close": "\u0110\xF3ng",
        "app.save": "L\u01B0u",
        "app.copy": "Sao ch\xE9p",
        "app.copied": "\u0110\xE3 sao ch\xE9p!",
        "app.share": "Chia s\u1EBB",
        "app.delete": "X\xF3a",
        "app.back": "Quay l\u1EA1i",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Key c\u1EE7a b\u1EA1n ch\u1EC9 \u0111\u01B0\u1EE3c l\u01B0u tr\xEAn thi\u1EBFt b\u1ECB n\xE0y. SnapTranscript kh\xF4ng bao gi\u1EDD th\u1EA5y Key \u2014 \u1EE9ng d\u1EE5ng g\u1ECDi tr\u1EF1c ti\u1EBFp Gemini t\u1EEB \u0111i\u1EC7n tho\u1EA1i c\u1EE7a b\u1EA1n.",
        "apikey.set_badge": "\u2705 API Key \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1EB7t",
        "apikey.remove": "X\xF3a Key",
        "apikey.not_set": "Ch\u01B0a \u0111\u1EB7t API Key.",
        "apikey.input_label": "D\xE1n Gemini API Key c\u1EE7a b\u1EA1n",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "L\u1EA5y Key mi\u1EC5n ph\xED t\u1EA1i <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": '\u0110\u1ECBnh d\u1EA1ng kh\xF4ng h\u1EE3p l\u1EC7. Gemini Key b\u1EAFt \u0111\u1EA7u b\u1EB1ng "AIza" (39 k\xFD t\u1EF1).',
        "apikey.save": "L\u01B0u Key",
        "home.select_audio": "Ch\u1ECDn t\u1EC7p \xE2m thanh",
        "home.selected_file": "\u0110\xE3 ch\u1ECDn: {filename}",
        "home.duration": "Th\u1EDDi l\u01B0\u1EE3ng: {duration}",
        "home.start": "B\u1EAFt \u0111\u1EA7u phi\xEAn \xE2m",
        "home.history": "L\u1ECBch s\u1EED",
        "home.settings": "C\xE0i \u0111\u1EB7t",
        "home.empty_title": "S\u1EB5n s\xE0ng",
        "home.empty_subtitle": "Nh\u1EA5n b\xEAn d\u01B0\u1EDBi \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u ghi \xE2m ho\u1EB7c t\u1EA3i l\xEAn t\u1EC7p \xE2m thanh.",
        "split.title": "C\xE0i \u0111\u1EB7t chia \u0111o\u1EA1n",
        "split.auto": "T\u1EF1 \u0111\u1ED9ng (m\u1ED7i 30 ph\xFAt)",
        "split.custom": "\u0110i\u1EC3m chia t\xF9y ch\u1EC9nh",
        "split.add_point": "Th\xEAm \u0111i\u1EC3m chia",
        "split.segments": "T\u1ED5ng {n} \u0111o\u1EA1n",
        "translate.enable": "D\u1ECBch \u0111\u1ED3ng th\u1EDDi",
        "translate.target_lang": "Ng\xF4n ng\u1EEF d\u1ECBch",
        "process.compressing": "\u0110ang n\xE9n \xE2m thanh\u2026",
        "process.uploading": "\u0110ang t\u1EA3i l\xEAn\u2026 ({n}/{total} \u0111o\u1EA1n)",
        "process.transcribing": "\u0110ang phi\xEAn \xE2m\u2026 ({n}/{total} \u0111o\u1EA1n)",
        "process.translating": "\u0110ang d\u1ECBch\u2026",
        "process.merging": "\u0110ang h\u1EE3p nh\u1EA5t\u2026",
        "process.done": "Ho\xE0n t\u1EA5t!",
        "process.error.upload": "T\u1EA3i l\xEAn th\u1EA5t b\u1EA1i, vui l\xF2ng th\u1EED l\u1EA1i",
        "process.error.transcribe": "Phi\xEAn \xE2m th\u1EA5t b\u1EA1i",
        "process.error.size_exceeded": "\u0110o\u1EA1n sau khi n\xE9n v\u01B0\u1EE3t qu\xE1 100 MB. Vui l\xF2ng r\xFAt ng\u1EAFn b\u1EA3n ghi \xE2m.",
        "process.retry": "Th\u1EED l\u1EA1i \u0111o\u1EA1n n\xE0y",
        "result.title": "K\u1EBFt qu\u1EA3 phi\xEAn \xE2m",
        "result.original": "B\u1EA3n g\u1ED1c",
        "result.translation": "B\u1EA3n d\u1ECBch",
        "result.summary": "T\xF3m t\u1EAFt",
        "result.copy_all": "Sao ch\xE9p t\u1EA5t c\u1EA3",
        "result.copy_original": "Sao ch\xE9p b\u1EA3n g\u1ED1c",
        "result.copy_translation": "Sao ch\xE9p b\u1EA3n d\u1ECBch",
        "result.share": "Chia s\u1EBB",
        "result.save_done": "\u0110\xE3 l\u01B0u v\xE0o l\u1ECBch s\u1EED",
        "history.title": "L\u1ECBch s\u1EED",
        "history.empty": "Ch\u01B0a c\xF3 b\u1EA3n phi\xEAn \xE2m",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} \u0111o\u1EA1n",
        "history.item_has_translation": "C\xF3 b\u1EA3n d\u1ECBch",
        "history.delete_confirm": "X\xF3a b\u1EA3n ghi n\xE0y?",
        "history.delete_done": "\u0110\xE3 x\xF3a",
        "settings.title": "C\xE0i \u0111\u1EB7t",
        "settings.ui_language": "Ng\xF4n ng\u1EEF giao di\u1EC7n",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Ch\xEDnh s\xE1ch quy\u1EC1n ri\xEAng t\u01B0",
        "settings.terms": "\u0110i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5",
        "privacy.title": "\u0110i\u1EC1u kho\u1EA3n & Quy\u1EC1n ri\xEAng t\u01B0",
        "privacy.agree": "\u0110\u1ED3ng \xFD & Ti\u1EBFp t\u1EE5c",
        "privacy.disagree": "Kh\xF4ng \u0111\u1ED3ng \xFD",
        "offline.banner": "B\u1EA1n \u0111ang ngo\u1EA1i tuy\u1EBFn. B\u1EA3n ghi \xE2m \u0111\xE3 l\u01B0u \u2014 k\u1EBFt n\u1ED1i \u0111\u1EC3 phi\xEAn \xE2m.",
        "lang.zh-TW": "Ti\u1EBFng Trung ph\u1ED3n th\u1EC3",
        "lang.zh-CN": "Ti\u1EBFng Trung gi\u1EA3n th\u1EC3",
        "lang.en-US": "Ti\u1EBFng Anh",
        "lang.ja-JP": "Ti\u1EBFng Nh\u1EADt",
        "lang.ko-KR": "Ti\u1EBFng H\xE0n",
        "lang.vi-VN": "Ti\u1EBFng Vi\u1EC7t",
        "lang.es-ES": "Ti\u1EBFng T\xE2y Ban Nha",
        "lang.fr-FR": "Ti\u1EBFng Ph\xE1p",
        "lang.tl-PH": "Ti\u1EBFng Filipino",
        "lang.id-ID": "Ti\u1EBFng Indonesia",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "ho\u1EB7c",
        "home.start_recording": "B\u1EAFt \u0111\u1EA7u ghi \xE2m",
        "home.coming_soon": "S\u1EAFp ra m\u1EAFt",
        "home.recording": "\u0110ang ghi \xE2m\u2026",
        "home.stop_recording": "\u23F9 D\u1EEBng ghi \xE2m",
        "home.change": "Thay \u0111\u1ED5i",
        "result.gen_summary": "\u2728 T\u1EA1o t\xF3m t\u1EAFt",
        "result.regen": "\u{1F504} T\u1EA1o l\u1EA1i",
        "result.prompt_edit_hint": "Ch\u1EC9nh s\u1EEDa prompt tr\u01B0\u1EDBc khi g\u1EEDi",
        "result.prompt_send": "G\u1EEDi",
        "result.gen_translation": "\u2728 T\u1EA1o b\u1EA3n d\u1ECBch",
        "result.qa": "Q&A",
        "result.qa_placeholder": "\u0110\u1EB7t c\xE2u h\u1ECFi v\u1EC1 b\u1EA3n phi\xEAn \xE2m n\xE0y\u2026",
        "result.qa_send": "G\u1EEDi",
        "result.save": "L\u01B0u",
        "result.saved": "\u2713 \u0110\xE3 l\u01B0u",
        "settings.display_language": "Ng\xF4n ng\u1EEF hi\u1EC3n th\u1ECB",
        "settings.app_language": "Ng\xF4n ng\u1EEF \u1EE9ng d\u1EE5ng",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "Qu\u1EA3n l\xFD",
        "settings.defaults": "M\u1EB7c \u0111\u1ECBnh",
        "settings.audio_language": "Ng\xF4n ng\u1EEF \xE2m thanh",
        "settings.translate_to": "D\u1ECBch sang",
        "settings.about": "Gi\u1EDBi thi\u1EC7u",
        "settings.privacy_note": "API Key c\u1EE7a b\u1EA1n ch\u1EC9 \u0111\u01B0\u1EE3c l\u01B0u c\u1EE5c b\u1ED9. Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u n\xE0o \u0111i qua m\xE1y ch\u1EE7 c\u1EE7a ch\xFAng t\xF4i.",
        "history.open": "M\u1EDF",
        "history.loading": "\u0110ang t\u1EA3i\u2026",
        "tab.home": "Trang ch\u1EE7",
        "tab.history": "L\u1ECBch s\u1EED",
        "history.search": "T\xECm ki\u1EBFm\u2026",
        "history.rename": "\u0110\u1ED5i t\xEAn"
      },
      // ============================================================
      "es-ES": {
        "app.title": "SnapTranscript",
        "app.loading": "Cargando\u2026",
        "app.error.generic": "Algo sali\xF3 mal, int\xE9ntalo de nuevo",
        "app.cancel": "Cancelar",
        "app.confirm": "Confirmar",
        "app.close": "Cerrar",
        "app.save": "Guardar",
        "app.copy": "Copiar",
        "app.copied": "\xA1Copiado!",
        "app.share": "Compartir",
        "app.delete": "Eliminar",
        "app.back": "Volver",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Tu Key solo se almacena en este dispositivo. SnapTranscript nunca la ve \u2014 la app llama directamente a Gemini desde tu tel\xE9fono.",
        "apikey.set_badge": "\u2705 API Key configurada",
        "apikey.remove": "Eliminar Key",
        "apikey.not_set": "No hay API Key configurada.",
        "apikey.input_label": "Pega tu Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "Obt\xE9n tu Key gratuita en <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": 'Formato inv\xE1lido. Las keys de Gemini empiezan con "AIza" (39 caracteres).',
        "apikey.save": "Guardar Key",
        "home.select_audio": "Seleccionar archivo de audio",
        "home.selected_file": "Seleccionado: {filename}",
        "home.duration": "Duraci\xF3n: {duration}",
        "home.start": "Iniciar transcripci\xF3n",
        "home.history": "Historial",
        "home.settings": "Ajustes",
        "home.empty_title": "Listo",
        "home.empty_subtitle": "Toca abajo para grabar o subir un archivo de audio.",
        "split.title": "Configuraci\xF3n de divisi\xF3n",
        "split.auto": "Autom\xE1tico (cada 30 min)",
        "split.custom": "Puntos de divisi\xF3n personalizados",
        "split.add_point": "Agregar punto de divisi\xF3n",
        "split.segments": "{n} segmentos en total",
        "translate.enable": "Tambi\xE9n traducir",
        "translate.target_lang": "Idioma de destino",
        "process.compressing": "Comprimiendo audio\u2026",
        "process.uploading": "Subiendo\u2026 ({n}/{total} segmentos)",
        "process.transcribing": "Transcribiendo\u2026 ({n}/{total} segmentos)",
        "process.translating": "Traduciendo\u2026",
        "process.merging": "Combinando\u2026",
        "process.done": "\xA1Listo!",
        "process.error.upload": "Error al subir, int\xE9ntalo de nuevo",
        "process.error.transcribe": "Error de transcripci\xF3n",
        "process.error.size_exceeded": "Un segmento comprimido supera 100 MB. Acorta la grabaci\xF3n.",
        "process.retry": "Reintentar este segmento",
        "result.title": "Resultado de transcripci\xF3n",
        "result.original": "Original",
        "result.translation": "Traducci\xF3n",
        "result.summary": "Resumen",
        "result.copy_all": "Copiar todo",
        "result.copy_original": "Copiar original",
        "result.copy_translation": "Copiar traducci\xF3n",
        "result.share": "Compartir",
        "result.save_done": "Guardado en historial",
        "history.title": "Historial",
        "history.empty": "Sin transcripciones a\xFAn",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} segmentos",
        "history.item_has_translation": "Con traducci\xF3n",
        "history.delete_confirm": "\xBFEliminar este registro?",
        "history.delete_done": "Eliminado",
        "settings.title": "Ajustes",
        "settings.ui_language": "Idioma de interfaz",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Pol\xEDtica de privacidad",
        "settings.terms": "T\xE9rminos de servicio",
        "privacy.title": "T\xE9rminos y Privacidad",
        "privacy.agree": "Aceptar y continuar",
        "privacy.disagree": "No aceptar",
        "offline.banner": "Sin conexi\xF3n. Grabaci\xF3n guardada \u2014 con\xE9ctate para transcribir.",
        "lang.zh-TW": "Chino tradicional",
        "lang.zh-CN": "Chino simplificado",
        "lang.en-US": "Ingl\xE9s",
        "lang.ja-JP": "Japon\xE9s",
        "lang.ko-KR": "Coreano",
        "lang.vi-VN": "Vietnamita",
        "lang.es-ES": "Espa\xF1ol",
        "lang.fr-FR": "Franc\xE9s",
        "lang.tl-PH": "Filipino",
        "lang.id-ID": "Indonesio",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "o",
        "home.start_recording": "Iniciar grabaci\xF3n",
        "home.coming_soon": "Pr\xF3ximamente",
        "home.recording": "Grabando\u2026",
        "home.stop_recording": "\u23F9 Detener grabaci\xF3n",
        "home.change": "Cambiar",
        "result.gen_summary": "\u2728 Generar resumen",
        "result.regen": "\u{1F504} Regenerar",
        "result.prompt_edit_hint": "Edita el prompt antes de enviar",
        "result.prompt_send": "Enviar",
        "result.gen_translation": "\u2728 Generar traducci\xF3n",
        "result.qa": "Q&A",
        "result.qa_placeholder": "Pregunta sobre esta transcripci\xF3n\u2026",
        "result.qa_send": "Enviar",
        "result.save": "Guardar",
        "result.saved": "\u2713 Guardado",
        "settings.display_language": "Idioma de pantalla",
        "settings.app_language": "Idioma de la app",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "Gestionar",
        "settings.defaults": "Valores predeterminados",
        "settings.audio_language": "Idioma del audio",
        "settings.translate_to": "Traducir a",
        "settings.about": "Acerca de",
        "settings.privacy_note": "Tu API Key solo se almacena localmente. Ning\xFAn dato pasa por nuestros servidores.",
        "history.open": "Abrir",
        "history.loading": "Cargando\u2026",
        "tab.home": "Inicio",
        "tab.history": "Historial",
        "history.search": "Buscar\u2026",
        "history.rename": "Renombrar"
      },
      // ============================================================
      "fr-FR": {
        "app.title": "SnapTranscript",
        "app.loading": "Chargement\u2026",
        "app.error.generic": "Une erreur s'est produite, veuillez r\xE9essayer",
        "app.cancel": "Annuler",
        "app.confirm": "Confirmer",
        "app.close": "Fermer",
        "app.save": "Enregistrer",
        "app.copy": "Copier",
        "app.copied": "Copi\xE9 !",
        "app.share": "Partager",
        "app.delete": "Supprimer",
        "app.back": "Retour",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Votre Key est uniquement stock\xE9e sur cet appareil. SnapTranscript ne la voit jamais \u2014 l'app appelle directement Gemini depuis votre t\xE9l\xE9phone.",
        "apikey.set_badge": "\u2705 API Key configur\xE9e",
        "apikey.remove": "Supprimer la Key",
        "apikey.not_set": "Aucune API Key configur\xE9e.",
        "apikey.input_label": "Collez votre Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "Obtenez votre Key gratuitement sur <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": "\xAB AIza \xBB (39 caract\xE8res).",
        "apikey.save": "Enregistrer la Key",
        "home.select_audio": "S\xE9lectionner un fichier audio",
        "home.selected_file": "S\xE9lectionn\xE9 : {filename}",
        "home.duration": "Dur\xE9e : {duration}",
        "home.start": "Lancer la transcription",
        "home.history": "Historique",
        "home.settings": "Param\xE8tres",
        "home.empty_title": "Pr\xEAt",
        "home.empty_subtitle": "Appuyez ci-dessous pour enregistrer ou importer un fichier audio.",
        "split.title": "Param\xE8tres de d\xE9coupe",
        "split.auto": "Automatique (toutes les 30 min)",
        "split.custom": "Points de d\xE9coupe personnalis\xE9s",
        "split.add_point": "Ajouter un point de d\xE9coupe",
        "split.segments": "{n} segments au total",
        "translate.enable": "Traduire \xE9galement",
        "translate.target_lang": "Langue cible",
        "process.compressing": "Compression audio\u2026",
        "process.uploading": "Envoi\u2026 ({n}/{total} segments)",
        "process.transcribing": "Transcription\u2026 ({n}/{total} segments)",
        "process.translating": "Traduction\u2026",
        "process.merging": "Fusion\u2026",
        "process.done": "Termin\xE9 !",
        "process.error.upload": "\xC9chec de l'envoi, veuillez r\xE9essayer",
        "process.error.transcribe": "\xC9chec de la transcription",
        "process.error.size_exceeded": "Un segment compress\xE9 d\xE9passe 100 Mo. Raccourcissez l'enregistrement.",
        "process.retry": "R\xE9essayer ce segment",
        "result.title": "R\xE9sultat de transcription",
        "result.original": "Original",
        "result.translation": "Traduction",
        "result.summary": "R\xE9sum\xE9",
        "result.copy_all": "Tout copier",
        "result.copy_original": "Copier l'original",
        "result.copy_translation": "Copier la traduction",
        "result.share": "Partager",
        "result.save_done": "Enregistr\xE9 dans l'historique",
        "history.title": "Historique",
        "history.empty": "Aucune transcription pour l'instant",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} segments",
        "history.item_has_translation": "Avec traduction",
        "history.delete_confirm": "Supprimer cet enregistrement ?",
        "history.delete_done": "Supprim\xE9",
        "settings.title": "Param\xE8tres",
        "settings.ui_language": "Langue de l'interface",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Politique de confidentialit\xE9",
        "settings.terms": "Conditions d'utilisation",
        "privacy.title": "Conditions & Confidentialit\xE9",
        "privacy.agree": "Accepter et continuer",
        "privacy.disagree": "Refuser",
        "offline.banner": "Hors ligne. Enregistrement sauvegard\xE9 \u2014 connectez-vous pour transcrire.",
        "lang.zh-TW": "Chinois traditionnel",
        "lang.zh-CN": "Chinois simplifi\xE9",
        "lang.en-US": "Anglais",
        "lang.ja-JP": "Japonais",
        "lang.ko-KR": "Cor\xE9en",
        "lang.vi-VN": "Vietnamien",
        "lang.es-ES": "Espagnol",
        "lang.fr-FR": "Fran\xE7ais",
        "lang.tl-PH": "Filipino",
        "lang.id-ID": "Indon\xE9sien",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "ou",
        "home.start_recording": "Commencer l'enregistrement",
        "home.coming_soon": "Bient\xF4t disponible",
        "home.recording": "Enregistrement\u2026",
        "home.stop_recording": "\u23F9 Arr\xEAter l'enregistrement",
        "home.change": "Changer",
        "result.gen_summary": "\u2728 G\xE9n\xE9rer un r\xE9sum\xE9",
        "result.regen": "\u{1F504} R\xE9g\xE9n\xE9rer",
        "result.prompt_edit_hint": "Modifiez le prompt avant d'envoyer",
        "result.prompt_send": "Envoyer",
        "result.gen_translation": "\u2728 G\xE9n\xE9rer une traduction",
        "result.qa": "Q&A",
        "result.qa_placeholder": "Posez une question sur cette transcription\u2026",
        "result.qa_send": "Envoyer",
        "result.save": "Enregistrer",
        "result.saved": "\u2713 Enregistr\xE9",
        "settings.display_language": "Langue d'affichage",
        "settings.app_language": "Langue de l'app",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "G\xE9rer",
        "settings.defaults": "Valeurs par d\xE9faut",
        "settings.audio_language": "Langue audio",
        "settings.translate_to": "Traduire vers",
        "settings.about": "\xC0 propos",
        "settings.privacy_note": "Votre API Key est stock\xE9e uniquement en local. Aucune donn\xE9e ne transite par nos serveurs.",
        "history.open": "Ouvrir",
        "history.loading": "Chargement\u2026",
        "tab.home": "Accueil",
        "tab.history": "Historique",
        "history.search": "Rechercher\u2026",
        "history.rename": "Renommer"
      },
      // ============================================================
      "tl-PH": {
        "app.title": "SnapTranscript",
        "app.loading": "Naglo-load\u2026",
        "app.error.generic": "May nangyaring error, subukan ulit",
        "app.cancel": "Kanselahin",
        "app.confirm": "Kumpirmahin",
        "app.close": "Isara",
        "app.save": "I-save",
        "app.copy": "Kopyahin",
        "app.copied": "Nakopya!",
        "app.share": "I-share",
        "app.delete": "Burahin",
        "app.back": "Bumalik",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Ang iyong Key ay naka-store lamang sa device na ito. Hindi ito nakikita ng SnapTranscript \u2014 direktang tinatawagan ng app ang Gemini mula sa iyong telepono.",
        "apikey.set_badge": "\u2705 Naka-set na ang API Key",
        "apikey.remove": "Alisin ang Key",
        "apikey.not_set": "Walang API Key na naka-set.",
        "apikey.input_label": "I-paste ang iyong Gemini API Key",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "Kumuha ng libreng Key sa <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": 'Invalid na format. Ang Gemini Key ay nagsisimula sa "AIza" (39 character).',
        "apikey.save": "I-save ang Key",
        "home.select_audio": "Pumili ng audio file",
        "home.selected_file": "Napili: {filename}",
        "home.duration": "Tagal: {duration}",
        "home.start": "Simulan ang transcription",
        "home.history": "Kasaysayan",
        "home.settings": "Mga setting",
        "home.empty_title": "Handa na",
        "home.empty_subtitle": "I-tap sa ibaba para mag-record o mag-upload ng audio file.",
        "split.title": "Mga setting ng split",
        "split.auto": "Awtomatiko (bawat 30 min)",
        "split.custom": "Custom na split points",
        "split.add_point": "Magdagdag ng split point",
        "split.segments": "{n} segment sa kabuuan",
        "translate.enable": "Isalin din",
        "translate.target_lang": "Target na wika",
        "process.compressing": "Kino-compress ang audio\u2026",
        "process.uploading": "Ina-upload\u2026 ({n}/{total} segment)",
        "process.transcribing": "Tina-transcribe\u2026 ({n}/{total} segment)",
        "process.translating": "Isinasalin\u2026",
        "process.merging": "Pinagsasama\u2026",
        "process.done": "Tapos na!",
        "process.error.upload": "Nabigo ang pag-upload, subukan ulit",
        "process.error.transcribe": "Nabigo ang transcription",
        "process.error.size_exceeded": "Ang compressed segment ay lumampas sa 100 MB. Paikliin ang recording.",
        "process.retry": "Subukan ulit ang segment na ito",
        "result.title": "Resulta ng transcription",
        "result.original": "Orihinal",
        "result.translation": "Salin",
        "result.summary": "Buod",
        "result.copy_all": "Kopyahin lahat",
        "result.copy_original": "Kopyahin ang orihinal",
        "result.copy_translation": "Kopyahin ang salin",
        "result.share": "I-share",
        "result.save_done": "Nai-save sa kasaysayan",
        "history.title": "Kasaysayan",
        "history.empty": "Wala pang transcript",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} segment",
        "history.item_has_translation": "May salin",
        "history.delete_confirm": "Burahin ang record na ito?",
        "history.delete_done": "Nabura",
        "settings.title": "Mga setting",
        "settings.ui_language": "Wika ng interface",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Patakaran sa privacy",
        "settings.terms": "Mga tuntunin ng serbisyo",
        "privacy.title": "Mga Tuntunin at Privacy",
        "privacy.agree": "Sumangayon at magpatuloy",
        "privacy.disagree": "Hindi sumangayon",
        "offline.banner": "Offline ka. Nai-save ang recording \u2014 kumonekta para mag-transcribe.",
        "lang.zh-TW": "Tradisyonal na Tsino",
        "lang.zh-CN": "Simplified na Tsino",
        "lang.en-US": "Ingles",
        "lang.ja-JP": "Hapon",
        "lang.ko-KR": "Koreano",
        "lang.vi-VN": "Vietnamese",
        "lang.es-ES": "Espanyol",
        "lang.fr-FR": "Pranses",
        "lang.tl-PH": "Filipino",
        "lang.id-ID": "Indonesian",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "o",
        "home.start_recording": "Magsimulang mag-record",
        "home.coming_soon": "Paparating na",
        "home.recording": "Nagre-record\u2026",
        "home.stop_recording": "\u23F9 Itigil ang pagre-record",
        "home.change": "Palitan",
        "result.gen_summary": "\u2728 Gumawa ng buod",
        "result.regen": "\u{1F504} Buuin muli",
        "result.prompt_edit_hint": "I-edit ang prompt bago ipadala",
        "result.prompt_send": "Ipadala",
        "result.gen_translation": "\u2728 Gumawa ng salin",
        "result.qa": "Q&A",
        "result.qa_placeholder": "Magtanong tungkol sa transcript na ito\u2026",
        "result.qa_send": "Ipadala",
        "result.save": "I-save",
        "result.saved": "\u2713 Nai-save",
        "settings.display_language": "Wika ng display",
        "settings.app_language": "Wika ng app",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "Pamahalaan",
        "settings.defaults": "Mga default",
        "settings.audio_language": "Wika ng audio",
        "settings.translate_to": "Isalin sa",
        "settings.about": "Tungkol sa",
        "settings.privacy_note": "Ang iyong API Key ay naka-store lamang sa lokal. Walang data na dumadaan sa aming mga server.",
        "history.open": "Buksan",
        "history.loading": "Naglo-load\u2026",
        "tab.home": "Tahanan",
        "tab.history": "Kasaysayan",
        "history.search": "Maghanap\u2026",
        "history.rename": "Palitan ng pangalan"
      },
      // ============================================================
      "id-ID": {
        "app.title": "SnapTranscript",
        "app.loading": "Memuat\u2026",
        "app.error.generic": "Terjadi kesalahan, coba lagi",
        "app.cancel": "Batal",
        "app.confirm": "Konfirmasi",
        "app.close": "Tutup",
        "app.save": "Simpan",
        "app.copy": "Salin",
        "app.copied": "Tersalin!",
        "app.share": "Bagikan",
        "app.delete": "Hapus",
        "app.back": "Kembali",
        "apikey.title": "Gemini API Key",
        "apikey.privacy_notice": "Key Anda hanya disimpan di perangkat ini. SnapTranscript tidak pernah melihatnya \u2014 app memanggil Gemini langsung dari ponsel Anda.",
        "apikey.set_badge": "\u2705 API Key telah diatur",
        "apikey.remove": "Hapus Key",
        "apikey.not_set": "Belum ada API Key yang diatur.",
        "apikey.input_label": "Tempel Gemini API Key Anda",
        "apikey.placeholder": "AIza\u2026",
        "apikey.hint": "Dapatkan Key gratis di <strong>aistudio.google.com</strong> \u2192 Get API key",
        "apikey.error_format": 'Format tidak valid. Key Gemini dimulai dengan "AIza" (39 karakter).',
        "apikey.save": "Simpan Key",
        "home.select_audio": "Pilih file audio",
        "home.selected_file": "Dipilih: {filename}",
        "home.duration": "Durasi: {duration}",
        "home.start": "Mulai transkripsi",
        "home.history": "Riwayat",
        "home.settings": "Pengaturan",
        "home.empty_title": "Siap",
        "home.empty_subtitle": "Ketuk di bawah untuk mulai merekam atau unggah file audio.",
        "split.title": "Pengaturan pemisahan",
        "split.auto": "Otomatis (setiap 30 menit)",
        "split.custom": "Titik pemisahan kustom",
        "split.add_point": "Tambah titik pemisahan",
        "split.segments": "Total {n} segmen",
        "translate.enable": "Terjemahkan juga",
        "translate.target_lang": "Bahasa tujuan",
        "process.compressing": "Mengompresi audio\u2026",
        "process.uploading": "Mengunggah\u2026 ({n}/{total} segmen)",
        "process.transcribing": "Mentranskripsikan\u2026 ({n}/{total} segmen)",
        "process.translating": "Menerjemahkan\u2026",
        "process.merging": "Menggabungkan\u2026",
        "process.done": "Selesai!",
        "process.error.upload": "Gagal mengunggah, coba lagi",
        "process.error.transcribe": "Transkripsi gagal",
        "process.error.size_exceeded": "Segmen terkompresi melebihi 100 MB. Perpendek rekaman.",
        "process.retry": "Coba lagi segmen ini",
        "result.title": "Hasil transkripsi",
        "result.original": "Asli",
        "result.translation": "Terjemahan",
        "result.summary": "Ringkasan",
        "result.copy_all": "Salin semua",
        "result.copy_original": "Salin asli",
        "result.copy_translation": "Salin terjemahan",
        "result.share": "Bagikan",
        "result.save_done": "Disimpan ke riwayat",
        "history.title": "Riwayat",
        "history.empty": "Belum ada transkrip",
        "history.item_date": "{date}",
        "history.item_filename": "{filename}",
        "history.item_segments": "{n} segmen",
        "history.item_has_translation": "Dengan terjemahan",
        "history.delete_confirm": "Hapus catatan ini?",
        "history.delete_done": "Dihapus",
        "settings.title": "Pengaturan",
        "settings.ui_language": "Bahasa antarmuka",
        "settings.api_key": "Gemini API Key",
        "settings.privacy": "Kebijakan privasi",
        "settings.terms": "Ketentuan layanan",
        "privacy.title": "Ketentuan & Privasi",
        "privacy.agree": "Setuju & Lanjutkan",
        "privacy.disagree": "Tidak setuju",
        "offline.banner": "Anda offline. Rekaman tersimpan \u2014 hubungkan untuk mentranskripsikan.",
        "lang.zh-TW": "Bahasa Tionghoa Tradisional",
        "lang.zh-CN": "Bahasa Tionghoa Sederhana",
        "lang.en-US": "Bahasa Inggris",
        "lang.ja-JP": "Bahasa Jepang",
        "lang.ko-KR": "Bahasa Korea",
        "lang.vi-VN": "Bahasa Vietnam",
        "lang.es-ES": "Bahasa Spanyol",
        "lang.fr-FR": "Bahasa Prancis",
        "lang.tl-PH": "Bahasa Filipina",
        "lang.id-ID": "Bahasa Indonesia",
        "home.audio_formats": "mp3 \xB7 m4a \xB7 wav \xB7 mp4 \xB7 mov\u2026",
        "home.or": "atau",
        "home.start_recording": "Mulai merekam",
        "home.coming_soon": "Segera hadir",
        "home.recording": "Merekam\u2026",
        "home.stop_recording": "\u23F9 Hentikan perekaman",
        "home.change": "Ganti",
        "result.gen_summary": "\u2728 Buat ringkasan",
        "result.regen": "\u{1F504} Buat ulang",
        "result.prompt_edit_hint": "Edit prompt sebelum mengirim",
        "result.prompt_send": "Kirim",
        "result.gen_translation": "\u2728 Buat terjemahan",
        "result.qa": "Q&A",
        "result.qa_placeholder": "Ajukan pertanyaan tentang transkrip ini\u2026",
        "result.qa_send": "Kirim",
        "result.save": "Simpan",
        "result.saved": "\u2713 Tersimpan",
        "settings.display_language": "Bahasa tampilan",
        "settings.app_language": "Bahasa app",
        "settings.gemini_api": "Gemini API",
        "settings.manage": "Kelola",
        "settings.defaults": "Nilai default",
        "settings.audio_language": "Bahasa audio",
        "settings.translate_to": "Terjemahkan ke",
        "settings.about": "Tentang",
        "settings.privacy_note": "API Key Anda hanya disimpan secara lokal. Tidak ada data yang melewati server kami.",
        "history.open": "Buka",
        "history.loading": "Memuat\u2026",
        "tab.home": "Beranda",
        "tab.history": "Riwayat",
        "history.search": "Cari\u2026",
        "history.rename": "Ganti nama"
      }
    };
  }
});

// js/language_manager.js
var STORAGE_KEY, LanguageManager;
var init_language_manager = __esm({
  "js/language_manager.js"() {
    init_i18n_data();
    init_config();
    STORAGE_KEY = AppConfig.STORAGE_KEYS.UI_LANGUAGE;
    LanguageManager = class {
      constructor() {
        this.currentLang = localStorage.getItem(STORAGE_KEY) || this._detectSystemLanguage();
      }
      init() {
        this.translatePage();
      }
      setLanguage(lang) {
        if (!TRANSLATIONS[lang]) {
          console.warn(`[LanguageManager] Unknown language: ${lang}`);
          return;
        }
        this.currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        this.translatePage();
      }
      /** Get translated string. Fallback chain: target → en-US → key itself. */
      t(key, params = {}) {
        let text = TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key] || TRANSLATIONS["en-US"] && TRANSLATIONS["en-US"][key] || key;
        Object.keys(params).forEach((k) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]);
        });
        return text;
      }
      /** Update all DOM elements with data-i18n attribute. */
      translatePage() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          let params = {};
          try {
            const raw = el.getAttribute("data-i18n-params");
            if (raw) params = JSON.parse(raw.replace(/'/g, '"'));
          } catch (e) {
          }
          const text = this.t(key, params);
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            if (el.hasAttribute("placeholder")) el.placeholder = text;
          } else {
            el.innerHTML = text;
          }
        });
      }
      // ---- Private ----
      _detectSystemLanguage() {
        const code = (navigator.language || "").toLowerCase();
        if (!code) return "zh-TW";
        if (code.startsWith("zh")) return code.includes("cn") || code.includes("sg") ? "zh-CN" : "zh-TW";
        if (code.startsWith("en")) return "en-US";
        if (code.startsWith("ja")) return "ja-JP";
        if (code.startsWith("ko")) return "ko-KR";
        if (code.startsWith("vi")) return "vi-VN";
        if (code.startsWith("es")) return "es-ES";
        if (code.startsWith("fr")) return "fr-FR";
        if (code.startsWith("tl") || code.startsWith("fil")) return "tl-PH";
        if (code.startsWith("id")) return "id-ID";
        return "zh-TW";
      }
    };
  }
});

// node_modules/.pnpm/@capacitor+core@8.2.0/node_modules/@capacitor/core/dist/index.js
var ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp, SystemBarsStyle, SystemBarType, SystemBarsPluginWeb, SystemBars;
var init_dist = __esm({
  "node_modules/.pnpm/@capacitor+core@8.2.0/node_modules/@capacitor/core/dist/index.js"() {
    (function(ExceptionCode2) {
      ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
      ExceptionCode2["Unavailable"] = "UNAVAILABLE";
    })(ExceptionCode || (ExceptionCode = {}));
    CapacitorException = class extends Error {
      constructor(message, code, data) {
        super(message);
        this.message = message;
        this.code = code;
        this.data = data;
      }
    };
    getPlatformId = (win) => {
      var _a, _b;
      if (win === null || win === void 0 ? void 0 : win.androidBridge) {
        return "android";
      } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
        return "ios";
      } else {
        return "web";
      }
    };
    createCapacitor = (win) => {
      const capCustomPlatform = win.CapacitorCustomPlatform || null;
      const cap = win.Capacitor || {};
      const Plugins = cap.Plugins = cap.Plugins || {};
      const getPlatform = () => {
        return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
      };
      const isNativePlatform = () => getPlatform() !== "web";
      const isPluginAvailable = (pluginName) => {
        const plugin = registeredPlugins.get(pluginName);
        if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
          return true;
        }
        if (getPluginHeader(pluginName)) {
          return true;
        }
        return false;
      };
      const getPluginHeader = (pluginName) => {
        var _a;
        return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
      };
      const handleError = (err) => win.console.error(err);
      const registeredPlugins = /* @__PURE__ */ new Map();
      const registerPlugin2 = (pluginName, jsImplementations = {}) => {
        const registeredPlugin = registeredPlugins.get(pluginName);
        if (registeredPlugin) {
          console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
          return registeredPlugin.proxy;
        }
        const platform = getPlatform();
        const pluginHeader = getPluginHeader(pluginName);
        let jsImplementation;
        const loadPluginImplementation = async () => {
          if (!jsImplementation && platform in jsImplementations) {
            jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
          } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
            jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
          }
          return jsImplementation;
        };
        const createPluginMethod = (impl, prop) => {
          var _a, _b;
          if (pluginHeader) {
            const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
            if (methodHeader) {
              if (methodHeader.rtype === "promise") {
                return (options) => cap.nativePromise(pluginName, prop.toString(), options);
              } else {
                return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
              }
            } else if (impl) {
              return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
            }
          } else if (impl) {
            return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
          } else {
            throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        };
        const createPluginMethodWrapper = (prop) => {
          let remove;
          const wrapper = (...args) => {
            const p = loadPluginImplementation().then((impl) => {
              const fn = createPluginMethod(impl, prop);
              if (fn) {
                const p2 = fn(...args);
                remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                return p2;
              } else {
                throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
              }
            });
            if (prop === "addListener") {
              p.remove = async () => remove();
            }
            return p;
          };
          wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
          Object.defineProperty(wrapper, "name", {
            value: prop,
            writable: false,
            configurable: false
          });
          return wrapper;
        };
        const addListener = createPluginMethodWrapper("addListener");
        const removeListener = createPluginMethodWrapper("removeListener");
        const addListenerNative = (eventName, callback) => {
          const call = addListener({ eventName }, callback);
          const remove = async () => {
            const callbackId = await call;
            removeListener({
              eventName,
              callbackId
            }, callback);
          };
          const p = new Promise((resolve2) => call.then(() => resolve2({ remove })));
          p.remove = async () => {
            console.warn(`Using addListener() without 'await' is deprecated.`);
            await remove();
          };
          return p;
        };
        const proxy = new Proxy({}, {
          get(_, prop) {
            switch (prop) {
              // https://github.com/facebook/react/issues/20030
              case "$$typeof":
                return void 0;
              case "toJSON":
                return () => ({});
              case "addListener":
                return pluginHeader ? addListenerNative : addListener;
              case "removeListener":
                return removeListener;
              default:
                return createPluginMethodWrapper(prop);
            }
          }
        });
        Plugins[pluginName] = proxy;
        registeredPlugins.set(pluginName, {
          name: pluginName,
          proxy,
          platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
        });
        return proxy;
      };
      if (!cap.convertFileSrc) {
        cap.convertFileSrc = (filePath) => filePath;
      }
      cap.getPlatform = getPlatform;
      cap.handleError = handleError;
      cap.isNativePlatform = isNativePlatform;
      cap.isPluginAvailable = isPluginAvailable;
      cap.registerPlugin = registerPlugin2;
      cap.Exception = CapacitorException;
      cap.DEBUG = !!cap.DEBUG;
      cap.isLoggingEnabled = !!cap.isLoggingEnabled;
      return cap;
    };
    initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
    Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    registerPlugin = Capacitor.registerPlugin;
    WebPlugin = class {
      constructor() {
        this.listeners = {};
        this.retainedEventArguments = {};
        this.windowListeners = {};
      }
      addListener(eventName, listenerFunc) {
        let firstListener = false;
        const listeners = this.listeners[eventName];
        if (!listeners) {
          this.listeners[eventName] = [];
          firstListener = true;
        }
        this.listeners[eventName].push(listenerFunc);
        const windowListener = this.windowListeners[eventName];
        if (windowListener && !windowListener.registered) {
          this.addWindowListener(windowListener);
        }
        if (firstListener) {
          this.sendRetainedArgumentsForEvent(eventName);
        }
        const remove = async () => this.removeListener(eventName, listenerFunc);
        const p = Promise.resolve({ remove });
        return p;
      }
      async removeAllListeners() {
        this.listeners = {};
        for (const listener in this.windowListeners) {
          this.removeWindowListener(this.windowListeners[listener]);
        }
        this.windowListeners = {};
      }
      notifyListeners(eventName, data, retainUntilConsumed) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
          if (retainUntilConsumed) {
            let args = this.retainedEventArguments[eventName];
            if (!args) {
              args = [];
            }
            args.push(data);
            this.retainedEventArguments[eventName] = args;
          }
          return;
        }
        listeners.forEach((listener) => listener(data));
      }
      hasListeners(eventName) {
        var _a;
        return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
      }
      registerWindowListener(windowEventName, pluginEventName) {
        this.windowListeners[pluginEventName] = {
          registered: false,
          windowEventName,
          pluginEventName,
          handler: (event) => {
            this.notifyListeners(pluginEventName, event);
          }
        };
      }
      unimplemented(msg = "not implemented") {
        return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
      }
      unavailable(msg = "not available") {
        return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
      }
      async removeListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
          return;
        }
        const index = listeners.indexOf(listenerFunc);
        this.listeners[eventName].splice(index, 1);
        if (!this.listeners[eventName].length) {
          this.removeWindowListener(this.windowListeners[eventName]);
        }
      }
      addWindowListener(handle) {
        window.addEventListener(handle.windowEventName, handle.handler);
        handle.registered = true;
      }
      removeWindowListener(handle) {
        if (!handle) {
          return;
        }
        window.removeEventListener(handle.windowEventName, handle.handler);
        handle.registered = false;
      }
      sendRetainedArgumentsForEvent(eventName) {
        const args = this.retainedEventArguments[eventName];
        if (!args) {
          return;
        }
        delete this.retainedEventArguments[eventName];
        args.forEach((arg) => {
          this.notifyListeners(eventName, arg);
        });
      }
    };
    encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
    decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    CapacitorCookiesPluginWeb = class extends WebPlugin {
      async getCookies() {
        const cookies = document.cookie;
        const cookieMap = {};
        cookies.split(";").forEach((cookie) => {
          if (cookie.length <= 0)
            return;
          let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
          key = decode(key).trim();
          value = decode(value).trim();
          cookieMap[key] = value;
        });
        return cookieMap;
      }
      async setCookie(options) {
        try {
          const encodedKey = encode(options.key);
          const encodedValue = encode(options.value);
          const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
          const path = (options.path || "/").replace("path=", "");
          const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
          document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async deleteCookie(options) {
        try {
          document.cookie = `${options.key}=; Max-Age=0`;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async clearCookies() {
        try {
          const cookies = document.cookie.split(";") || [];
          for (const cookie of cookies) {
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async clearAllCookies() {
        try {
          await this.clearCookies();
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
    CapacitorCookies = registerPlugin("CapacitorCookies", {
      web: () => new CapacitorCookiesPluginWeb()
    });
    readBlobAsBase64 = async (blob) => new Promise((resolve2, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        resolve2(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
    normalizeHttpHeaders = (headers = {}) => {
      const originalKeys = Object.keys(headers);
      const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
      const normalized = loweredKeys.reduce((acc, key, index) => {
        acc[key] = headers[originalKeys[index]];
        return acc;
      }, {});
      return normalized;
    };
    buildUrlParams = (params, shouldEncode = true) => {
      if (!params)
        return null;
      const output = Object.entries(params).reduce((accumulator, entry) => {
        const [key, value] = entry;
        let encodedValue;
        let item;
        if (Array.isArray(value)) {
          item = "";
          value.forEach((str) => {
            encodedValue = shouldEncode ? encodeURIComponent(str) : str;
            item += `${key}=${encodedValue}&`;
          });
          item.slice(0, -1);
        } else {
          encodedValue = shouldEncode ? encodeURIComponent(value) : value;
          item = `${key}=${encodedValue}`;
        }
        return `${accumulator}&${item}`;
      }, "");
      return output.substr(1);
    };
    buildRequestInit = (options, extra = {}) => {
      const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
      const headers = normalizeHttpHeaders(options.headers);
      const type = headers["content-type"] || "";
      if (typeof options.data === "string") {
        output.body = options.data;
      } else if (type.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(options.data || {})) {
          params.set(key, value);
        }
        output.body = params.toString();
      } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
        const form = new FormData();
        if (options.data instanceof FormData) {
          options.data.forEach((value, key) => {
            form.append(key, value);
          });
        } else {
          for (const key of Object.keys(options.data)) {
            form.append(key, options.data[key]);
          }
        }
        output.body = form;
        const headers2 = new Headers(output.headers);
        headers2.delete("content-type");
        output.headers = headers2;
      } else if (type.includes("application/json") || typeof options.data === "object") {
        output.body = JSON.stringify(options.data);
      }
      return output;
    };
    CapacitorHttpPluginWeb = class extends WebPlugin {
      /**
       * Perform an Http request given a set of options
       * @param options Options to build the HTTP request
       */
      async request(options) {
        const requestInit = buildRequestInit(options, options.webFetchExtra);
        const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
        const url = urlParams ? `${options.url}?${urlParams}` : options.url;
        const response = await fetch(url, requestInit);
        const contentType = response.headers.get("content-type") || "";
        let { responseType = "text" } = response.ok ? options : {};
        if (contentType.includes("application/json")) {
          responseType = "json";
        }
        let data;
        let blob;
        switch (responseType) {
          case "arraybuffer":
          case "blob":
            blob = await response.blob();
            data = await readBlobAsBase64(blob);
            break;
          case "json":
            data = await response.json();
            break;
          case "document":
          case "text":
          default:
            data = await response.text();
        }
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        return {
          data,
          headers,
          status: response.status,
          url: response.url
        };
      }
      /**
       * Perform an Http GET request given a set of options
       * @param options Options to build the HTTP request
       */
      async get(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
      }
      /**
       * Perform an Http POST request given a set of options
       * @param options Options to build the HTTP request
       */
      async post(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
      }
      /**
       * Perform an Http PUT request given a set of options
       * @param options Options to build the HTTP request
       */
      async put(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
      }
      /**
       * Perform an Http PATCH request given a set of options
       * @param options Options to build the HTTP request
       */
      async patch(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
      }
      /**
       * Perform an Http DELETE request given a set of options
       * @param options Options to build the HTTP request
       */
      async delete(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
      }
    };
    CapacitorHttp = registerPlugin("CapacitorHttp", {
      web: () => new CapacitorHttpPluginWeb()
    });
    (function(SystemBarsStyle2) {
      SystemBarsStyle2["Dark"] = "DARK";
      SystemBarsStyle2["Light"] = "LIGHT";
      SystemBarsStyle2["Default"] = "DEFAULT";
    })(SystemBarsStyle || (SystemBarsStyle = {}));
    (function(SystemBarType2) {
      SystemBarType2["StatusBar"] = "StatusBar";
      SystemBarType2["NavigationBar"] = "NavigationBar";
    })(SystemBarType || (SystemBarType = {}));
    SystemBarsPluginWeb = class extends WebPlugin {
      async setStyle() {
        this.unavailable("not available for web");
      }
      async setAnimation() {
        this.unavailable("not available for web");
      }
      async show() {
        this.unavailable("not available for web");
      }
      async hide() {
        this.unavailable("not available for web");
      }
    };
    SystemBars = registerPlugin("SystemBars", {
      web: () => new SystemBarsPluginWeb()
    });
  }
});

// node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/definitions.js
var init_definitions = __esm({
  "node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/definitions.js"() {
  }
});

// node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/web.js
var web_exports = {};
__export(web_exports, {
  PreferencesWeb: () => PreferencesWeb
});
var PreferencesWeb;
var init_web = __esm({
  "node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/web.js"() {
    init_dist();
    PreferencesWeb = class extends WebPlugin {
      constructor() {
        super(...arguments);
        this.group = "CapacitorStorage";
      }
      async configure({ group }) {
        if (typeof group === "string") {
          this.group = group;
        }
      }
      async get(options) {
        const value = this.impl.getItem(this.applyPrefix(options.key));
        return { value };
      }
      async set(options) {
        this.impl.setItem(this.applyPrefix(options.key), options.value);
      }
      async remove(options) {
        this.impl.removeItem(this.applyPrefix(options.key));
      }
      async keys() {
        const keys = this.rawKeys().map((k) => k.substring(this.prefix.length));
        return { keys };
      }
      async clear() {
        for (const key of this.rawKeys()) {
          this.impl.removeItem(key);
        }
      }
      async migrate() {
        var _a;
        const migrated = [];
        const existing = [];
        const oldprefix = "_cap_";
        const keys = Object.keys(this.impl).filter((k) => k.indexOf(oldprefix) === 0);
        for (const oldkey of keys) {
          const key = oldkey.substring(oldprefix.length);
          const value = (_a = this.impl.getItem(oldkey)) !== null && _a !== void 0 ? _a : "";
          const { value: currentValue } = await this.get({ key });
          if (typeof currentValue === "string") {
            existing.push(key);
          } else {
            await this.set({ key, value });
            migrated.push(key);
          }
        }
        return { migrated, existing };
      }
      async removeOld() {
        const oldprefix = "_cap_";
        const keys = Object.keys(this.impl).filter((k) => k.indexOf(oldprefix) === 0);
        for (const oldkey of keys) {
          this.impl.removeItem(oldkey);
        }
      }
      get impl() {
        return window.localStorage;
      }
      get prefix() {
        return this.group === "NativeStorage" ? "" : `${this.group}.`;
      }
      rawKeys() {
        return Object.keys(this.impl).filter((k) => k.indexOf(this.prefix) === 0);
      }
      applyPrefix(key) {
        return this.prefix + key;
      }
    };
  }
});

// node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/index.js
var Preferences;
var init_esm = __esm({
  "node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.2.0/node_modules/@capacitor/preferences/dist/esm/index.js"() {
    init_dist();
    init_definitions();
    Preferences = registerPlugin("Preferences", {
      web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.PreferencesWeb())
    });
  }
});

// js/api_key_service.js
var KEY, ApiKeyService;
var init_api_key_service = __esm({
  "js/api_key_service.js"() {
    init_esm();
    init_config();
    KEY = AppConfig.STORAGE_KEYS.API_KEY;
    ApiKeyService = {
      /** Returns the stored API key, or null if not set. */
      async get() {
        const { value } = await Preferences.get({ key: KEY });
        return value;
      },
      /** Saves the API key to local storage. Trims whitespace. */
      async save(apiKey) {
        await Preferences.set({ key: KEY, value: apiKey.trim() });
      },
      /** Removes the API key from local storage. */
      async delete() {
        await Preferences.remove({ key: KEY });
      },
      /** Returns true if a key is stored. */
      async hasKey() {
        const key = await this.get();
        return typeof key === "string" && key.length > 0;
      },
      /**
       * Validates key format without making a network call.
       * Gemini API keys: start with "AIza", total 39 characters.
       */
      isValidFormat(apiKey) {
        return typeof apiKey === "string" && /^AIza[A-Za-z0-9_-]{35}$/.test(apiKey);
      }
    };
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js
var CORE_VERSION, CORE_URL, FFMessageType;
var init_const = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js"() {
    CORE_VERSION = "0.12.9";
    CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.js`;
    (function(FFMessageType2) {
      FFMessageType2["LOAD"] = "LOAD";
      FFMessageType2["EXEC"] = "EXEC";
      FFMessageType2["FFPROBE"] = "FFPROBE";
      FFMessageType2["WRITE_FILE"] = "WRITE_FILE";
      FFMessageType2["READ_FILE"] = "READ_FILE";
      FFMessageType2["DELETE_FILE"] = "DELETE_FILE";
      FFMessageType2["RENAME"] = "RENAME";
      FFMessageType2["CREATE_DIR"] = "CREATE_DIR";
      FFMessageType2["LIST_DIR"] = "LIST_DIR";
      FFMessageType2["DELETE_DIR"] = "DELETE_DIR";
      FFMessageType2["ERROR"] = "ERROR";
      FFMessageType2["DOWNLOAD"] = "DOWNLOAD";
      FFMessageType2["PROGRESS"] = "PROGRESS";
      FFMessageType2["LOG"] = "LOG";
      FFMessageType2["MOUNT"] = "MOUNT";
      FFMessageType2["UNMOUNT"] = "UNMOUNT";
    })(FFMessageType || (FFMessageType = {}));
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js
var getMessageID;
var init_utils = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js"() {
    getMessageID = /* @__PURE__ */ (() => {
      let messageID = 0;
      return () => messageID++;
    })();
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js
var ERROR_UNKNOWN_MESSAGE_TYPE, ERROR_NOT_LOADED, ERROR_TERMINATED, ERROR_IMPORT_FAILURE;
var init_errors = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js"() {
    ERROR_UNKNOWN_MESSAGE_TYPE = new Error("unknown message type");
    ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
    ERROR_TERMINATED = new Error("called FFmpeg.terminate()");
    ERROR_IMPORT_FAILURE = new Error("failed to import ffmpeg-core.js");
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js
var _worker, _resolves, _rejects, _logEventCallbacks, _progressEventCallbacks, _registerHandlers, _send, FFmpeg;
var init_classes = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js"() {
    init_const();
    init_utils();
    init_errors();
    FFmpeg = class {
      constructor() {
        __privateAdd(this, _worker, null);
        /**
         * #resolves and #rejects tracks Promise resolves and rejects to
         * be called when we receive message from web worker.
         */
        __privateAdd(this, _resolves, {});
        __privateAdd(this, _rejects, {});
        __privateAdd(this, _logEventCallbacks, []);
        __privateAdd(this, _progressEventCallbacks, []);
        __publicField(this, "loaded", false);
        /**
         * register worker message event handlers.
         */
        __privateAdd(this, _registerHandlers, () => {
          if (__privateGet(this, _worker)) {
            __privateGet(this, _worker).onmessage = ({ data: { id, type, data } }) => {
              switch (type) {
                case FFMessageType.LOAD:
                  this.loaded = true;
                  __privateGet(this, _resolves)[id](data);
                  break;
                case FFMessageType.MOUNT:
                case FFMessageType.UNMOUNT:
                case FFMessageType.EXEC:
                case FFMessageType.FFPROBE:
                case FFMessageType.WRITE_FILE:
                case FFMessageType.READ_FILE:
                case FFMessageType.DELETE_FILE:
                case FFMessageType.RENAME:
                case FFMessageType.CREATE_DIR:
                case FFMessageType.LIST_DIR:
                case FFMessageType.DELETE_DIR:
                  __privateGet(this, _resolves)[id](data);
                  break;
                case FFMessageType.LOG:
                  __privateGet(this, _logEventCallbacks).forEach((f2) => f2(data));
                  break;
                case FFMessageType.PROGRESS:
                  __privateGet(this, _progressEventCallbacks).forEach((f2) => f2(data));
                  break;
                case FFMessageType.ERROR:
                  __privateGet(this, _rejects)[id](data);
                  break;
              }
              delete __privateGet(this, _resolves)[id];
              delete __privateGet(this, _rejects)[id];
            };
          }
        });
        /**
         * Generic function to send messages to web worker.
         */
        __privateAdd(this, _send, ({ type, data }, trans = [], signal) => {
          if (!__privateGet(this, _worker)) {
            return Promise.reject(ERROR_NOT_LOADED);
          }
          return new Promise((resolve2, reject) => {
            const id = getMessageID();
            __privateGet(this, _worker) && __privateGet(this, _worker).postMessage({ id, type, data }, trans);
            __privateGet(this, _resolves)[id] = resolve2;
            __privateGet(this, _rejects)[id] = reject;
            signal?.addEventListener("abort", () => {
              reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
            }, { once: true });
          });
        });
        /**
         * Loads ffmpeg-core inside web worker. It is required to call this method first
         * as it initializes WebAssembly and other essential variables.
         *
         * @category FFmpeg
         * @returns `true` if ffmpeg core is loaded for the first time.
         */
        __publicField(this, "load", ({ classWorkerURL, ...config } = {}, { signal } = {}) => {
          if (!__privateGet(this, _worker)) {
            __privateSet(this, _worker, classWorkerURL ? new Worker(new URL(classWorkerURL, import.meta.url), {
              type: "module"
            }) : (
              // We need to duplicated the code here to enable webpack
              // to bundle worekr.js here.
              new Worker(new URL("./worker.js", import.meta.url), {
                type: "module"
              })
            ));
            __privateGet(this, _registerHandlers).call(this);
          }
          return __privateGet(this, _send).call(this, {
            type: FFMessageType.LOAD,
            data: config
          }, void 0, signal);
        });
        /**
         * Execute ffmpeg command.
         *
         * @remarks
         * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
         * by default.
         *
         * @example
         * ```ts
         * const ffmpeg = new FFmpeg();
         * await ffmpeg.load();
         * await ffmpeg.writeFile("video.avi", ...);
         * // ffmpeg -i video.avi video.mp4
         * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
         * const data = ffmpeg.readFile("video.mp4");
         * ```
         *
         * @returns `0` if no error, `!= 0` if timeout (1) or error.
         * @category FFmpeg
         */
        __publicField(this, "exec", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.EXEC,
          data: { args, timeout }
        }, void 0, signal));
        /**
         * Execute ffprobe command.
         *
         * @example
         * ```ts
         * const ffmpeg = new FFmpeg();
         * await ffmpeg.load();
         * await ffmpeg.writeFile("video.avi", ...);
         * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
         * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
         * const data = ffmpeg.readFile("output.txt");
         * ```
         *
         * @returns `0` if no error, `!= 0` if timeout (1) or error.
         * @category FFmpeg
         */
        __publicField(this, "ffprobe", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.FFPROBE,
          data: { args, timeout }
        }, void 0, signal));
        /**
         * Terminate all ongoing API calls and terminate web worker.
         * `FFmpeg.load()` must be called again before calling any other APIs.
         *
         * @category FFmpeg
         */
        __publicField(this, "terminate", () => {
          const ids = Object.keys(__privateGet(this, _rejects));
          for (const id of ids) {
            __privateGet(this, _rejects)[id](ERROR_TERMINATED);
            delete __privateGet(this, _rejects)[id];
            delete __privateGet(this, _resolves)[id];
          }
          if (__privateGet(this, _worker)) {
            __privateGet(this, _worker).terminate();
            __privateSet(this, _worker, null);
            this.loaded = false;
          }
        });
        /**
         * Write data to ffmpeg.wasm.
         *
         * @example
         * ```ts
         * const ffmpeg = new FFmpeg();
         * await ffmpeg.load();
         * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
         * await ffmpeg.writeFile("text.txt", "hello world");
         * ```
         *
         * @category File System
         */
        __publicField(this, "writeFile", (path, data, { signal } = {}) => {
          const trans = [];
          if (data instanceof Uint8Array) {
            trans.push(data.buffer);
          }
          return __privateGet(this, _send).call(this, {
            type: FFMessageType.WRITE_FILE,
            data: { path, data }
          }, trans, signal);
        });
        __publicField(this, "mount", (fsType, options, mountPoint) => {
          const trans = [];
          return __privateGet(this, _send).call(this, {
            type: FFMessageType.MOUNT,
            data: { fsType, options, mountPoint }
          }, trans);
        });
        __publicField(this, "unmount", (mountPoint) => {
          const trans = [];
          return __privateGet(this, _send).call(this, {
            type: FFMessageType.UNMOUNT,
            data: { mountPoint }
          }, trans);
        });
        /**
         * Read data from ffmpeg.wasm.
         *
         * @example
         * ```ts
         * const ffmpeg = new FFmpeg();
         * await ffmpeg.load();
         * const data = await ffmpeg.readFile("video.mp4");
         * ```
         *
         * @category File System
         */
        __publicField(this, "readFile", (path, encoding = "binary", { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.READ_FILE,
          data: { path, encoding }
        }, void 0, signal));
        /**
         * Delete a file.
         *
         * @category File System
         */
        __publicField(this, "deleteFile", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.DELETE_FILE,
          data: { path }
        }, void 0, signal));
        /**
         * Rename a file or directory.
         *
         * @category File System
         */
        __publicField(this, "rename", (oldPath, newPath, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.RENAME,
          data: { oldPath, newPath }
        }, void 0, signal));
        /**
         * Create a directory.
         *
         * @category File System
         */
        __publicField(this, "createDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.CREATE_DIR,
          data: { path }
        }, void 0, signal));
        /**
         * List directory contents.
         *
         * @category File System
         */
        __publicField(this, "listDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.LIST_DIR,
          data: { path }
        }, void 0, signal));
        /**
         * Delete an empty directory.
         *
         * @category File System
         */
        __publicField(this, "deleteDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
          type: FFMessageType.DELETE_DIR,
          data: { path }
        }, void 0, signal));
      }
      on(event, callback) {
        if (event === "log") {
          __privateGet(this, _logEventCallbacks).push(callback);
        } else if (event === "progress") {
          __privateGet(this, _progressEventCallbacks).push(callback);
        }
      }
      off(event, callback) {
        if (event === "log") {
          __privateSet(this, _logEventCallbacks, __privateGet(this, _logEventCallbacks).filter((f2) => f2 !== callback));
        } else if (event === "progress") {
          __privateSet(this, _progressEventCallbacks, __privateGet(this, _progressEventCallbacks).filter((f2) => f2 !== callback));
        }
      }
    };
    _worker = new WeakMap();
    _resolves = new WeakMap();
    _rejects = new WeakMap();
    _logEventCallbacks = new WeakMap();
    _progressEventCallbacks = new WeakMap();
    _registerHandlers = new WeakMap();
    _send = new WeakMap();
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js
var FFFSType;
var init_types = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/types.js"() {
    (function(FFFSType2) {
      FFFSType2["MEMFS"] = "MEMFS";
      FFFSType2["NODEFS"] = "NODEFS";
      FFFSType2["NODERAWFS"] = "NODERAWFS";
      FFFSType2["IDBFS"] = "IDBFS";
      FFFSType2["WORKERFS"] = "WORKERFS";
      FFFSType2["PROXYFS"] = "PROXYFS";
    })(FFFSType || (FFFSType = {}));
  }
});

// node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js
var init_esm2 = __esm({
  "node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/index.js"() {
    init_classes();
    init_types();
  }
});

// node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js
var ERROR_RESPONSE_BODY_READER, ERROR_INCOMPLETED_DOWNLOAD;
var init_errors2 = __esm({
  "node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js"() {
    ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
    ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");
  }
});

// node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js
var HeaderContentLength;
var init_const2 = __esm({
  "node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/const.js"() {
    HeaderContentLength = "Content-Length";
  }
});

// node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js
var readFromBlobOrFile, fetchFile, downloadWithProgress, toBlobURL;
var init_esm3 = __esm({
  "node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js"() {
    init_errors2();
    init_const2();
    readFromBlobOrFile = (blob) => new Promise((resolve2, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const { result } = fileReader;
        if (result instanceof ArrayBuffer) {
          resolve2(new Uint8Array(result));
        } else {
          resolve2(new Uint8Array());
        }
      };
      fileReader.onerror = (event) => {
        reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));
      };
      fileReader.readAsArrayBuffer(blob);
    });
    fetchFile = async (file) => {
      let data;
      if (typeof file === "string") {
        if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
          data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
        } else {
          data = await (await fetch(file)).arrayBuffer();
        }
      } else if (file instanceof URL) {
        data = await (await fetch(file)).arrayBuffer();
      } else if (file instanceof File || file instanceof Blob) {
        data = await readFromBlobOrFile(file);
      } else {
        return new Uint8Array();
      }
      return new Uint8Array(data);
    };
    downloadWithProgress = async (url, cb) => {
      const resp = await fetch(url);
      let buf;
      try {
        const total = parseInt(resp.headers.get(HeaderContentLength) || "-1");
        const reader = resp.body?.getReader();
        if (!reader)
          throw ERROR_RESPONSE_BODY_READER;
        const chunks = [];
        let received = 0;
        for (; ; ) {
          const { done, value } = await reader.read();
          const delta = value ? value.length : 0;
          if (done) {
            if (total != -1 && total !== received)
              throw ERROR_INCOMPLETED_DOWNLOAD;
            cb && cb({ url, total, received, delta, done });
            break;
          }
          chunks.push(value);
          received += delta;
          cb && cb({ url, total, received, delta, done });
        }
        const data = new Uint8Array(received);
        let position = 0;
        for (const chunk of chunks) {
          data.set(chunk, position);
          position += chunk.length;
        }
        buf = data.buffer;
      } catch (e) {
        console.log(`failed to send download progress event: `, e);
        buf = await resp.arrayBuffer();
        cb && cb({
          url,
          total: buf.byteLength,
          received: buf.byteLength,
          delta: 0,
          done: true
        });
      }
      return buf;
    };
    toBlobURL = async (url, mimeType, progress = false, cb) => {
      const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer();
      const blob = new Blob([buf], { type: mimeType });
      return URL.createObjectURL(blob);
    };
  }
});

// js/ffmpeg_service.js
function _getExt(filename) {
  if (!filename) return ".audio";
  const m = filename.match(/\.[^.]+$/);
  return m ? m[0] : ".audio";
}
var MODULE, _ffmpeg, _loaded, FFmpegService;
var init_ffmpeg_service = __esm({
  "js/ffmpeg_service.js"() {
    init_esm2();
    init_esm3();
    init_debug_logger();
    init_config();
    MODULE = "FFmpeg";
    _ffmpeg = null;
    _loaded = false;
    FFmpegService = {
      /** Lazy-load FFmpeg.wasm from CDN. Safe to call multiple times. */
      async load(onProgress) {
        if (_loaded) {
          DebugLogger.log(MODULE, "already loaded");
          return;
        }
        DebugLogger.log(MODULE, "loading from CDN", AppConfig.FFMPEG_CORE_URL);
        onProgress?.({ stage: "loading", percent: 0, detail: "Loading FFmpeg..." });
        try {
          _ffmpeg = new FFmpeg();
          _ffmpeg.on("log", ({ message }) => {
            DebugLogger.log(MODULE, "ffmpeg-log", message);
          });
          _ffmpeg.on("progress", ({ progress }) => {
            const pct = Math.min(Math.round(progress * 100), 95);
            DebugLogger.log(MODULE, "progress", `${pct}%`);
            onProgress?.({ stage: "compressing", percent: pct, detail: "Compressing audio..." });
          });
          DebugLogger.log(MODULE, "fetching core from CDN...");
          const coreURL = await toBlobURL(AppConfig.FFMPEG_CORE_URL, "text/javascript");
          const wasmURL = await toBlobURL(AppConfig.FFMPEG_WASM_URL, "application/wasm");
          DebugLogger.log(MODULE, "CDN fetch OK, loading ffmpeg...");
          await _ffmpeg.load({ coreURL, wasmURL });
          _loaded = true;
          DebugLogger.log(MODULE, "loaded OK");
          onProgress?.({ stage: "loading", percent: 100, detail: "FFmpeg ready" });
        } catch (err) {
          DebugLogger.error(MODULE, "load FAILED", err.message);
          throw new Error(`FFmpeg load failed: ${err.message}`);
        }
      },
      /**
       * Compress audio + split into 30-min segments.
       * @param {File} file       - Input audio/video file from the file picker
       * @param {function} onProgress  - { stage, percent, detail }
       * @returns {Blob[]}        - Array of compressed Opus audio blobs (audio/ogg)
       */
      async processAudio(file, onProgress) {
        DebugLogger.log(MODULE, "processAudio start", `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        onProgress?.({ stage: "loading", percent: 0, detail: "Preparing FFmpeg..." });
        if (!_loaded) {
          await this.load(onProgress);
        }
        try {
          const ext = _getExt(file.name);
          const inputName = `input${ext}`;
          DebugLogger.log(MODULE, "writing input", inputName);
          onProgress?.({ stage: "compressing", percent: 2, detail: "Reading file..." });
          await _ffmpeg.writeFile(inputName, await fetchFile(file));
          DebugLogger.log(MODULE, "input written OK");
          DebugLogger.log(MODULE, "exec compress+split");
          onProgress?.({ stage: "compressing", percent: 5, detail: "Compressing audio..." });
          await _ffmpeg.exec([
            "-i",
            inputName,
            "-vn",
            // strip video track
            "-c:a",
            "libopus",
            // Opus codec
            "-b:a",
            AppConfig.AUDIO_BITRATE,
            // 32kbps
            "-ac",
            "1",
            // mono — sufficient for speech
            "-ar",
            "16000",
            // 16kHz — optimal for speech recognition
            "-f",
            "segment",
            // segment muxer
            "-segment_time",
            String(AppConfig.SEGMENT_DURATION_SEC),
            "-reset_timestamps",
            "1",
            "part%03d.ogg"
          ]);
          DebugLogger.log(MODULE, "FFmpeg exec done");
          onProgress?.({ stage: "compressing", percent: 90, detail: "Reading output segments..." });
          const segments = [];
          for (let i = 0; ; i++) {
            const name = `part${String(i).padStart(3, "0")}.ogg`;
            let data;
            try {
              data = await _ffmpeg.readFile(name);
            } catch {
              DebugLogger.log(MODULE, `no more segments after index ${i}`);
              break;
            }
            const blob = new Blob([data], { type: "audio/ogg" });
            const sizeMB = blob.size / 1024 / 1024;
            DebugLogger.log(MODULE, `segment[${i}]`, `${sizeMB.toFixed(2)}MB`);
            if (sizeMB > AppConfig.MAX_SEGMENT_SIZE_MB) {
              throw new Error(`Segment ${i} is ${sizeMB.toFixed(0)}MB \u2014 exceeds ${AppConfig.MAX_SEGMENT_SIZE_MB}MB limit. Audio may be too long.`);
            }
            segments.push(blob);
            await _ffmpeg.deleteFile(name).catch(() => {
            });
          }
          await _ffmpeg.deleteFile(inputName).catch(() => {
          });
          if (segments.length === 0) {
            throw new Error("FFmpeg produced no output \u2014 unsupported audio format or empty file.");
          }
          DebugLogger.log(MODULE, "processAudio complete", `${segments.length} segment(s)`);
          onProgress?.({ stage: "compressing", percent: 100, detail: `${segments.length} segment(s) ready` });
          return segments;
        } catch (err) {
          DebugLogger.error(MODULE, "processAudio FAILED", err.message);
          throw err;
        }
      }
    };
  }
});

// js/transcribe_service.js
var MODULE2, BASE, UPLOAD_BASE, MODEL, TranscribeService;
var init_transcribe_service = __esm({
  "js/transcribe_service.js"() {
    init_debug_logger();
    init_config();
    init_api_key_service();
    MODULE2 = "Transcribe";
    BASE = AppConfig.GEMINI_API_BASE;
    UPLOAD_BASE = AppConfig.GEMINI_UPLOAD_BASE;
    MODEL = AppConfig.GEMINI_MODEL;
    TranscribeService = {
      /**
       * Main entry point: transcribe all audio segments via Gemini.
       * @param {Blob[]} segments  - From FFmpegService.processAudio()
       * @param {object} options   - { language, translate, targetLanguage }
       * @param {function} onProgress - { stage, percent, detail }
       * @returns {{ original: string, translated: string|null }}
       */
      async transcribeAll(segments, options, onProgress) {
        DebugLogger.log(MODULE2, "transcribeAll start", `${segments.length} seg, lang=${options.language}, translate=${options.translate}`);
        const apiKey = await ApiKeyService.get();
        if (!apiKey) throw new Error("No Gemini API key found. Please set your key in Settings.");
        const transcripts = [];
        const total = segments.length;
        for (let i = 0; i < total; i++) {
          const seg = segments[i];
          const n = i + 1;
          DebugLogger.log(MODULE2, `seg ${n}/${total}`, `${(seg.size / 1024 / 1024).toFixed(2)}MB`);
          onProgress?.({ stage: "uploading", percent: Math.round(i / total * 30), detail: `Uploading part ${n}/${total}...` });
          const { fileName, fileUri } = await this._uploadFile(seg, "audio/ogg", apiKey);
          DebugLogger.log(MODULE2, `upload OK ${n}`, fileUri);
          onProgress?.({ stage: "uploading", percent: Math.round(i / total * 30 + 10), detail: `Waiting for part ${n}/${total}...` });
          await this._waitForFile(fileName, apiKey);
          DebugLogger.log(MODULE2, `file ACTIVE ${n}`);
          onProgress?.({ stage: "transcribing", percent: Math.round(40 + i / total * 50), detail: `Transcribing part ${n}/${total}...` });
          const text = await this._transcribeSegment(fileUri, options.language, apiKey);
          DebugLogger.log(MODULE2, `transcript ${n} OK`, `${text.length} chars`);
          transcripts.push(text);
        }
        const original = transcripts.join("\n\n");
        DebugLogger.log(MODULE2, "all segments done", `${original.length} total chars`);
        let translated = null;
        if (options.translate && options.targetLanguage && options.targetLanguage !== "none") {
          onProgress?.({ stage: "translating", percent: 92, detail: `Translating to ${options.targetLanguage}...` });
          translated = await this.translate(original, options.targetLanguage, apiKey);
          DebugLogger.log(MODULE2, "translation OK", `${translated.length} chars`);
        }
        onProgress?.({ stage: "done", percent: 100, detail: "Complete!" });
        return { original, translated };
      },
      // ---- On-demand AI features (called from ResultView) ----
      async translate(text, targetLang, apiKey) {
        DebugLogger.log(MODULE2, "translate", targetLang);
        if (!apiKey) apiKey = await ApiKeyService.get();
        const langMap = {
          "zh-TW": "Traditional Chinese (\u7E41\u9AD4\u4E2D\u6587)",
          "zh-CN": "Simplified Chinese (\u7B80\u4F53\u4E2D\u6587)",
          "en": "English",
          "ja": "Japanese",
          "ko": "Korean",
          "fr": "French",
          "de": "German",
          "es": "Spanish",
          "pt": "Portuguese",
          "th": "Thai"
        };
        const lang = langMap[targetLang] || targetLang;
        const prompt = `Translate the following transcript to ${lang}. Output only the translated text, no explanation or commentary.

${text}`;
        return this._generateText(prompt, apiKey);
      },
      async summarize(text, apiKey, outputLang, customPrompt = null) {
        DebugLogger.log(MODULE2, "summarize", customPrompt ? "custom" : outputLang);
        if (!apiKey) apiKey = await ApiKeyService.get();
        const prompt = customPrompt ? `${customPrompt}

${text}` : `Extract all significant information from this transcript. Group the content under clear topic headings based on the discussion flow, with detailed nested bullet points under each heading. Capture key decisions, action items (with assignees and deadlines if mentioned), specific data or metrics, and important context. Include all relevant details, even minor ones.${outputLang ? ` Write the output in ${outputLang}.` : ""}

${text}`;
        return this._generateText(prompt, apiKey);
      },
      async askQuestion(transcript, question, apiKey) {
        DebugLogger.log(MODULE2, "askQuestion", question.substring(0, 60));
        if (!apiKey) apiKey = await ApiKeyService.get();
        const prompt = `Based on this transcript, answer the question concisely.

Transcript:
${transcript}

Question: ${question}`;
        return this._generateText(prompt, apiKey);
      },
      // ---- Private: Gemini Files API ----
      async _uploadFile(blob, mimeType, apiKey) {
        DebugLogger.log(MODULE2, "_uploadFile", `${(blob.size / 1024 / 1024).toFixed(2)}MB mimeType=${mimeType}`);
        const url = `${UPLOAD_BASE}/files?uploadType=multipart&key=${apiKey}`;
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify({ file: { mimeType } })], { type: "application/json" }));
        form.append("file", blob, "audio.ogg");
        DebugLogger.log(MODULE2, "_uploadFile sending...");
        const resp = await fetch(url, { method: "POST", body: form });
        if (!resp.ok) {
          const errText = await resp.text();
          DebugLogger.error(MODULE2, "_uploadFile HTTP error", `${resp.status}: ${errText.substring(0, 300)}`);
          throw new Error(`Gemini upload failed (${resp.status}): ${errText}`);
        }
        const data = await resp.json();
        DebugLogger.log(MODULE2, "_uploadFile resp", JSON.stringify(data).substring(0, 200));
        return { fileName: data.file.name, fileUri: data.file.uri };
      },
      // Polls the Gemini Files API until the uploaded file is ACTIVE (ready for generateContent).
      // Gemini needs time to process audio server-side before it can accept generateContent requests.
      // 2s interval: fast enough to not waste time, slow enough to avoid rate limits.
      // 90s timeout: covers even large files; typical processing is 5–20s.
      // Note: this endpoint (GET /files/{name}) does NOT count toward generateContent quota.
      async _waitForFile(fileName, apiKey, timeoutMs = 9e4) {
        DebugLogger.log(MODULE2, "_waitForFile", fileName);
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
          const url = `${BASE}/${fileName}?key=${apiKey}`;
          const resp = await fetch(url);
          if (!resp.ok) {
            DebugLogger.error(MODULE2, "_waitForFile poll error", resp.status);
            throw new Error(`File status poll failed (${resp.status})`);
          }
          const data = await resp.json();
          DebugLogger.log(MODULE2, "_waitForFile state", data.state);
          if (data.state === "ACTIVE") return;
          if (data.state === "FAILED") throw new Error("Gemini rejected the audio file (FAILED state).");
          await new Promise((r) => setTimeout(r, 2e3));
        }
        throw new Error("Timeout: Gemini took too long to process the audio file.");
      },
      async _transcribeSegment(fileUri, language, apiKey) {
        DebugLogger.log(MODULE2, "_transcribeSegment", fileUri.substring(0, 60));
        const langHint = language && language !== "auto" ? ` The audio language is ${language}.` : "";
        const prompt = `Transcribe this audio accurately.${langHint} Output only the transcription text. Do not add timestamps, speaker labels, or any commentary.`;
        const body = {
          contents: [{
            parts: [
              { text: prompt },
              { fileData: { mimeType: "audio/ogg", fileUri } }
            ]
          }],
          // temperature: 0 = fully deterministic; critical for transcription accuracy
          // (any randomness risks hallucinating words that weren't spoken)
          generationConfig: { temperature: 0 }
        };
        return this._generateContent(body, apiKey);
      },
      async _generateText(prompt, apiKey) {
        const body = {
          contents: [{ parts: [{ text: prompt }] }],
          // temperature: 0.3 = slight creativity for summarize/polish/translate/Q&A
          // (better than 0 for generative tasks, avoids being too robotic)
          generationConfig: { temperature: 0.3 }
        };
        return this._generateContent(body, apiKey);
      },
      async _generateContent(body, apiKey) {
        const url = `${BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
        DebugLogger.log(MODULE2, "_generateContent", url.replace(apiKey, "***KEY***"));
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!resp.ok) {
          const errText = await resp.text();
          DebugLogger.error(MODULE2, "_generateContent error", `${resp.status}: ${errText.substring(0, 300)}`);
          throw new Error(`Gemini API error (${resp.status}): ${errText}`);
        }
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          DebugLogger.error(MODULE2, "_generateContent empty", JSON.stringify(data).substring(0, 300));
          throw new Error("Gemini returned an empty response. Check your API key and quota.");
        }
        DebugLogger.log(MODULE2, "_generateContent OK", `${text.length} chars`);
        return text.trim();
      }
    };
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/definitions.js
var MaxAdContentRating;
var init_definitions2 = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/definitions.js"() {
    (function(MaxAdContentRating2) {
      MaxAdContentRating2["General"] = "General";
      MaxAdContentRating2["ParentalGuidance"] = "ParentalGuidance";
      MaxAdContentRating2["Teen"] = "Teen";
      MaxAdContentRating2["MatureAudience"] = "MatureAudience";
    })(MaxAdContentRating || (MaxAdContentRating = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-options.interface.js
var init_banner_ad_options_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-options.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-plugin-events.enum.js
var BannerAdPluginEvents;
var init_banner_ad_plugin_events_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-plugin-events.enum.js"() {
    (function(BannerAdPluginEvents2) {
      BannerAdPluginEvents2["SizeChanged"] = "bannerAdSizeChanged";
      BannerAdPluginEvents2["Loaded"] = "bannerAdLoaded";
      BannerAdPluginEvents2["FailedToLoad"] = "bannerAdFailedToLoad";
      BannerAdPluginEvents2["Opened"] = "bannerAdOpened";
      BannerAdPluginEvents2["Closed"] = "bannerAdClosed";
      BannerAdPluginEvents2["AdImpression"] = "bannerAdImpression";
    })(BannerAdPluginEvents || (BannerAdPluginEvents = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-position.enum.js
var BannerAdPosition;
var init_banner_ad_position_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-position.enum.js"() {
    (function(BannerAdPosition2) {
      BannerAdPosition2["TOP_CENTER"] = "TOP_CENTER";
      BannerAdPosition2["CENTER"] = "CENTER";
      BannerAdPosition2["BOTTOM_CENTER"] = "BOTTOM_CENTER";
    })(BannerAdPosition || (BannerAdPosition = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-size.enum.js
var BannerAdSize;
var init_banner_ad_size_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-ad-size.enum.js"() {
    (function(BannerAdSize2) {
      BannerAdSize2["BANNER"] = "BANNER";
      BannerAdSize2["FULL_BANNER"] = "FULL_BANNER";
      BannerAdSize2["LARGE_BANNER"] = "LARGE_BANNER";
      BannerAdSize2["MEDIUM_RECTANGLE"] = "MEDIUM_RECTANGLE";
      BannerAdSize2["LEADERBOARD"] = "LEADERBOARD";
      BannerAdSize2["ADAPTIVE_BANNER"] = "ADAPTIVE_BANNER";
      BannerAdSize2["SMART_BANNER"] = "SMART_BANNER";
    })(BannerAdSize || (BannerAdSize = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-definitions.interface.js
var init_banner_definitions_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-definitions.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-size.interface.js
var init_banner_size_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/banner-size.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/index.js
var init_banner = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/banner/index.js"() {
    init_banner_ad_options_interface();
    init_banner_ad_plugin_events_enum();
    init_banner_ad_position_enum();
    init_banner_ad_size_enum();
    init_banner_definitions_interface();
    init_banner_size_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/interstitial-ad-plugin-events.enum.js
var InterstitialAdPluginEvents;
var init_interstitial_ad_plugin_events_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/interstitial-ad-plugin-events.enum.js"() {
    (function(InterstitialAdPluginEvents2) {
      InterstitialAdPluginEvents2["Loaded"] = "interstitialAdLoaded";
      InterstitialAdPluginEvents2["FailedToLoad"] = "interstitialAdFailedToLoad";
      InterstitialAdPluginEvents2["Showed"] = "interstitialAdShowed";
      InterstitialAdPluginEvents2["FailedToShow"] = "interstitialAdFailedToShow";
      InterstitialAdPluginEvents2["Dismissed"] = "interstitialAdDismissed";
    })(InterstitialAdPluginEvents || (InterstitialAdPluginEvents = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/interstitial-definitions.interface.js
var init_interstitial_definitions_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/interstitial-definitions.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/index.js
var init_interstitial = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/interstitial/index.js"() {
    init_interstitial_ad_plugin_events_enum();
    init_interstitial_definitions_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-ad-plugin-events.enum.js
var RewardInterstitialAdPluginEvents;
var init_reward_interstitial_ad_plugin_events_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-ad-plugin-events.enum.js"() {
    (function(RewardInterstitialAdPluginEvents2) {
      RewardInterstitialAdPluginEvents2["Loaded"] = "onRewardedInterstitialAdLoaded";
      RewardInterstitialAdPluginEvents2["FailedToLoad"] = "onRewardedInterstitialAdFailedToLoad";
      RewardInterstitialAdPluginEvents2["Showed"] = "onRewardedInterstitialAdShowed";
      RewardInterstitialAdPluginEvents2["FailedToShow"] = "onRewardedInterstitialAdFailedToShow";
      RewardInterstitialAdPluginEvents2["Dismissed"] = "onRewardedInterstitialAdDismissed";
      RewardInterstitialAdPluginEvents2["Rewarded"] = "onRewardedInterstitialAdReward";
    })(RewardInterstitialAdPluginEvents || (RewardInterstitialAdPluginEvents = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-definitions.interface.js
var init_reward_interstitial_definitions_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-definitions.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-item.interface.js
var init_reward_interstitial_item_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-item.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-ad-options.interface.js
var init_reward_interstitial_ad_options_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/reward-interstitial-ad-options.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/index.js
var init_reward_interstitial = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward-interstitial/index.js"() {
    init_reward_interstitial_ad_plugin_events_enum();
    init_reward_interstitial_definitions_interface();
    init_reward_interstitial_item_interface();
    init_reward_interstitial_ad_options_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-plugin-events.enum.js
var RewardAdPluginEvents;
var init_reward_ad_plugin_events_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-plugin-events.enum.js"() {
    (function(RewardAdPluginEvents2) {
      RewardAdPluginEvents2["Loaded"] = "onRewardedVideoAdLoaded";
      RewardAdPluginEvents2["FailedToLoad"] = "onRewardedVideoAdFailedToLoad";
      RewardAdPluginEvents2["Showed"] = "onRewardedVideoAdShowed";
      RewardAdPluginEvents2["FailedToShow"] = "onRewardedVideoAdFailedToShow";
      RewardAdPluginEvents2["Dismissed"] = "onRewardedVideoAdDismissed";
      RewardAdPluginEvents2["Rewarded"] = "onRewardedVideoAdReward";
    })(RewardAdPluginEvents || (RewardAdPluginEvents = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-definitions.interface.js
var init_reward_definitions_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-definitions.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-item.interface.js
var init_reward_item_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-item.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-options.interface.js
var init_reward_ad_options_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-options.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/index.js
var init_reward = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/reward/index.js"() {
    init_reward_ad_plugin_events_enum();
    init_reward_definitions_interface();
    init_reward_item_interface();
    init_reward_ad_options_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-status.enum.js
var AdmobConsentStatus;
var init_consent_status_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-status.enum.js"() {
    (function(AdmobConsentStatus2) {
      AdmobConsentStatus2["NOT_REQUIRED"] = "NOT_REQUIRED";
      AdmobConsentStatus2["OBTAINED"] = "OBTAINED";
      AdmobConsentStatus2["REQUIRED"] = "REQUIRED";
      AdmobConsentStatus2["UNKNOWN"] = "UNKNOWN";
    })(AdmobConsentStatus || (AdmobConsentStatus = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-debug-geography.enum.js
var AdmobConsentDebugGeography;
var init_consent_debug_geography_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-debug-geography.enum.js"() {
    (function(AdmobConsentDebugGeography2) {
      AdmobConsentDebugGeography2[AdmobConsentDebugGeography2["DISABLED"] = 0] = "DISABLED";
      AdmobConsentDebugGeography2[AdmobConsentDebugGeography2["EEA"] = 1] = "EEA";
      AdmobConsentDebugGeography2[AdmobConsentDebugGeography2["NOT_EEA"] = 2] = "NOT_EEA";
      AdmobConsentDebugGeography2[AdmobConsentDebugGeography2["US"] = 3] = "US";
      AdmobConsentDebugGeography2[AdmobConsentDebugGeography2["OTHER"] = 4] = "OTHER";
    })(AdmobConsentDebugGeography || (AdmobConsentDebugGeography = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-request-options.interface.js
var init_consent_request_options_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-request-options.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-info.interface.js
var init_consent_info_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-info.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-definition.interface.js
var init_consent_definition_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/consent-definition.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/index.js
var init_consent = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/index.js"() {
    init_consent_status_enum();
    init_consent_debug_geography_enum();
    init_consent_request_options_interface();
    init_consent_info_interface();
    init_consent_definition_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/ad-load-info.interface.js
var init_ad_load_info_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/ad-load-info.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/ad-options.interface.js
var init_ad_options_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/ad-options.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/admob-error.interface.js
var init_admob_error_interface = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/admob-error.interface.js"() {
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/index.js
var init_shared = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/shared/index.js"() {
    init_ad_load_info_interface();
    init_ad_options_interface();
    init_admob_error_interface();
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/privacy-options-requirement-status.enum.js
var PrivacyOptionsRequirementStatus;
var init_privacy_options_requirement_status_enum = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/consent/privacy-options-requirement-status.enum.js"() {
    (function(PrivacyOptionsRequirementStatus2) {
      PrivacyOptionsRequirementStatus2["NOT_REQUIRED"] = "NOT_REQUIRED";
      PrivacyOptionsRequirementStatus2["REQUIRED"] = "REQUIRED";
      PrivacyOptionsRequirementStatus2["UNKNOWN"] = "UNKNOWN";
    })(PrivacyOptionsRequirementStatus || (PrivacyOptionsRequirementStatus = {}));
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/web.js
var web_exports2 = {};
__export(web_exports2, {
  AdMobWeb: () => AdMobWeb
});
var AdMobWeb;
var init_web2 = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/web.js"() {
    init_dist();
    init_consent_status_enum();
    init_privacy_options_requirement_status_enum();
    AdMobWeb = class extends WebPlugin {
      async initialize() {
        console.log("initialize");
      }
      async requestTrackingAuthorization() {
        console.log("requestTrackingAuthorization");
      }
      async trackingAuthorizationStatus() {
        return {
          status: "authorized"
        };
      }
      async requestConsentInfo(options) {
        console.log("requestConsentInfo", options);
        return {
          status: AdmobConsentStatus.REQUIRED,
          isConsentFormAvailable: true,
          canRequestAds: true,
          privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
        };
      }
      async showPrivacyOptionsForm() {
        console.log("showPrivacyOptionsForm");
      }
      async showConsentForm() {
        console.log("showConsentForm");
        return {
          status: AdmobConsentStatus.REQUIRED,
          canRequestAds: true,
          privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus.REQUIRED
        };
      }
      async resetConsentInfo() {
        console.log("resetConsentInfo");
      }
      async setApplicationMuted(options) {
        console.log("setApplicationMuted", options);
      }
      async setApplicationVolume(options) {
        console.log("setApplicationVolume", options);
      }
      async showBanner(options) {
        console.log("showBanner", options);
      }
      // Hide the banner, remove it from screen, but can show it later
      async hideBanner() {
        console.log("hideBanner");
      }
      // Resume the banner, show it after hide
      async resumeBanner() {
        console.log("resumeBanner");
      }
      // Destroy the banner, remove it from screen.
      async removeBanner() {
        console.log("removeBanner");
      }
      async prepareInterstitial(options) {
        console.log("prepareInterstitial", options);
        return {
          adUnitId: options.adId
        };
      }
      async showInterstitial() {
        console.log("showInterstitial");
      }
      async prepareRewardVideoAd(options) {
        console.log(options);
        return {
          adUnitId: options.adId
        };
      }
      async showRewardVideoAd() {
        return {
          type: "",
          amount: 0
        };
      }
      async prepareRewardInterstitialAd(options) {
        console.log(options);
        return {
          adUnitId: options.adId
        };
      }
      async showRewardInterstitialAd() {
        return {
          type: "",
          amount: 0
        };
      }
    };
  }
});

// node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/index.js
var AdMob;
var init_esm4 = __esm({
  "node_modules/.pnpm/@capacitor-community+admob@8.0.0/node_modules/@capacitor-community/admob/dist/esm/index.js"() {
    init_dist();
    init_definitions2();
    init_banner();
    init_interstitial();
    init_reward_interstitial();
    init_reward();
    init_consent();
    init_shared();
    AdMob = registerPlugin("AdMob", {
      web: () => Promise.resolve().then(() => (init_web2(), web_exports2)).then((m) => new m.AdMobWeb())
    });
  }
});

// js/admob_service.js
var MODULE3, AdMobService;
var init_admob_service = __esm({
  "js/admob_service.js"() {
    init_esm4();
    init_debug_logger();
    init_config();
    MODULE3 = "AdMob";
    AdMobService = {
      /** Initialize AdMob. Call once at app startup. */
      async initialize() {
        DebugLogger.log(MODULE3, "initialize");
        try {
          await AdMob.initialize({
            // Request iOS ATT (App Tracking Transparency) prompt
            requestTrackingAuthorization: true,
            // In debug mode, use test ads
            testingDevices: AppConfig.DEBUG_MODE ? ["EMULATOR"] : [],
            initializeForTesting: AppConfig.DEBUG_MODE
          });
          DebugLogger.log(MODULE3, "initialize OK");
        } catch (err) {
          DebugLogger.warn(MODULE3, "initialize failed (non-fatal)", err.message);
        }
      },
      /**
       * Pre-load an interstitial ad. Call this while the user is reading transcription results,
       * so the ad is ready by the time we want to show it.
       */
      async prepareInterstitial() {
        DebugLogger.log(MODULE3, "prepareInterstitial");
        try {
          const adId = AppConfig.ADMOB_AD_UNIT_IOS;
          DebugLogger.log(MODULE3, "prepareInterstitial adId", adId);
          await AdMob.prepareInterstitial({ adId });
          DebugLogger.log(MODULE3, "prepareInterstitial OK");
          return true;
        } catch (err) {
          DebugLogger.warn(MODULE3, "prepareInterstitial failed (non-fatal)", err.message);
          return false;
        }
      },
      /** Show the pre-loaded interstitial. Non-fatal if ad is not ready. */
      async showInterstitial() {
        DebugLogger.log(MODULE3, "showInterstitial");
        try {
          await AdMob.showInterstitial();
          DebugLogger.log(MODULE3, "showInterstitial OK");
        } catch (err) {
          DebugLogger.warn(MODULE3, "showInterstitial failed (non-fatal)", err.message);
        }
      }
    };
  }
});

// node_modules/.pnpm/@capacitor+synapse@1.0.4/node_modules/@capacitor/synapse/dist/synapse.mjs
function s(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return new Proxy({}, {
          get(w, o) {
            return (c, p, r) => {
              const i = t.Capacitor.Plugins[n];
              if (i === void 0) {
                r(new Error(`Capacitor plugin ${n} not found`));
                return;
              }
              if (typeof i[o] != "function") {
                r(new Error(`Method ${o} not found in Capacitor plugin ${n}`));
                return;
              }
              (async () => {
                try {
                  const a = await i[o](c);
                  p(a);
                } catch (a) {
                  r(a);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function u(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return t.cordova.plugins[n];
      }
    }
  );
}
function f(t = false) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? s(window) : window.cordova !== void 0 && u(window));
}
var init_synapse = __esm({
  "node_modules/.pnpm/@capacitor+synapse@1.0.4/node_modules/@capacitor/synapse/dist/synapse.mjs"() {
  }
});

// node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/definitions.js
var Directory, Encoding;
var init_definitions3 = __esm({
  "node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/definitions.js"() {
    (function(Directory2) {
      Directory2["Documents"] = "DOCUMENTS";
      Directory2["Data"] = "DATA";
      Directory2["Library"] = "LIBRARY";
      Directory2["Cache"] = "CACHE";
      Directory2["External"] = "EXTERNAL";
      Directory2["ExternalStorage"] = "EXTERNAL_STORAGE";
      Directory2["ExternalCache"] = "EXTERNAL_CACHE";
      Directory2["LibraryNoCloud"] = "LIBRARY_NO_CLOUD";
      Directory2["Temporary"] = "TEMPORARY";
    })(Directory || (Directory = {}));
    (function(Encoding2) {
      Encoding2["UTF8"] = "utf8";
      Encoding2["ASCII"] = "ascii";
      Encoding2["UTF16"] = "utf16";
    })(Encoding || (Encoding = {}));
  }
});

// node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/web.js
var web_exports3 = {};
__export(web_exports3, {
  FilesystemWeb: () => FilesystemWeb
});
function resolve(path) {
  const posix = path.split("/").filter((item) => item !== ".");
  const newPosix = [];
  posix.forEach((item) => {
    if (item === ".." && newPosix.length > 0 && newPosix[newPosix.length - 1] !== "..") {
      newPosix.pop();
    } else {
      newPosix.push(item);
    }
  });
  return newPosix.join("/");
}
function isPathParent(parent, children) {
  parent = resolve(parent);
  children = resolve(children);
  const pathsA = parent.split("/");
  const pathsB = children.split("/");
  return parent !== children && pathsA.every((value, index) => value === pathsB[index]);
}
var FilesystemWeb;
var init_web3 = __esm({
  "node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/web.js"() {
    init_dist();
    init_definitions3();
    FilesystemWeb = class _FilesystemWeb extends WebPlugin {
      constructor() {
        super(...arguments);
        this.DB_VERSION = 1;
        this.DB_NAME = "Disc";
        this._writeCmds = ["add", "put", "delete"];
        this.downloadFile = async (options) => {
          var _a, _b;
          const requestInit = buildRequestInit(options, options.webFetchExtra);
          const response = await fetch(options.url, requestInit);
          let blob;
          if (!options.progress)
            blob = await response.blob();
          else if (!(response === null || response === void 0 ? void 0 : response.body))
            blob = new Blob();
          else {
            const reader = response.body.getReader();
            let bytes = 0;
            const chunks = [];
            const contentType = response.headers.get("content-type");
            const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
            while (true) {
              const { done, value } = await reader.read();
              if (done)
                break;
              chunks.push(value);
              bytes += (value === null || value === void 0 ? void 0 : value.length) || 0;
              const status = {
                url: options.url,
                bytes,
                contentLength
              };
              this.notifyListeners("progress", status);
            }
            const allChunks = new Uint8Array(bytes);
            let position = 0;
            for (const chunk of chunks) {
              if (typeof chunk === "undefined")
                continue;
              allChunks.set(chunk, position);
              position += chunk.length;
            }
            blob = new Blob([allChunks.buffer], { type: contentType || void 0 });
          }
          const result = await this.writeFile({
            path: options.path,
            directory: (_a = options.directory) !== null && _a !== void 0 ? _a : void 0,
            recursive: (_b = options.recursive) !== null && _b !== void 0 ? _b : false,
            data: blob
          });
          return { path: result.uri, blob };
        };
      }
      readFileInChunks(_options, _callback) {
        throw this.unavailable("Method not implemented.");
      }
      async initDb() {
        if (this._db !== void 0) {
          return this._db;
        }
        if (!("indexedDB" in window)) {
          throw this.unavailable("This browser doesn't support IndexedDB");
        }
        return new Promise((resolve2, reject) => {
          const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
          request.onupgradeneeded = _FilesystemWeb.doUpgrade;
          request.onsuccess = () => {
            this._db = request.result;
            resolve2(request.result);
          };
          request.onerror = () => reject(request.error);
          request.onblocked = () => {
            console.warn("db blocked");
          };
        });
      }
      static doUpgrade(event) {
        const eventTarget = event.target;
        const db = eventTarget.result;
        switch (event.oldVersion) {
          case 0:
          case 1:
          default: {
            if (db.objectStoreNames.contains("FileStorage")) {
              db.deleteObjectStore("FileStorage");
            }
            const store = db.createObjectStore("FileStorage", { keyPath: "path" });
            store.createIndex("by_folder", "folder");
          }
        }
      }
      async dbRequest(cmd, args) {
        const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? "readwrite" : "readonly";
        return this.initDb().then((conn) => {
          return new Promise((resolve2, reject) => {
            const tx = conn.transaction(["FileStorage"], readFlag);
            const store = tx.objectStore("FileStorage");
            const req = store[cmd](...args);
            req.onsuccess = () => resolve2(req.result);
            req.onerror = () => reject(req.error);
          });
        });
      }
      async dbIndexRequest(indexName, cmd, args) {
        const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? "readwrite" : "readonly";
        return this.initDb().then((conn) => {
          return new Promise((resolve2, reject) => {
            const tx = conn.transaction(["FileStorage"], readFlag);
            const store = tx.objectStore("FileStorage");
            const index = store.index(indexName);
            const req = index[cmd](...args);
            req.onsuccess = () => resolve2(req.result);
            req.onerror = () => reject(req.error);
          });
        });
      }
      getPath(directory, uriPath) {
        const cleanedUriPath = uriPath !== void 0 ? uriPath.replace(/^[/]+|[/]+$/g, "") : "";
        let fsPath = "";
        if (directory !== void 0)
          fsPath += "/" + directory;
        if (uriPath !== "")
          fsPath += "/" + cleanedUriPath;
        return fsPath;
      }
      async clear() {
        const conn = await this.initDb();
        const tx = conn.transaction(["FileStorage"], "readwrite");
        const store = tx.objectStore("FileStorage");
        store.clear();
      }
      /**
       * Read a file from disk
       * @param options options for the file read
       * @return a promise that resolves with the read file data result
       */
      async readFile(options) {
        const path = this.getPath(options.directory, options.path);
        const entry = await this.dbRequest("get", [path]);
        if (entry === void 0)
          throw Error("File does not exist.");
        return { data: entry.content ? entry.content : "" };
      }
      /**
       * Write a file to disk in the specified location on device
       * @param options options for the file write
       * @return a promise that resolves with the file write result
       */
      async writeFile(options) {
        const path = this.getPath(options.directory, options.path);
        let data = options.data;
        const encoding = options.encoding;
        const doRecursive = options.recursive;
        const occupiedEntry = await this.dbRequest("get", [path]);
        if (occupiedEntry && occupiedEntry.type === "directory")
          throw Error("The supplied path is a directory.");
        const parentPath = path.substr(0, path.lastIndexOf("/"));
        const parentEntry = await this.dbRequest("get", [parentPath]);
        if (parentEntry === void 0) {
          const subDirIndex = parentPath.indexOf("/", 1);
          if (subDirIndex !== -1) {
            const parentArgPath = parentPath.substr(subDirIndex);
            await this.mkdir({
              path: parentArgPath,
              directory: options.directory,
              recursive: doRecursive
            });
          }
        }
        if (!encoding && !(data instanceof Blob)) {
          data = data.indexOf(",") >= 0 ? data.split(",")[1] : data;
          if (!this.isBase64String(data))
            throw Error("The supplied data is not valid base64 content.");
        }
        const now = Date.now();
        const pathObj = {
          path,
          folder: parentPath,
          type: "file",
          size: data instanceof Blob ? data.size : data.length,
          ctime: now,
          mtime: now,
          content: data
        };
        await this.dbRequest("put", [pathObj]);
        return {
          uri: pathObj.path
        };
      }
      /**
       * Append to a file on disk in the specified location on device
       * @param options options for the file append
       * @return a promise that resolves with the file write result
       */
      async appendFile(options) {
        const path = this.getPath(options.directory, options.path);
        let data = options.data;
        const encoding = options.encoding;
        const parentPath = path.substr(0, path.lastIndexOf("/"));
        const now = Date.now();
        let ctime = now;
        const occupiedEntry = await this.dbRequest("get", [path]);
        if (occupiedEntry && occupiedEntry.type === "directory")
          throw Error("The supplied path is a directory.");
        const parentEntry = await this.dbRequest("get", [parentPath]);
        if (parentEntry === void 0) {
          const subDirIndex = parentPath.indexOf("/", 1);
          if (subDirIndex !== -1) {
            const parentArgPath = parentPath.substr(subDirIndex);
            await this.mkdir({
              path: parentArgPath,
              directory: options.directory,
              recursive: true
            });
          }
        }
        if (!encoding && !this.isBase64String(data))
          throw Error("The supplied data is not valid base64 content.");
        if (occupiedEntry !== void 0) {
          if (occupiedEntry.content instanceof Blob) {
            throw Error("The occupied entry contains a Blob object which cannot be appended to.");
          }
          if (occupiedEntry.content !== void 0 && !encoding) {
            data = btoa(atob(occupiedEntry.content) + atob(data));
          } else {
            data = occupiedEntry.content + data;
          }
          ctime = occupiedEntry.ctime;
        }
        const pathObj = {
          path,
          folder: parentPath,
          type: "file",
          size: data.length,
          ctime,
          mtime: now,
          content: data
        };
        await this.dbRequest("put", [pathObj]);
      }
      /**
       * Delete a file from disk
       * @param options options for the file delete
       * @return a promise that resolves with the deleted file data result
       */
      async deleteFile(options) {
        const path = this.getPath(options.directory, options.path);
        const entry = await this.dbRequest("get", [path]);
        if (entry === void 0)
          throw Error("File does not exist.");
        const entries = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(path)]);
        if (entries.length !== 0)
          throw Error("Folder is not empty.");
        await this.dbRequest("delete", [path]);
      }
      /**
       * Create a directory.
       * @param options options for the mkdir
       * @return a promise that resolves with the mkdir result
       */
      async mkdir(options) {
        const path = this.getPath(options.directory, options.path);
        const doRecursive = options.recursive;
        const parentPath = path.substr(0, path.lastIndexOf("/"));
        const depth = (path.match(/\//g) || []).length;
        const parentEntry = await this.dbRequest("get", [parentPath]);
        const occupiedEntry = await this.dbRequest("get", [path]);
        if (depth === 1)
          throw Error("Cannot create Root directory");
        if (occupiedEntry !== void 0)
          throw Error("Current directory does already exist.");
        if (!doRecursive && depth !== 2 && parentEntry === void 0)
          throw Error("Parent directory must exist");
        if (doRecursive && depth !== 2 && parentEntry === void 0) {
          const parentArgPath = parentPath.substr(parentPath.indexOf("/", 1));
          await this.mkdir({
            path: parentArgPath,
            directory: options.directory,
            recursive: doRecursive
          });
        }
        const now = Date.now();
        const pathObj = {
          path,
          folder: parentPath,
          type: "directory",
          size: 0,
          ctime: now,
          mtime: now
        };
        await this.dbRequest("put", [pathObj]);
      }
      /**
       * Remove a directory
       * @param options the options for the directory remove
       */
      async rmdir(options) {
        const { path, directory, recursive } = options;
        const fullPath = this.getPath(directory, path);
        const entry = await this.dbRequest("get", [fullPath]);
        if (entry === void 0)
          throw Error("Folder does not exist.");
        if (entry.type !== "directory")
          throw Error("Requested path is not a directory");
        const readDirResult = await this.readdir({ path, directory });
        if (readDirResult.files.length !== 0 && !recursive)
          throw Error("Folder is not empty");
        for (const entry2 of readDirResult.files) {
          const entryPath = `${path}/${entry2.name}`;
          const entryObj = await this.stat({ path: entryPath, directory });
          if (entryObj.type === "file") {
            await this.deleteFile({ path: entryPath, directory });
          } else {
            await this.rmdir({ path: entryPath, directory, recursive });
          }
        }
        await this.dbRequest("delete", [fullPath]);
      }
      /**
       * Return a list of files from the directory (not recursive)
       * @param options the options for the readdir operation
       * @return a promise that resolves with the readdir directory listing result
       */
      async readdir(options) {
        const path = this.getPath(options.directory, options.path);
        const entry = await this.dbRequest("get", [path]);
        if (options.path !== "" && entry === void 0)
          throw Error("Folder does not exist.");
        const entries = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(path)]);
        const files = await Promise.all(entries.map(async (e) => {
          let subEntry = await this.dbRequest("get", [e]);
          if (subEntry === void 0) {
            subEntry = await this.dbRequest("get", [e + "/"]);
          }
          return {
            name: e.substring(path.length + 1),
            type: subEntry.type,
            size: subEntry.size,
            ctime: subEntry.ctime,
            mtime: subEntry.mtime,
            uri: subEntry.path
          };
        }));
        return { files };
      }
      /**
       * Return full File URI for a path and directory
       * @param options the options for the stat operation
       * @return a promise that resolves with the file stat result
       */
      async getUri(options) {
        const path = this.getPath(options.directory, options.path);
        let entry = await this.dbRequest("get", [path]);
        if (entry === void 0) {
          entry = await this.dbRequest("get", [path + "/"]);
        }
        return {
          uri: (entry === null || entry === void 0 ? void 0 : entry.path) || path
        };
      }
      /**
       * Return data about a file
       * @param options the options for the stat operation
       * @return a promise that resolves with the file stat result
       */
      async stat(options) {
        const path = this.getPath(options.directory, options.path);
        let entry = await this.dbRequest("get", [path]);
        if (entry === void 0) {
          entry = await this.dbRequest("get", [path + "/"]);
        }
        if (entry === void 0)
          throw Error("Entry does not exist.");
        return {
          name: entry.path.substring(path.length + 1),
          type: entry.type,
          size: entry.size,
          ctime: entry.ctime,
          mtime: entry.mtime,
          uri: entry.path
        };
      }
      /**
       * Rename a file or directory
       * @param options the options for the rename operation
       * @return a promise that resolves with the rename result
       */
      async rename(options) {
        await this._copy(options, true);
        return;
      }
      /**
       * Copy a file or directory
       * @param options the options for the copy operation
       * @return a promise that resolves with the copy result
       */
      async copy(options) {
        return this._copy(options, false);
      }
      async requestPermissions() {
        return { publicStorage: "granted" };
      }
      async checkPermissions() {
        return { publicStorage: "granted" };
      }
      /**
       * Function that can perform a copy or a rename
       * @param options the options for the rename operation
       * @param doRename whether to perform a rename or copy operation
       * @return a promise that resolves with the result
       */
      async _copy(options, doRename = false) {
        let { toDirectory } = options;
        const { to, from, directory: fromDirectory } = options;
        if (!to || !from) {
          throw Error("Both to and from must be provided");
        }
        if (!toDirectory) {
          toDirectory = fromDirectory;
        }
        const fromPath = this.getPath(fromDirectory, from);
        const toPath = this.getPath(toDirectory, to);
        if (fromPath === toPath) {
          return {
            uri: toPath
          };
        }
        if (isPathParent(fromPath, toPath)) {
          throw Error("To path cannot contain the from path");
        }
        let toObj;
        try {
          toObj = await this.stat({
            path: to,
            directory: toDirectory
          });
        } catch (e) {
          const toPathComponents = to.split("/");
          toPathComponents.pop();
          const toPath2 = toPathComponents.join("/");
          if (toPathComponents.length > 0) {
            const toParentDirectory = await this.stat({
              path: toPath2,
              directory: toDirectory
            });
            if (toParentDirectory.type !== "directory") {
              throw new Error("Parent directory of the to path is a file");
            }
          }
        }
        if (toObj && toObj.type === "directory") {
          throw new Error("Cannot overwrite a directory with a file");
        }
        const fromObj = await this.stat({
          path: from,
          directory: fromDirectory
        });
        const updateTime = async (path, ctime2, mtime) => {
          const fullPath = this.getPath(toDirectory, path);
          const entry = await this.dbRequest("get", [fullPath]);
          entry.ctime = ctime2;
          entry.mtime = mtime;
          await this.dbRequest("put", [entry]);
        };
        const ctime = fromObj.ctime ? fromObj.ctime : Date.now();
        switch (fromObj.type) {
          // The "from" object is a file
          case "file": {
            const file = await this.readFile({
              path: from,
              directory: fromDirectory
            });
            if (doRename) {
              await this.deleteFile({
                path: from,
                directory: fromDirectory
              });
            }
            let encoding;
            if (!(file.data instanceof Blob) && !this.isBase64String(file.data)) {
              encoding = Encoding.UTF8;
            }
            const writeResult = await this.writeFile({
              path: to,
              directory: toDirectory,
              data: file.data,
              encoding
            });
            if (doRename) {
              await updateTime(to, ctime, fromObj.mtime);
            }
            return writeResult;
          }
          case "directory": {
            if (toObj) {
              throw Error("Cannot move a directory over an existing object");
            }
            try {
              await this.mkdir({
                path: to,
                directory: toDirectory,
                recursive: false
              });
              if (doRename) {
                await updateTime(to, ctime, fromObj.mtime);
              }
            } catch (e) {
            }
            const contents = (await this.readdir({
              path: from,
              directory: fromDirectory
            })).files;
            for (const filename of contents) {
              await this._copy({
                from: `${from}/${filename.name}`,
                to: `${to}/${filename.name}`,
                directory: fromDirectory,
                toDirectory
              }, doRename);
            }
            if (doRename) {
              await this.rmdir({
                path: from,
                directory: fromDirectory
              });
            }
          }
        }
        return {
          uri: toPath
        };
      }
      isBase64String(str) {
        try {
          return btoa(atob(str)) == str;
        } catch (err) {
          return false;
        }
      }
    };
    FilesystemWeb._debug = true;
  }
});

// node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/index.js
var Filesystem;
var init_esm5 = __esm({
  "node_modules/.pnpm/@capacitor+filesystem@8.1.2_@capacitor+core@8.2.0/node_modules/@capacitor/filesystem/dist/esm/index.js"() {
    init_dist();
    init_synapse();
    init_definitions3();
    Filesystem = registerPlugin("Filesystem", {
      web: () => Promise.resolve().then(() => (init_web3(), web_exports3)).then((m) => new m.FilesystemWeb())
    });
    f();
  }
});

// js/history_service.js
async function _write(path, data) {
  await Filesystem.writeFile({ path, data, directory: Directory.Documents, encoding: Encoding.UTF8, recursive: true });
}
async function _read(path) {
  const result = await Filesystem.readFile({ path, directory: Directory.Documents, encoding: Encoding.UTF8 });
  return result.data;
}
async function _readOptional(path) {
  try {
    return await _read(path);
  } catch {
    return null;
  }
}
function _isNotFound(err) {
  const msg = err?.message?.toLowerCase() || "";
  return msg.includes("does not exist") || msg.includes("not found") || msg.includes("no such");
}
var MODULE4, BASE_DIR, HistoryService;
var init_history_service = __esm({
  "js/history_service.js"() {
    init_esm5();
    init_debug_logger();
    MODULE4 = "History";
    BASE_DIR = "SnapTranscript/transcripts";
    HistoryService = {
      /**
       * Save a new transcript entry.
       * @param {object} data - { audioFileName, durationSec, language, targetLanguage, original, translated }
       * @returns {string} id
       */
      async save(data) {
        const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const dir = `${BASE_DIR}/${id}`;
        DebugLogger.log(MODULE4, "save", id);
        const originalBytes = new Blob([data.original || ""]).size;
        const translatedBytes = new Blob([data.translated || ""]).size;
        const meta = {
          id,
          audioFileName: data.audioFileName || "recording",
          durationSec: data.durationSec || 0,
          language: data.language || "auto",
          hasTranslation: !!data.translated,
          targetLanguage: data.targetLanguage || null,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          originalLength: (data.original || "").length,
          storageSizeBytes: originalBytes + translatedBytes
        };
        try {
          await _write(`${dir}/meta.json`, JSON.stringify(meta));
          await _write(`${dir}/original.txt`, data.original || "");
          if (data.translated) {
            await _write(`${dir}/translated.txt`, data.translated);
          }
          DebugLogger.log(MODULE4, "save OK", id);
          return id;
        } catch (err) {
          DebugLogger.error(MODULE4, "save FAILED", err.message);
          throw err;
        }
      },
      /**
       * List all saved transcripts (metadata only), newest first.
       * @returns {object[]}
       */
      async list() {
        DebugLogger.log(MODULE4, "list");
        try {
          const result = await Filesystem.readdir({ path: BASE_DIR, directory: Directory.Documents });
          const items = [];
          for (const entry of result.files) {
            try {
              const raw = await Filesystem.readFile({
                path: `${BASE_DIR}/${entry.name}/meta.json`,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
              });
              items.push(JSON.parse(raw.data));
            } catch (e) {
              DebugLogger.warn(MODULE4, "list: skip bad entry", entry.name);
            }
          }
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          DebugLogger.log(MODULE4, "list OK", `${items.length} items`);
          return items;
        } catch (err) {
          if (_isNotFound(err)) {
            DebugLogger.log(MODULE4, "list: no history directory yet");
            return [];
          }
          DebugLogger.error(MODULE4, "list FAILED", err.message);
          throw err;
        }
      },
      /**
       * Load a full transcript record by id.
       * @returns {object} meta + original + translated? + summary?
       */
      async load(id) {
        DebugLogger.log(MODULE4, "load", id);
        const dir = `${BASE_DIR}/${id}`;
        try {
          const [metaRaw, origRaw] = await Promise.all([
            _read(`${dir}/meta.json`),
            _read(`${dir}/original.txt`)
          ]);
          const meta = JSON.parse(metaRaw);
          const original = origRaw;
          const translated = meta.hasTranslation ? await _readOptional(`${dir}/translated.txt`) : null;
          const summary = await _readOptional(`${dir}/summary.txt`);
          const qaRaw = await _readOptional(`${dir}/qa.txt`);
          const qa = qaRaw ? JSON.parse(qaRaw) : null;
          DebugLogger.log(MODULE4, "load OK", id);
          return { ...meta, original, translated, summary, qa };
        } catch (err) {
          DebugLogger.error(MODULE4, "load FAILED", `${id}: ${err.message}`);
          throw err;
        }
      },
      /**
       * Save an extra generated file for an existing entry.
       * @param {string} id
       * @param {string} type - 'summary' | 'qa'
       * @param {string} content
       * @param {number} previousBytes - pass previous saved size for overwrite types (e.g. qa)
       */
      async saveExtra(id, type, content, previousBytes = 0) {
        DebugLogger.log(MODULE4, "saveExtra", `${id}/${type}`);
        await _write(`${BASE_DIR}/${id}/${type}.txt`, content);
        try {
          const metaRaw = await _read(`${BASE_DIR}/${id}/meta.json`);
          const meta = JSON.parse(metaRaw);
          const newBytes = new Blob([content]).size;
          meta.storageSizeBytes = (meta.storageSizeBytes || 0) - previousBytes + newBytes;
          await _write(`${BASE_DIR}/${id}/meta.json`, JSON.stringify(meta));
        } catch (err) {
          DebugLogger.warn(MODULE4, "saveExtra: failed to update size", err.message);
        }
        DebugLogger.log(MODULE4, "saveExtra OK");
      },
      /** Update the display name for an existing transcript. */
      async updateFileName(id, newName) {
        DebugLogger.log(MODULE4, "updateFileName", `${id} \u2192 ${newName}`);
        const dir = `${BASE_DIR}/${id}`;
        const metaRaw = await _read(`${dir}/meta.json`);
        const meta = JSON.parse(metaRaw);
        meta.audioFileName = newName;
        await _write(`${dir}/meta.json`, JSON.stringify(meta));
        DebugLogger.log(MODULE4, "updateFileName OK");
      },
      /** Delete a transcript and all its files. */
      async delete(id) {
        DebugLogger.log(MODULE4, "delete", id);
        const dir = `${BASE_DIR}/${id}`;
        const files = ["meta.json", "original.txt", "translated.txt", "summary.txt", "qa.txt"];
        for (const f2 of files) {
          await Filesystem.deleteFile({ path: `${dir}/${f2}`, directory: Directory.Documents }).catch(() => {
          });
        }
        await Filesystem.rmdir({ path: dir, directory: Directory.Documents, recursive: true }).catch(() => {
        });
        DebugLogger.log(MODULE4, "delete OK", id);
      }
    };
  }
});

// js/recorder_service.js
function _getSupportedMime() {
  for (const mime of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "";
}
var MODULE5, MIME_CANDIDATES, RecorderService;
var init_recorder_service = __esm({
  "js/recorder_service.js"() {
    init_debug_logger();
    MODULE5 = "Recorder";
    MIME_CANDIDATES = [
      "audio/webm;codecs=opus",
      // Chrome, Edge, Android
      "audio/webm",
      // Chrome fallback
      "audio/mp4",
      // Safari, iOS WKWebView
      "audio/ogg;codecs=opus"
      // Firefox
    ];
    RecorderService = {
      _mediaRecorder: null,
      _chunks: [],
      _stream: null,
      _startTime: 0,
      _tickInterval: null,
      /**
       * Request microphone and start recording.
       * @param {function} onTick - called every second with elapsed seconds (number)
       * @throws if microphone permission is denied
       */
      async start(onTick) {
        DebugLogger.log(MODULE5, "start \u2014 requesting mic");
        this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this._chunks = [];
        const mimeType = _getSupportedMime();
        DebugLogger.log(MODULE5, "mimeType", mimeType || "(browser default)");
        this._mediaRecorder = new MediaRecorder(
          this._stream,
          mimeType ? { mimeType } : {}
        );
        this._mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this._chunks.push(e.data);
        };
        this._mediaRecorder.start(100);
        this._startTime = Date.now();
        this._tickInterval = setInterval(() => {
          onTick?.(Math.floor((Date.now() - this._startTime) / 1e3));
        }, 1e3);
        DebugLogger.log(MODULE5, "recording started");
      },
      /**
       * Stop recording and return the audio Blob.
       * @returns {Promise<Blob>}
       */
      stop() {
        return new Promise((resolve2) => {
          clearInterval(this._tickInterval);
          this._mediaRecorder.onstop = () => {
            const blob = new Blob(this._chunks, { type: this._mediaRecorder.mimeType });
            DebugLogger.log(MODULE5, "stop OK", `${(blob.size / 1024).toFixed(1)}KB type=${blob.type}`);
            this._stream?.getTracks().forEach((t) => t.stop());
            resolve2(blob);
          };
          this._mediaRecorder.stop();
        });
      },
      /** Cancel recording without returning audio. */
      cancel() {
        DebugLogger.log(MODULE5, "cancel");
        clearInterval(this._tickInterval);
        try {
          this._mediaRecorder?.stop();
        } catch {
        }
        this._stream?.getTracks().forEach((t) => t.stop());
        this._chunks = [];
      },
      /** Whether the browser/device supports MediaRecorder at all. */
      isSupported() {
        return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
      }
    };
  }
});

// js/components/ModalComponent.js
var ModalComponent;
var init_ModalComponent = __esm({
  "js/components/ModalComponent.js"() {
    init_BaseComponent();
    ModalComponent = class extends BaseComponent {
      constructor(id) {
        super(id);
      }
      show() {
        if (this.element) {
          this.element.classList.remove("hidden");
          requestAnimationFrame(() => {
            this.element.classList.add("visible");
          });
        }
      }
      hide() {
        if (this.element) {
          this.element.classList.remove("visible");
          setTimeout(() => this.element.classList.add("hidden"), 200);
        }
      }
      /**
       * Common Post-Mount for Modals: Bind Close Buttons and Outside Click
       */
      postMount() {
        const closeBtns = this.element.querySelectorAll(".close-btn, .close-modal-btn");
        closeBtns.forEach((btn) => {
          btn.addEventListener("click", () => this.hide());
        });
        this.element.addEventListener("click", (e) => {
          if (e.target === this.element) this.hide();
        });
      }
    };
  }
});

// js/components/modals/ApiKeyModal.js
var ApiKeyModal;
var init_ApiKeyModal = __esm({
  "js/components/modals/ApiKeyModal.js"() {
    init_ModalComponent();
    init_api_key_service();
    ApiKeyModal = class extends ModalComponent {
      constructor() {
        super("api-key-modal");
      }
      render() {
        return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3 data-i18n="apikey.title">Gemini API Key</h3>
            <button class="close-btn" aria-label="Close">\u2715</button>
          </div>

          <div class="modal-body">

            <!-- Privacy notice -->
            <div class="apikey-privacy-notice">
              <span class="apikey-privacy-icon">\u{1F512}</span>
              <p data-i18n="apikey.privacy_notice">Your key is stored only on this device. SnapTranscript never sees it \u2014 the app calls Gemini directly from your phone.</p>
            </div>

            <!-- Status: shows when a key is already stored -->
            <div id="apikey-status-area"></div>

            <!-- Input group: shows when no key is stored -->
            <div class="form-group hidden" id="apikey-input-group">
              <label for="apikey-input" data-i18n="apikey.input_label">Paste your Gemini API Key</label>
              <div class="apikey-input-row">
                <input
                  type="password"
                  id="apikey-input"
                  placeholder="AIza..."
                  data-i18n="apikey.placeholder"
                  autocomplete="off"
                  spellcheck="false"
                />
                <button class="apikey-toggle-btn" id="apikey-toggle" aria-label="Show/hide key">\u{1F441}</button>
              </div>
              <p class="field-hint" data-i18n="apikey.hint">Get your free key at <strong>aistudio.google.com</strong> \u2192 Get API key</p>
              <p class="field-error hidden" id="apikey-error" data-i18n="apikey.error_format">Invalid format. Gemini keys start with "AIza" (39 characters).</p>
            </div>

          </div>

          <div class="modal-footer">
            <button class="secondary-btn close-modal-btn" data-i18n="app.cancel">Cancel</button>
            <button class="primary-btn hidden" id="apikey-save-btn" data-i18n="apikey.save">Save Key</button>
          </div>

        </div>
      </div>
    `);
      }
      show() {
        super.show();
        this._refreshStatus();
      }
      postMount() {
        super.postMount();
        this._bindEvents();
        this._refreshStatus();
      }
      // ---- Status refresh ----
      async _refreshStatus() {
        const statusArea = this.$("#apikey-status-area");
        const inputGroup = this.$("#apikey-input-group");
        const saveBtn = this.$("#apikey-save-btn");
        const inputLabel = inputGroup?.querySelector("label");
        const hasKey = await ApiKeyService.hasKey();
        if (hasKey) {
          statusArea.innerHTML = `
        <div class="apikey-set-badge">
          <span>\u2705 API Key is set</span>
          <button class="danger-btn" id="apikey-clear-btn" data-i18n="apikey.remove">Remove Key</button>
        </div>
      `;
          statusArea.querySelector("#apikey-clear-btn")?.addEventListener("click", () => this._clearKey());
          if (inputLabel) inputLabel.setAttribute("data-i18n", "apikey.replace_label");
          if (inputLabel) inputLabel.textContent = "Replace with a new key (optional)";
          inputGroup.classList.remove("hidden");
          saveBtn.classList.remove("hidden");
          saveBtn.setAttribute("data-i18n", "apikey.replace");
          saveBtn.textContent = "Replace Key";
        } else {
          statusArea.innerHTML = `<p class="apikey-not-set-hint" data-i18n="apikey.not_set">No API key set yet.</p>`;
          if (inputLabel) inputLabel.setAttribute("data-i18n", "apikey.input_label");
          if (inputLabel) inputLabel.textContent = "Paste your Gemini API Key";
          inputGroup.classList.remove("hidden");
          saveBtn.classList.remove("hidden");
          saveBtn.setAttribute("data-i18n", "apikey.save");
          saveBtn.textContent = "Save Key";
        }
        const input = this.$("#apikey-input");
        if (input) input.value = "";
        this.$("#apikey-error")?.classList.add("hidden");
      }
      // ---- Event binding ----
      _bindEvents() {
        this.$("#apikey-toggle")?.addEventListener("click", () => {
          const input = this.$("#apikey-input");
          input.type = input.type === "password" ? "text" : "password";
        });
        this.$("#apikey-input")?.addEventListener("input", (e) => {
          const val = e.target.value.trim();
          const errorEl = this.$("#apikey-error");
          if (val.length >= 4 && !ApiKeyService.isValidFormat(val)) {
            errorEl.classList.remove("hidden");
          } else {
            errorEl.classList.add("hidden");
          }
        });
        this.$("#apikey-save-btn")?.addEventListener("click", () => this._saveKey());
      }
      // ---- Actions ----
      async _saveKey() {
        const input = this.$("#apikey-input");
        const apiKey = input.value.trim();
        const hasKey = await ApiKeyService.hasKey();
        if (!apiKey && hasKey) {
          this.hide();
          return;
        }
        if (!ApiKeyService.isValidFormat(apiKey)) {
          this.$("#apikey-error").classList.remove("hidden");
          return;
        }
        await ApiKeyService.save(apiKey);
        input.value = "";
        await this._refreshStatus();
        window.dispatchEvent(new CustomEvent("apiKeySet"));
        this.hide();
      }
      async _clearKey() {
        await ApiKeyService.delete();
        await this._refreshStatus();
        window.dispatchEvent(new CustomEvent("apiKeyCleared"));
      }
    };
  }
});

// js/components/modals/SettingsModal.js
var MODULE6, SettingsModal;
var init_SettingsModal = __esm({
  "js/components/modals/SettingsModal.js"() {
    init_ModalComponent();
    init_debug_logger();
    init_api_key_service();
    init_config();
    init_esm();
    MODULE6 = "SettingsModal";
    SettingsModal = class extends ModalComponent {
      /**
       * @param {object} opts
       * @param {function} opts.onApiKey    - callback to open ApiKeyModal
       * @param {function} opts.onLangChange - callback(langCode) when UI language changes
       */
      constructor({ onApiKey, onLangChange } = {}) {
        super("settings-modal");
        this._onApiKey = onApiKey;
        this._onLangChange = onLangChange;
      }
      render() {
        return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3 data-i18n="settings.title">Settings</h3>
            <button class="close-btn">\u2715</button>
          </div>

          <div class="modal-body" style="padding: 0;">

            <!-- App UI Language -->
            <div class="settings-section">
              <div class="settings-section-title" data-i18n="settings.display_language">Display Language</div>
              <div class="settings-row">
                <div class="settings-row-label" data-i18n="settings.app_language">App Language</div>
                <select class="setting-select" id="settings-ui-lang"></select>
              </div>
            </div>

            <!-- API Key -->
            <div class="settings-section">
              <div class="settings-section-title" data-i18n="settings.gemini_api">Gemini API</div>
              <div class="settings-row">
                <div>
                  <div class="settings-row-label" data-i18n="settings.api_key">API Key</div>
                  <div class="settings-row-sub" id="settings-key-status">Checking\u2026</div>
                </div>
                <button class="secondary-btn" id="settings-key-btn" data-i18n="settings.manage">Manage</button>
              </div>
            </div>

            <!-- Transcription defaults -->
            <div class="settings-section">
              <div class="settings-section-title" data-i18n="settings.defaults">Defaults</div>
              <div class="settings-row">
                <div class="settings-row-label" data-i18n="settings.audio_language">Audio Language</div>
                <select class="setting-select" id="settings-audio-lang"></select>
              </div>
              <div class="settings-row">
                <div class="settings-row-label" data-i18n="settings.translate_to">Translate to</div>
                <select class="setting-select" id="settings-translate-lang"></select>
              </div>
            </div>

            <!-- About -->
            <div class="settings-section">
              <div class="settings-section-title" data-i18n="settings.about">About</div>
              <div class="settings-row">
                <div class="settings-row-label">SnapTranscript</div>
                <div class="settings-row-sub">v1.0.0</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-sub" style="font-size:0.78rem;color:#475569;" data-i18n="settings.privacy_note">
                  Your API key is stored locally only. No data passes through our servers.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `);
      }
      postMount() {
        super.postMount();
        this._buildSelects();
        this.$("#settings-key-btn")?.addEventListener("click", () => {
          this.hide();
          this._onApiKey?.();
        });
        DebugLogger.log(MODULE6, "mounted");
      }
      async show() {
        super.show();
        await this._refreshKeyStatus();
        await this._loadSavedLangs();
        DebugLogger.log(MODULE6, "show");
      }
      // ---- Private ----
      async _refreshKeyStatus() {
        const hasKey = await ApiKeyService.hasKey();
        const statusEl = this.$("#settings-key-status");
        if (statusEl) {
          statusEl.textContent = hasKey ? "\u2705 Key is set" : "\u274C No key \u2014 tap Manage";
          statusEl.style.color = hasKey ? "var(--success-color)" : "var(--danger-color)";
        }
        DebugLogger.log(MODULE6, "keyStatus", hasKey);
      }
      _buildSelects() {
        const uiSel = this.$("#settings-ui-lang");
        const audioSel = this.$("#settings-audio-lang");
        const transSel = this.$("#settings-translate-lang");
        AppConfig.UI_LANGUAGES.forEach((l) => {
          const opt = document.createElement("option");
          opt.value = l.code;
          opt.textContent = l.label;
          uiSel?.appendChild(opt);
        });
        AppConfig.TRANSCRIPTION_LANGUAGES.forEach((l) => {
          const opt = document.createElement("option");
          opt.value = l.code;
          opt.textContent = l.label;
          audioSel?.appendChild(opt);
        });
        AppConfig.TRANSLATION_LANGUAGES.forEach((l) => {
          const opt = document.createElement("option");
          opt.value = l.code;
          opt.textContent = l.label;
          transSel?.appendChild(opt);
        });
        uiSel?.addEventListener("change", (e) => {
          const code = e.target.value;
          DebugLogger.log(MODULE6, "UI lang changed", code);
          Preferences.set({ key: AppConfig.STORAGE_KEYS.UI_LANGUAGE, value: code });
          this._onLangChange?.(code);
        });
        audioSel?.addEventListener("change", (e) => {
          Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE, value: e.target.value });
          DebugLogger.log(MODULE6, "audioLang saved", e.target.value);
        });
        transSel?.addEventListener("change", (e) => {
          Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE, value: e.target.value });
          DebugLogger.log(MODULE6, "transLang saved", e.target.value);
        });
        DebugLogger.log(MODULE6, "_buildSelects done");
      }
      async _loadSavedLangs() {
        const [ui, audio, trans] = await Promise.all([
          Preferences.get({ key: AppConfig.STORAGE_KEYS.UI_LANGUAGE }),
          Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE }),
          Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE })
        ]);
        const uiSel = this.$("#settings-ui-lang");
        const audioSel = this.$("#settings-audio-lang");
        const transSel = this.$("#settings-translate-lang");
        if (uiSel) uiSel.value = ui.value || AppConfig.DEFAULT_UI_LANGUAGE;
        if (audioSel) audioSel.value = audio.value || AppConfig.DEFAULT_TRANSCRIPTION_LANGUAGE;
        if (transSel) transSel.value = trans.value || AppConfig.DEFAULT_TRANSLATION_LANGUAGE;
        DebugLogger.log(MODULE6, "_loadSavedLangs", `ui=${ui.value} audio=${audio.value} trans=${trans.value}`);
      }
    };
  }
});

// js/components/modals/PrivacyInfoModal.js
var PrivacyInfoModal;
var init_PrivacyInfoModal = __esm({
  "js/components/modals/PrivacyInfoModal.js"() {
    init_ModalComponent();
    PrivacyInfoModal = class extends ModalComponent {
      constructor() {
        super("privacy-info-modal");
      }
      render() {
        return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content privacy-modal-content">

          <div class="modal-header">
            <h3 data-i18n="privacy_info.title">\u{1F512} \u96B1\u79C1\u67B6\u69CB\u8AAA\u660E</h3>
            <button class="close-btn">\u2715</button>
          </div>

          <div class="modal-body privacy-modal-body">

            <!-- Architecture diagram -->
            <div class="privacy-arch-diagram">
              <div class="arch-node arch-node--device">
                <div class="arch-node-icon">\u{1F4F1}</div>
                <div class="arch-node-label" data-i18n="privacy_info.your_device">\u4F60\u7684\u88DD\u7F6E</div>
                <div class="arch-node-sub" data-i18n="privacy_info.device_sub">API Key \xB7 \u97F3\u8A0A \xB7 \u8F49\u9304\u7D50\u679C</div>
              </div>
              <div class="arch-arrow">
                <span class="arch-arrow-line"></span>
                <span class="arch-arrow-label" data-i18n="privacy_info.direct_conn">\u76F4\u63A5\u9023\u7DDA</span>
                <span class="arch-arrow-line"></span>
              </div>
              <div class="arch-node arch-node--google">
                <div class="arch-node-icon">\u{1F916}</div>
                <div class="arch-node-label">Google Gemini API</div>
                <div class="arch-node-sub" data-i18n="privacy_info.google_sub">AI \u8F49\u9304\u670D\u52D9</div>
              </div>
            </div>

            <div class="privacy-arch-note" data-i18n="privacy_info.no_server">
              SnapTranscript \u6C92\u6709\u5F8C\u7AEF\u4F3A\u670D\u5668\u3002\u9019\u500B App \u5728\u4F60\u7684\u88DD\u7F6E\u4E0A\u76F4\u63A5\u547C\u53EB Google API\u3002
            </div>

            <!-- Guarantee checklist -->
            <div class="privacy-section-title" data-i18n="privacy_info.guarantees_title">\u6211\u5011\u7684\u4FDD\u8B49</div>
            <ul class="privacy-checklist">
              <li class="privacy-check">
                <span class="check-icon">\u2705</span>
                <span data-i18n="privacy_info.check_key">API Key \u53EA\u5B58\u5728\u4F60\u7684\u88DD\u7F6E\u672C\u5730\uFF0CSnapTranscript \u6C38\u9060\u770B\u4E0D\u5230</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">\u2705</span>
                <span data-i18n="privacy_info.check_audio">\u97F3\u8A0A\u76F4\u63A5\u5F9E\u4F60\u7684\u88DD\u7F6E\u4E0A\u50B3\u5230 Google\uFF0C\u4E0D\u7D93\u904E\u6211\u5011\u4EFB\u4F55\u4F3A\u670D\u5668</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">\u2705</span>
                <span data-i18n="privacy_info.check_result">\u8F49\u9304\u7D50\u679C\u53EA\u5B58\u5728\u4F60\u7684\u88DD\u7F6E\uFF0C\u6211\u5011\u6C92\u6709\u8CC7\u6599\u5EAB\u5132\u5B58\u4F60\u7684\u5167\u5BB9</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">\u2705</span>
                <span data-i18n="privacy_info.check_opensource">\u539F\u59CB\u78BC\u516C\u958B\uFF0C\u4EFB\u4F55\u4EBA\u90FD\u53EF\u4EE5\u5BE9\u67E5</span>
              </li>
            </ul>

            <!-- How to verify -->
            <div class="privacy-section-title" data-i18n="privacy_info.verify_title">\u5982\u4F55\u81EA\u884C\u9A57\u8B49</div>
            <div class="privacy-verify-box">
              <p data-i18n="privacy_info.verify_steps">\u5728\u96FB\u8166\u700F\u89BD\u5668\u6309 <kbd>F12</kbd> \u958B\u555F\u958B\u767C\u8005\u5DE5\u5177 \u2192 \u5207\u5230 <strong>Network</strong> \u9801\u7C64 \u2192 \u57F7\u884C\u4E00\u6B21\u8F49\u9304 \u2192 \u78BA\u8A8D\u6240\u6709 API \u8ACB\u6C42\u53EA\u767C\u5F80 <code>generativelanguage.googleapis.com</code>\uFF0C\u5B8C\u5168\u6C92\u6709\u4EFB\u4F55\u8ACB\u6C42\u5230 SnapTranscript \u7684\u4F3A\u670D\u5668\u3002</p>
            </div>

            <!-- For non-technical users -->
            <div class="privacy-ai-tip">
              <span class="privacy-ai-tip-icon">\u{1F4A1}</span>
              <span data-i18n="privacy_info.ai_tip">\u770B\u4E0D\u61C2\u4E0A\u9762\u9019\u4E9B\uFF1F\u622A\u5716\u9019\u500B\u9801\u9762\uFF0C\u8CBC\u5230 ChatGPT \u6216 Claude \u554F\uFF1A\u300C\u9019\u500B App \u5B89\u5168\u55CE\uFF1F\u6211\u7684 API Key \u6703\u5916\u6D29\u55CE\uFF1F\u300D\u8B93 AI \u5E6B\u4F60\u89E3\u91CB\u3002</span>
            </div>

            <!-- Warning -->
            <div class="privacy-warning">
              <div class="privacy-warning-title" data-i18n="privacy_info.warning_title">\u26A0\uFE0F \u91CD\u8981\u63D0\u9192</div>
              <p data-i18n="privacy_info.warning_body">\u8ACB\u52FF\u5C07\u4F60\u7684 API Key \u63D0\u4F9B\u7D66\u4EFB\u4F55\u4EBA\uFF0C\u5305\u62EC\u4EFB\u4F55\u8072\u7A31\u662F SnapTranscript \u5BA2\u670D\u7684\u4EBA\u3002\u6211\u5011\u6C38\u9060\u4E0D\u6703\u7D22\u53D6\u4F60\u7684 Key\u3002\u4ED8\u8CBB API Key \u5916\u6D29\u53EF\u80FD\u5C0E\u81F4\u4ED6\u4EBA\u76DC\u7528\u4F60\u7684\u984D\u5EA6\u3002</p>
            </div>

          </div>

          <div class="modal-footer">
            <a class="secondary-btn" href="https://github.com/jujustine1994/SnapTranscript-for-app" target="_blank" rel="noopener" data-i18n="privacy_info.view_source">\u67E5\u770B\u539F\u59CB\u78BC</a>
            <button class="primary-btn close-modal-btn" data-i18n="privacy_info.got_it">\u4E86\u89E3\u4E86</button>
          </div>

        </div>
      </div>
    `);
      }
      postMount() {
        super.postMount();
      }
    };
  }
});

// js/views/ResultView.js
function _uiLangToOutputLang(code) {
  const map = {
    "zh-TW": "Traditional Chinese (\u7E41\u9AD4\u4E2D\u6587)",
    "zh-CN": "Simplified Chinese (\u7B80\u4F53\u4E2D\u6587)",
    "en-US": "English",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "vi-VN": "Vietnamese",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "tl-PH": "Filipino",
    "id-ID": "Indonesian"
  };
  return map[code] || "English";
}
var MODULE7, ResultView;
var init_ResultView = __esm({
  "js/views/ResultView.js"() {
    init_BaseComponent();
    init_debug_logger();
    init_transcribe_service();
    init_history_service();
    init_config();
    MODULE7 = "ResultView";
    ResultView = class extends BaseComponent {
      constructor() {
        super("result-view");
        this._data = null;
        this._saved = false;
        this._qaMessages = [];
        this._qaSavedBytes = 0;
      }
      render() {
        return this.createElementFromHTML(`
      <div id="result-view" class="result-view hidden">

        <!-- Header -->
        <div class="result-header">
          <button class="result-back-btn" id="result-back-btn" data-i18n="app.back">\u2190 Back</button>
          <div class="result-header-right">
            <button class="result-share-btn" id="result-share-btn" data-i18n="result.share">Share</button>
            <button class="primary-btn result-save-btn" id="result-save-btn" data-i18n="result.save">Save</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="result-tabs" id="result-tabs">
          <button class="result-tab active" data-tab="original" data-i18n="result.original">Original</button>
          <button class="result-tab" data-tab="translated" id="tab-translated" data-i18n="result.translation">Translation</button>
          <button class="result-tab" data-tab="summary" data-i18n="result.summary">Summary</button>
          <button class="result-tab" data-tab="qa" data-i18n="result.qa">Q&amp;A</button>
        </div>

        <!-- Tab panes -->
        <div class="result-body">
          <div class="result-pane active" id="pane-original">
            <p class="result-text selectable" id="text-original"></p>
          </div>

          <div class="result-pane" id="pane-translated">
            <button class="ai-gen-btn hidden" id="btn-gen-translated" data-i18n="result.gen_translation">\u2728 Generate Translation</button>
            <p class="result-text selectable" id="text-translated"></p>
          </div>

          <div class="result-pane" id="pane-summary">
            <button class="ai-gen-btn" id="btn-gen-summary" data-i18n="result.gen_summary">\u2728 Generate Summary</button>
            <div class="prompt-editor hidden" id="prompt-editor-summary">
              <p class="prompt-editor-hint" data-i18n="result.prompt_edit_hint">Edit the prompt before sending</p>
              <textarea class="prompt-editor-textarea" id="prompt-textarea-summary"></textarea>
              <div class="prompt-editor-actions">
                <button class="secondary-btn prompt-cancel-btn" data-type="summary" data-i18n="app.cancel">Cancel</button>
                <button class="primary-btn prompt-send-btn" data-type="summary" data-i18n="result.prompt_send">Send</button>
              </div>
            </div>
            <p class="result-text selectable" id="text-summary"></p>
            <button class="ai-regen-btn hidden" id="btn-regen-summary" data-i18n="result.regen">\u{1F504} Regenerate</button>
          </div>

          <div class="result-pane result-pane-qa" id="pane-qa">
            <div class="result-qa-messages" id="qa-messages"></div>
            <div class="result-qa-row">
              <input class="result-qa-input selectable" id="qa-input" type="text" placeholder="Ask a question about this transcript\u2026" data-i18n="result.qa_placeholder" />
              <button class="result-qa-send" id="qa-send-btn" data-i18n="result.qa_send">Ask</button>
            </div>
          </div>

        </div>

        <!-- AI loading overlay (inside result view) -->
        <div class="result-ai-loading hidden" id="result-ai-loading">
          <div class="spinner"></div>
          <p id="result-ai-text">Generating\u2026</p>
        </div>

      </div>
    `);
      }
      postMount() {
        this._bindEvents();
        DebugLogger.log(MODULE7, "mounted");
      }
      // ---- Public API ----
      /**
       * Display transcription results.
       * @param {object} data - { original, translated, meta: { audioFileName, durationSec, language, targetLanguage } }
       */
      // show() supports two entry points:
      //   1. Fresh transcription from app.js → data.id already set (auto-saved), _saved = true
      //   2. Reopening from history → HistoryService.load() fills all fields including qa array
      show(data) {
        DebugLogger.log(MODULE7, "show", `${data.original?.length} chars, translated=${!!data.translated}`);
        this._data = {
          original: data.original || "",
          translated: data.translated || null,
          summary: data.summary || null,
          qa: data.qa || null,
          id: data.id || null,
          meta: data.meta || {}
        };
        this._saved = !!data.id;
        this._qaMessages = Array.isArray(data.qa) ? [...data.qa] : [];
        this._qaSavedBytes = this._qaMessages.length ? new Blob([JSON.stringify(this._qaMessages)]).size : 0;
        this.$("#text-original").textContent = this._data.original;
        this.$("#text-translated").textContent = this._data.translated || "";
        this.$("#text-summary").textContent = this._data.summary || "";
        const hasTranslation = !!this._data.translated;
        this.$("#btn-gen-translated").classList.toggle("hidden", hasTranslation);
        this.$("#btn-gen-summary").classList.toggle("hidden", !!this._data.summary);
        this.$("#btn-regen-summary").classList.toggle("hidden", !this._data.summary);
        this.$("#qa-messages").innerHTML = "";
        this.$("#qa-input").value = "";
        this._qaMessages.forEach((msg) => this._appendQa(msg.role, msg.text));
        this._updateSaveBtn();
        this._switchTab("original");
        this.element.classList.remove("hidden");
        requestAnimationFrame(() => this.element.classList.add("visible"));
        DebugLogger.log(MODULE7, "visible");
      }
      hide() {
        DebugLogger.log(MODULE7, "hide");
        this.element.classList.remove("visible");
        setTimeout(() => this.element.classList.add("hidden"), 300);
      }
      // ---- Events ----
      _bindEvents() {
        this.$("#result-back-btn")?.addEventListener("click", () => {
          DebugLogger.log(MODULE7, "back");
          this.hide();
          window.dispatchEvent(new CustomEvent("resultClosed"));
        });
        this.$("#result-save-btn")?.addEventListener("click", () => this._save());
        this.$("#result-share-btn")?.addEventListener("click", () => this._share());
        this.$("#result-tabs")?.addEventListener("click", (e) => {
          const tab = e.target.closest("[data-tab]");
          if (tab) this._switchTab(tab.dataset.tab);
        });
        this.$("#btn-gen-summary")?.addEventListener("click", () => this._showPromptEditor("summary"));
        this.$("#btn-gen-translated")?.addEventListener("click", () => this._generate("translated"));
        this.$("#btn-regen-summary")?.addEventListener("click", () => this._showPromptEditor("summary"));
        this.element.querySelectorAll(".prompt-send-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            const customPrompt = this.$(`#prompt-textarea-${type}`)?.value?.trim() || null;
            this._hidePromptEditor(type);
            this._generate(type, customPrompt);
          });
        });
        this.element.querySelectorAll(".prompt-cancel-btn").forEach((btn) => {
          btn.addEventListener("click", () => this._hidePromptEditor(btn.dataset.type));
        });
        this.$("#qa-send-btn")?.addEventListener("click", () => this._sendQuestion());
        this.$("#qa-input")?.addEventListener("keydown", (e) => {
          if (e.key === "Enter") this._sendQuestion();
        });
      }
      _switchTab(name) {
        DebugLogger.log(MODULE7, "tab", name);
        this.element.querySelectorAll(".result-tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
        this.element.querySelectorAll(".result-pane").forEach((p) => p.classList.toggle("active", p.id === `pane-${name}`));
      }
      // ---- Prompt Editor ----
      // Pre-fills the textarea with the default prompt (including current UI language instruction)
      // so the user can see and optionally modify it before sending.
      // Uses localStorage directly (same key as LanguageManager) — NOT Capacitor Preferences,
      // which would use a different _cap_ prefix and always return null in browser.
      _showPromptEditor(type) {
        const uiLangCode = localStorage.getItem(AppConfig.STORAGE_KEYS.UI_LANGUAGE) || AppConfig.DEFAULT_UI_LANGUAGE;
        const outputLang = _uiLangToOutputLang(uiLangCode);
        const defaults = {
          summary: `Extract all significant information from this transcript. Group the content under clear topic headings based on the discussion flow, with detailed nested bullet points under each heading. Capture key decisions, action items (with assignees and deadlines if mentioned), specific data or metrics, and important context. Include all relevant details, even minor ones. Write the output in ${outputLang}.`
        };
        const textarea = this.$(`#prompt-textarea-${type}`);
        if (textarea) textarea.value = defaults[type] || "";
        this.$(`#btn-gen-${type}`)?.classList.add("hidden");
        this.$(`#btn-regen-${type}`)?.classList.add("hidden");
        this.$(`#prompt-editor-${type}`)?.classList.remove("hidden");
        textarea?.focus();
      }
      _hidePromptEditor(type) {
        this.$(`#prompt-editor-${type}`)?.classList.add("hidden");
        const hasContent = !!this._data[type];
        this.$(`#btn-gen-${type}`)?.classList.toggle("hidden", hasContent);
        this.$(`#btn-regen-${type}`)?.classList.toggle("hidden", !hasContent);
      }
      // ---- AI Generation ----
      // _generate handles two content types:
      //   summary    → use outputLang from UI settings; support custom prompt override
      //   translated → use targetLanguage from meta (set at transcription time); no custom prompt
      //
      // Only summary is auto-persisted via saveExtra — translated is already
      // included in the initial HistoryService.save() call in app.js.
      // previousBytes is passed to saveExtra so storageSizeBytes stays accurate on regeneration.
      async _generate(type, customPrompt = null) {
        DebugLogger.log(MODULE7, `_generate ${type}`, customPrompt ? "custom prompt" : "default prompt");
        const labels = { summary: "Generating summary\u2026", translated: "Translating\u2026" };
        this._showAiLoading(labels[type] || "Generating\u2026");
        try {
          let result;
          if (type === "summary") {
            const uiLangCode = localStorage.getItem(AppConfig.STORAGE_KEYS.UI_LANGUAGE) || AppConfig.DEFAULT_UI_LANGUAGE;
            const outputLang = _uiLangToOutputLang(uiLangCode);
            result = await TranscribeService.summarize(this._data.original, null, outputLang, customPrompt);
          } else if (type === "translated") {
            const lang = this._data.meta?.targetLanguage || "en";
            result = await TranscribeService.translate(this._data.original, lang);
          }
          DebugLogger.log(MODULE7, `_generate ${type} OK`, `${result.length} chars`);
          const previousBytes = this._data[type] ? new Blob([this._data[type]]).size : 0;
          this._data[type] = result;
          this.$(`#text-${type}`).textContent = result;
          this.$(`#btn-gen-${type}`)?.classList.add("hidden");
          this.$(`#btn-regen-${type}`)?.classList.remove("hidden");
          if (this._saved && this._data.id && type === "summary") {
            await HistoryService.saveExtra(this._data.id, type, result, previousBytes).catch((err) => {
              DebugLogger.warn(MODULE7, "saveExtra failed", err.message);
            });
          }
        } catch (err) {
          DebugLogger.error(MODULE7, `_generate ${type} FAILED`, err.message);
          this.$(`#text-${type}`).textContent = `Error: ${err.message}`;
        }
        this._hideAiLoading();
      }
      // ---- Q&A ----
      async _sendQuestion() {
        const input = this.$("#qa-input");
        const q = input?.value?.trim();
        if (!q) return;
        DebugLogger.log(MODULE7, "_sendQuestion", q.substring(0, 60));
        input.value = "";
        this._appendQa("user", q);
        const pendingEl = this._appendQa("ai", "\u2026");
        try {
          const answer = await TranscribeService.askQuestion(this._data.original, q);
          DebugLogger.log(MODULE7, "_sendQuestion answered", `${answer.length} chars`);
          pendingEl.textContent = answer;
          this._qaMessages.push({ role: "user", text: q }, { role: "ai", text: answer });
          if (this._saved && this._data.id) {
            const json = JSON.stringify(this._qaMessages);
            await HistoryService.saveExtra(this._data.id, "qa", json, this._qaSavedBytes).catch((err) => {
              DebugLogger.warn(MODULE7, "qa saveExtra failed", err.message);
            });
            this._qaSavedBytes = new Blob([json]).size;
          }
        } catch (err) {
          DebugLogger.error(MODULE7, "_sendQuestion FAILED", err.message);
          pendingEl.textContent = `Error: ${err.message}`;
        }
      }
      _appendQa(role, text) {
        const msgs = this.$("#qa-messages");
        const div = document.createElement("div");
        div.className = `qa-bubble qa-${role}`;
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
        return div;
      }
      // ---- Save & Share ----
      async _save() {
        if (this._saved) return;
        DebugLogger.log(MODULE7, "_save");
        this._showAiLoading("Saving\u2026");
        try {
          const id = await HistoryService.save({
            ...this._data.meta,
            original: this._data.original,
            translated: this._data.translated
          });
          this._data.id = id;
          this._saved = true;
          this._updateSaveBtn();
          DebugLogger.log(MODULE7, "_save OK", id);
        } catch (err) {
          DebugLogger.error(MODULE7, "_save FAILED", err.message);
          alert("Save failed: " + err.message);
        }
        this._hideAiLoading();
      }
      async _share() {
        DebugLogger.log(MODULE7, "_share");
        const activeTab = this.element.querySelector(".result-tab.active")?.dataset?.tab || "original";
        const shareText = this._data[activeTab] || this._data.original;
        try {
          if (navigator.share) {
            await navigator.share({ text: shareText });
            DebugLogger.log(MODULE7, "_share native OK");
          } else {
            await navigator.clipboard.writeText(shareText);
            DebugLogger.log(MODULE7, "_share clipboard fallback OK");
            alert("Copied to clipboard");
          }
        } catch (err) {
          DebugLogger.warn(MODULE7, "_share failed", err.message);
        }
      }
      _updateSaveBtn() {
        const btn = this.$("#result-save-btn");
        if (!btn) return;
        btn.textContent = this._saved ? "\u2713 Saved" : "Save";
        btn.disabled = this._saved;
      }
      _showAiLoading(text) {
        this.$("#result-ai-text").textContent = text;
        this.$("#result-ai-loading").classList.remove("hidden");
      }
      _hideAiLoading() {
        this.$("#result-ai-loading").classList.add("hidden");
      }
    };
  }
});

// js/views/HistoryView.js
function _fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function _fmtSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
var MODULE8, HistoryView;
var init_HistoryView = __esm({
  "js/views/HistoryView.js"() {
    init_history_service();
    init_debug_logger();
    MODULE8 = "HistoryView";
    HistoryView = class {
      /**
       * @param {object} opts
       * @param {function} opts.onOpen - callback(data) when user opens a transcript
       */
      constructor({ onOpen } = {}) {
        this._onOpen = onOpen;
        this._allItems = [];
      }
      /** Call once after DOM is ready. Binds static event listeners. */
      init() {
        document.getElementById("history-search")?.addEventListener("input", (e) => this._filterList(e.target.value.trim()));
        DebugLogger.log(MODULE8, "init");
      }
      /** Called when the History tab becomes active. Refreshes the list. */
      async activate() {
        DebugLogger.log(MODULE8, "activate");
        const searchInput = document.getElementById("history-search");
        if (searchInput) searchInput.value = "";
        await this._loadList();
      }
      // ---- Private ----
      async _loadList() {
        const list = document.getElementById("history-list");
        const emptyEl = document.getElementById("history-empty");
        if (!list) return;
        list.innerHTML = '<p class="history-loading">Loading\u2026</p>';
        if (emptyEl) emptyEl.classList.add("hidden");
        try {
          this._allItems = await HistoryService.list();
          DebugLogger.log(MODULE8, "_loadList OK", `${this._allItems.length} items`);
          this._renderList(this._allItems);
        } catch (err) {
          DebugLogger.error(MODULE8, "_loadList FAILED", err.message);
          list.innerHTML = `<p class="history-error">Error: ${err.message}</p>`;
        }
      }
      _filterList(query) {
        if (!query) {
          this._renderList(this._allItems);
          return;
        }
        const q = query.toLowerCase();
        this._renderList(this._allItems.filter(
          (m) => (m.audioFileName || "").toLowerCase().includes(q)
        ));
      }
      _renderList(items) {
        const list = document.getElementById("history-list");
        const emptyEl = document.getElementById("history-empty");
        if (!list) return;
        list.innerHTML = "";
        if (items.length === 0) {
          emptyEl?.classList.remove("hidden");
          return;
        }
        emptyEl?.classList.add("hidden");
        items.forEach((meta) => list.appendChild(this._renderItem(meta)));
      }
      _renderItem(meta) {
        const div = document.createElement("div");
        div.className = "history-item";
        div.dataset.id = meta.id;
        const nameRow = document.createElement("div");
        nameRow.className = "history-item-name-row";
        nameRow.appendChild(this._buildNameDisplay(meta));
        const dateEl = document.createElement("span");
        dateEl.className = "history-item-date";
        dateEl.textContent = _fmtDate(meta.createdAt);
        const tagsEl = document.createElement("span");
        tagsEl.className = "history-item-tags";
        tagsEl.textContent = [
          meta.language || "",
          meta.hasTranslation ? "Translated" : "",
          meta.storageSizeBytes ? _fmtSize(meta.storageSizeBytes) : ""
        ].filter(Boolean).join(" \xB7 ");
        const infoEl = document.createElement("div");
        infoEl.className = "history-item-info";
        infoEl.appendChild(nameRow);
        infoEl.appendChild(dateEl);
        infoEl.appendChild(tagsEl);
        const actionsEl = document.createElement("div");
        actionsEl.className = "history-item-actions";
        actionsEl.innerHTML = `
      <button class="history-open-btn">Open</button>
      <button class="history-del-btn" aria-label="Delete">\u{1F5D1}</button>
    `;
        div.appendChild(infoEl);
        div.appendChild(actionsEl);
        actionsEl.querySelector(".history-open-btn").addEventListener("click", () => this._openItem(meta.id));
        actionsEl.querySelector(".history-del-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          this._deleteItem(meta.id, div);
        });
        return div;
      }
      /** Build the name span + rename button (or returns a DocumentFragment). */
      _buildNameDisplay(meta) {
        const frag = document.createDocumentFragment();
        const nameSpan = document.createElement("span");
        nameSpan.className = "history-item-name";
        nameSpan.textContent = meta.audioFileName || "Recording";
        const renameBtn = document.createElement("button");
        renameBtn.className = "history-rename-btn";
        renameBtn.setAttribute("aria-label", "Rename");
        renameBtn.textContent = "\u270F\uFE0F";
        renameBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this._startRename(meta, nameSpan.closest(".history-item-name-row"));
        });
        frag.appendChild(nameSpan);
        frag.appendChild(renameBtn);
        return frag;
      }
      _startRename(meta, nameRow) {
        const currentName = meta.audioFileName || "Recording";
        nameRow.innerHTML = "";
        const input = document.createElement("input");
        input.className = "history-rename-input";
        input.value = currentName;
        const saveBtn = document.createElement("button");
        saveBtn.className = "history-rename-save-btn";
        saveBtn.textContent = "\u2713";
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "history-rename-cancel-btn";
        cancelBtn.textContent = "\u2715";
        nameRow.appendChild(input);
        nameRow.appendChild(saveBtn);
        nameRow.appendChild(cancelBtn);
        input.focus();
        input.select();
        const restore = () => {
          nameRow.innerHTML = "";
          nameRow.appendChild(this._buildNameDisplay(meta));
        };
        const save = async () => {
          const newName = input.value.trim();
          if (!newName) {
            restore();
            return;
          }
          try {
            await HistoryService.updateFileName(meta.id, newName);
            meta.audioFileName = newName;
            const cached = this._allItems.find((m) => m.id === meta.id);
            if (cached) cached.audioFileName = newName;
            DebugLogger.log(MODULE8, "rename OK", newName);
          } catch (err) {
            DebugLogger.error(MODULE8, "rename FAILED", err.message);
          }
          restore();
        };
        saveBtn.addEventListener("click", save);
        cancelBtn.addEventListener("click", restore);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") restore();
        });
      }
      async _openItem(id) {
        DebugLogger.log(MODULE8, "_openItem", id);
        try {
          const data = await HistoryService.load(id);
          DebugLogger.log(MODULE8, "_openItem loaded OK");
          this._onOpen?.(data);
        } catch (err) {
          DebugLogger.error(MODULE8, "_openItem FAILED", err.message);
          alert("Failed to open: " + err.message);
        }
      }
      async _deleteItem(id, el) {
        if (!confirm("Delete this transcript? This cannot be undone.")) return;
        try {
          await HistoryService.delete(id);
          el.remove();
          this._allItems = this._allItems.filter((m) => m.id !== id);
          if (!document.getElementById("history-list").children.length) {
            document.getElementById("history-empty")?.classList.remove("hidden");
          }
          DebugLogger.log(MODULE8, "_deleteItem OK", id);
        } catch (err) {
          DebugLogger.error(MODULE8, "_deleteItem FAILED", err.message);
          alert("Delete failed: " + err.message);
        }
      }
    };
  }
});

// js/app.js
var require_app = __commonJS({
  "js/app.js"() {
    init_config();
    init_debug_logger();
    init_DebugPanel();
    init_language_manager();
    init_api_key_service();
    init_ffmpeg_service();
    init_transcribe_service();
    init_admob_service();
    init_history_service();
    init_recorder_service();
    init_ApiKeyModal();
    init_SettingsModal();
    init_PrivacyInfoModal();
    init_ResultView();
    init_HistoryView();
    var App = class {
      constructor() {
        this.debugPanel = new DebugPanel();
        this.lang = new LanguageManager();
        this.apiKeyModal = new ApiKeyModal();
        this.settingsModal = new SettingsModal({
          onApiKey: () => this.apiKeyModal.show(),
          onLangChange: (code) => {
            DebugLogger.log("App", "UI lang change", code);
            this.lang.setLanguage(code);
          }
        });
        this.historyView = new HistoryView({ onOpen: (data) => this.resultView.show(data) });
        this.privacyInfoModal = new PrivacyInfoModal();
        this.resultView = new ResultView();
        this._selectedFile = null;
        this._fileDuration = 0;
        this._processing = false;
        this._cancelFlag = false;
        this._recording = false;
        this._recTimerEl = null;
      }
      async init() {
        this.debugPanel.init();
        DebugLogger.log("App", "init start", `platform=${navigator.platform} debug=${AppConfig.DEBUG_MODE}`);
        this.lang.init();
        DebugLogger.log("App", "lang init", this.lang.currentLang);
        this.apiKeyModal.mount(document.body);
        this.settingsModal.mount(document.body);
        this.privacyInfoModal.mount(document.body);
        this.resultView.mount(document.body);
        this.historyView.init();
        DebugLogger.log("App", "components mounted");
        this.lang.translatePage();
        AdMobService.initialize();
        this._bindUIEvents();
        const hasKey = await ApiKeyService.hasKey();
        DebugLogger.log("App", "hasKey", hasKey);
        if (!hasKey) {
          this.apiKeyModal.show();
        } else {
          this._setPickerEnabled(true);
        }
        AdMobService.prepareInterstitial();
        DebugLogger.log("App", "init complete");
      }
      // ---- UI Event Wiring ----
      _bindUIEvents() {
        DebugLogger.log("App", "_bindUIEvents");
        document.getElementById("settings-btn")?.addEventListener("click", () => {
          DebugLogger.log("App", "settings-btn click");
          this.settingsModal.show();
        });
        document.getElementById("privacy-btn")?.addEventListener("click", () => {
          DebugLogger.log("App", "privacy-btn click");
          this.privacyInfoModal.show();
        });
        document.getElementById("tab-home")?.addEventListener("click", () => this._switchTab("home"));
        document.getElementById("tab-history")?.addEventListener("click", () => this._switchTab("history"));
        window.addEventListener("apiKeySet", () => {
          DebugLogger.log("App", "apiKeySet");
          this._setPickerEnabled(true);
        });
        window.addEventListener("apiKeyCleared", () => {
          DebugLogger.log("App", "apiKeyCleared");
          this._setPickerEnabled(false);
          this._resetFileSelection();
        });
        document.getElementById("record-btn")?.addEventListener("click", () => this._startRecording());
        document.getElementById("stop-record-btn")?.addEventListener("click", () => this._stopRecording());
        document.getElementById("audio-file-input")?.addEventListener("change", (e) => this._onFileSelected(e));
        document.getElementById("change-file-btn")?.addEventListener("click", () => this._resetFileSelection());
        document.getElementById("translate-toggle")?.addEventListener("change", (e) => {
          const row = document.getElementById("translate-lang-row");
          row?.classList.toggle("hidden", !e.target.checked);
          DebugLogger.log("App", "translate toggle", e.target.checked);
        });
        this._buildTranslateLangSelect();
        document.getElementById("main-cta")?.addEventListener("click", () => this._startTranscription());
        document.getElementById("processing-cancel-btn")?.addEventListener("click", () => {
          DebugLogger.log("App", "cancel requested");
          this._cancelFlag = true;
        });
        window.addEventListener("resultClosed", () => {
          DebugLogger.log("App", "resultClosed");
        });
      }
      _switchTab(tab) {
        DebugLogger.log("App", "_switchTab", tab);
        document.getElementById("page-home")?.classList.toggle("active", tab === "home");
        document.getElementById("page-home")?.classList.toggle("hidden", tab !== "home");
        document.getElementById("page-history")?.classList.toggle("active", tab === "history");
        document.getElementById("page-history")?.classList.toggle("hidden", tab !== "history");
        document.getElementById("tab-home")?.classList.toggle("active", tab === "home");
        document.getElementById("tab-history")?.classList.toggle("active", tab === "history");
        if (tab === "history") this.historyView.activate();
      }
      _buildTranslateLangSelect() {
        const sel = document.getElementById("translate-lang-select");
        if (!sel) return;
        AppConfig.TRANSLATION_LANGUAGES.filter((l) => l.code !== "none").forEach((l) => {
          const opt = document.createElement("option");
          opt.value = l.code;
          opt.textContent = l.label;
          sel.appendChild(opt);
        });
        DebugLogger.log("App", "_buildTranslateLangSelect", `${sel.options.length} options`);
      }
      // ---- File Selection (Slice 2) ----
      async _onFileSelected(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        await this._handleFile(file);
      }
      // Shared entry point for both file-picker and recording paths.
      async _handleFile(file) {
        this._selectedFile = file;
        DebugLogger.log("App", "_handleFile", `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB type=${file.type}`);
        this._fileDuration = await this._getAudioDuration(file);
        DebugLogger.log("App", "duration", `${this._fileDuration.toFixed(1)}s`);
        const nameEl = document.getElementById("file-name");
        const durEl = document.getElementById("file-duration");
        if (nameEl) nameEl.textContent = file.name;
        if (durEl) durEl.textContent = _fmtDuration(this._fileDuration);
        document.getElementById("audio-picker-section")?.classList.add("hidden");
        document.getElementById("recording-section")?.classList.add("hidden");
        document.getElementById("file-info-section")?.classList.remove("hidden");
        const hasKey = await ApiKeyService.hasKey();
        DebugLogger.log("App", "hasKey at file select", hasKey);
        if (hasKey) document.getElementById("main-cta")?.removeAttribute("disabled");
      }
      // ---- Recording ----
      async _startRecording() {
        if (this._recording) return;
        if (!RecorderService.isSupported()) {
          alert("Recording is not supported in this browser.");
          return;
        }
        DebugLogger.log("App", "_startRecording");
        try {
          this._recording = true;
          this._recTimerEl = document.getElementById("recording-timer");
          document.getElementById("audio-picker-section")?.classList.add("hidden");
          document.getElementById("recording-section")?.classList.remove("hidden");
          await RecorderService.start((elapsed) => {
            if (this._recTimerEl) {
              const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
              const s2 = String(elapsed % 60).padStart(2, "0");
              this._recTimerEl.textContent = `${m}:${s2}`;
            }
          });
        } catch (err) {
          DebugLogger.error("App", "_startRecording FAILED", err.message);
          this._recording = false;
          document.getElementById("recording-section")?.classList.add("hidden");
          document.getElementById("audio-picker-section")?.classList.remove("hidden");
          alert(`Could not access microphone:
${err.message}`);
        }
      }
      async _stopRecording() {
        if (!this._recording) return;
        DebugLogger.log("App", "_stopRecording");
        this._recording = false;
        try {
          const blob = await RecorderService.stop();
          const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
          const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
          const file = new File([blob], `recording-${ts}.${ext}`, { type: blob.type });
          DebugLogger.log("App", "_stopRecording blob\u2192file", `${file.name} ${(file.size / 1024).toFixed(1)}KB`);
          if (this._recTimerEl) this._recTimerEl.textContent = "00:00";
          await this._handleFile(file);
        } catch (err) {
          DebugLogger.error("App", "_stopRecording FAILED", err.message);
          document.getElementById("recording-section")?.classList.add("hidden");
          document.getElementById("audio-picker-section")?.classList.remove("hidden");
          alert(`Recording failed:
${err.message}`);
        }
      }
      _resetFileSelection() {
        DebugLogger.log("App", "_resetFileSelection");
        this._selectedFile = null;
        this._fileDuration = 0;
        const input = document.getElementById("audio-file-input");
        if (input) input.value = "";
        if (this._recording) {
          this._recording = false;
          RecorderService.cancel();
        }
        document.getElementById("file-info-section")?.classList.add("hidden");
        document.getElementById("recording-section")?.classList.add("hidden");
        document.getElementById("audio-picker-section")?.classList.remove("hidden");
        document.getElementById("main-cta")?.setAttribute("disabled", "true");
      }
      _setPickerEnabled(enabled) {
        DebugLogger.log("App", "_setPickerEnabled", enabled);
        const label = document.querySelector(".audio-upload-label");
        const input = document.getElementById("audio-file-input");
        const recordBtn = document.getElementById("record-btn");
        if (label) label.style.opacity = enabled ? "1" : "0.4";
        if (input) input.disabled = !enabled;
        if (recordBtn) recordBtn.disabled = !enabled;
      }
      // ---- Transcription Pipeline (Slices 3–5) ----
      async _startTranscription() {
        if (!this._selectedFile) {
          DebugLogger.warn("App", "_startTranscription: no file");
          return;
        }
        if (this._processing) {
          DebugLogger.warn("App", "_startTranscription: already processing");
          return;
        }
        DebugLogger.log("App", "=== START TRANSCRIPTION ===", this._selectedFile.name);
        const translateOn = document.getElementById("translate-toggle")?.checked || false;
        const targetLang = document.getElementById("translate-lang-select")?.value || "zh-TW";
        const audioLang = AppConfig.DEFAULT_TRANSCRIPTION_LANGUAGE;
        DebugLogger.log("App", "options", `translate=${translateOn} target=${targetLang} lang=${audioLang}`);
        this._processing = true;
        this._cancelFlag = false;
        this._showProcessing(true);
        try {
          this._updateProgress({ stage: "compressing", percent: 0, detail: "Preparing FFmpeg\u2026" });
          DebugLogger.log("App", "SLICE 3: FFmpeg start");
          const segments = await FFmpegService.processAudio(
            this._selectedFile,
            (p) => {
              DebugLogger.log("App", "ffmpeg progress", `${p.percent}% ${p.detail}`);
              this._updateProgress(p);
            }
          );
          DebugLogger.log("App", "SLICE 3 done", `${segments.length} segments`);
          if (this._cancelFlag) throw new Error("Cancelled by user");
          DebugLogger.log("App", "SLICE 4: Gemini transcription start");
          const result = await TranscribeService.transcribeAll(
            segments,
            { language: audioLang, translate: translateOn, targetLanguage: targetLang },
            (p) => {
              DebugLogger.log("App", "transcribe progress", `${p.percent}% ${p.detail}`);
              this._updateProgress(p);
            }
          );
          DebugLogger.log("App", "SLICE 4 done", `original=${result.original.length} translated=${result.translated?.length || 0}`);
          if (this._cancelFlag) throw new Error("Cancelled by user");
          DebugLogger.log("App", "SLICE 5: show ad + result");
          this._showProcessing(false);
          this._processing = false;
          await AdMobService.showInterstitial();
          AdMobService.prepareInterstitial();
          let historyId = null;
          try {
            historyId = await HistoryService.save({
              audioFileName: this._selectedFile.name,
              durationSec: this._fileDuration,
              language: audioLang,
              targetLanguage: translateOn ? targetLang : null,
              original: result.original,
              translated: result.translated
            });
            DebugLogger.log("App", "auto-saved to history", historyId);
          } catch (err) {
            DebugLogger.warn("App", "auto-save failed (non-fatal)", err.message);
          }
          this.resultView.show({
            original: result.original,
            translated: result.translated,
            id: historyId,
            meta: {
              audioFileName: this._selectedFile.name,
              durationSec: this._fileDuration,
              language: audioLang,
              hasTranslation: !!result.translated,
              targetLanguage: translateOn ? targetLang : null
            }
          });
          DebugLogger.log("App", "=== TRANSCRIPTION COMPLETE ===");
        } catch (err) {
          DebugLogger.error("App", "_startTranscription FAILED", err.message);
          this._showProcessing(false);
          this._processing = false;
          if (err.message !== "Cancelled by user") {
            alert(`Transcription failed:
${err.message}`);
          }
        }
      }
      // ---- Processing Overlay ----
      _showProcessing(show) {
        DebugLogger.log("App", "_showProcessing", show);
        document.getElementById("processing-overlay")?.classList.toggle("hidden", !show);
        if (show) {
          this._updateProgress({ stage: "preparing", percent: 0, detail: "Starting\u2026" });
        }
      }
      _updateProgress({ stage, percent, detail }) {
        const stageEl = document.getElementById("processing-stage");
        const fillEl = document.getElementById("processing-fill");
        const detailEl = document.getElementById("processing-detail");
        const stageLabels = {
          loading: "Loading FFmpeg\u2026",
          compressing: "Compressing audio\u2026",
          uploading: "Uploading to Gemini\u2026",
          transcribing: "Transcribing\u2026",
          translating: "Translating\u2026",
          done: "Complete!"
        };
        if (stageEl) stageEl.textContent = stageLabels[stage] || stage;
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (detailEl) detailEl.textContent = detail || "";
      }
      // ---- Helpers ----
      _getAudioDuration(file) {
        return new Promise((resolve2) => {
          const url = URL.createObjectURL(file);
          const audio = new Audio();
          audio.preload = "metadata";
          audio.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            resolve2(audio.duration);
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            resolve2(0);
          };
          audio.src = url;
        });
      }
    };
    document.addEventListener("DOMContentLoaded", () => {
      const app = new App();
      app.init();
    });
    function _fmtDuration(seconds) {
      if (!seconds || isNaN(seconds) || seconds === Infinity) return "--:--";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s2 = Math.floor(seconds % 60);
      if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s2).padStart(2, "0")}`;
      return `${m}:${String(s2).padStart(2, "0")}`;
    }
  }
});
export default require_app();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
//# sourceMappingURL=bundle.js.map
