// App-wide constants. All magic strings and tunable values live here.

export const AppConfig = {
  APP_NAME: 'SnapTranscript',

  // ---- Debug ----
  // Set to false before App Store submission
  DEBUG_MODE: true,

  // ---- Gemini API ----
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
  GEMINI_UPLOAD_BASE: 'https://generativelanguage.googleapis.com/upload/v1beta',

  // ---- Storage keys ----
  STORAGE_KEYS: {
    API_KEY: 'gemini_api_key',
    UI_LANGUAGE: 'ui_language',
    TRANSCRIPTION_LANGUAGE: 'transcription_language',
    TRANSLATION_LANGUAGE: 'translation_language',
  },

  // ---- Audio processing (FFmpeg.wasm) ----
  // Using single-thread core (no SharedArrayBuffer needed — WKWebView compatible)
  FFMPEG_CORE_URL: 'https://unpkg.com/@ffmpeg/core-st@0.12.9/dist/esm/ffmpeg-core.js',
  FFMPEG_WASM_URL: 'https://unpkg.com/@ffmpeg/core-st@0.12.9/dist/esm/ffmpeg-core.wasm',
  AUDIO_BITRATE: '32k',
  SEGMENT_DURATION_SEC: 1800,   // 30 minutes
  MAX_SEGMENT_SIZE_MB: 100,     // Refuse if a single compressed segment exceeds this

  // ---- AdMob ----
  ADMOB_AD_UNIT_IOS: 'ca-app-pub-6861772624103964/4607229612',
  ADMOB_AD_UNIT_ANDROID: '',    // TODO: apply when Android version starts

  // ---- Languages ----
  // Transcription input languages (what language the audio is in)
  TRANSCRIPTION_LANGUAGES: [
    { code: 'auto', label: 'Auto Detect' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'th', label: 'ภาษาไทย' },
  ],

  // Translation target languages
  TRANSLATION_LANGUAGES: [
    { code: 'none', label: 'No Translation' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'th', label: 'ภาษาไทย' },
  ],

  // Default settings
  DEFAULT_TRANSCRIPTION_LANGUAGE: 'auto',
  DEFAULT_TRANSLATION_LANGUAGE: 'none',
};
