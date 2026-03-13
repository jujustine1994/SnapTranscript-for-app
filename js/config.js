// App-wide constants. All magic strings and tunable values live here.
// v1.0.1

export const AppConfig = {
  APP_NAME: 'SnapTranscript',

  // ---- Debug ----
  // Set to false before App Store submission
  DEBUG_MODE: true,

  // ---- Gemini API ----
  GEMINI_MODEL: 'gemini-flash-latest',
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
  // @ffmpeg/core@0.12.9 = single-thread build (no SharedArrayBuffer — WKWebView compatible)
  // Files served locally from www/ffmpeg/ (downloaded by scripts/download-ffmpeg.js)
  FFMPEG_CORE_URL: '/ffmpeg/ffmpeg-core.js',
  FFMPEG_WASM_URL: '/ffmpeg/ffmpeg-core.wasm',
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

  // UI display languages (must match keys in i18n_data.js)
  UI_LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en-US', label: 'English' },
    { code: 'ja-JP', label: '日本語' },
    { code: 'ko-KR', label: '한국어' },
    { code: 'vi-VN', label: 'Tiếng Việt' },
    { code: 'es-ES', label: 'Español' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'tl-PH', label: 'Filipino' },
    { code: 'id-ID', label: 'Bahasa Indonesia' },
  ],

  // Default settings
  DEFAULT_TRANSCRIPTION_LANGUAGE: 'auto',
  DEFAULT_TRANSLATION_LANGUAGE: 'none',
  DEFAULT_UI_LANGUAGE: 'zh-TW',
};
