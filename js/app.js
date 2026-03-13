// App entry point — initializes all services and wires all slices together.

import { AppConfig }       from './config.js';
import { DebugLogger }     from './utils/debug_logger.js';
import { DebugPanel }      from './components/DebugPanel.js';
import { LanguageManager } from './language_manager.js';
import { ApiKeyService }   from './api_key_service.js';
import { FFmpegService }   from './ffmpeg_service.js';
import { TranscribeService } from './transcribe_service.js';
import { AdMobService }    from './admob_service.js';
import { HistoryService }  from './history_service.js';
import { RecorderService } from './recorder_service.js';

import { ApiKeyModal }      from './components/modals/ApiKeyModal.js';
import { SettingsModal }    from './components/modals/SettingsModal.js';
import { PrivacyInfoModal } from './components/modals/PrivacyInfoModal.js';
import { ResultView }       from './views/ResultView.js';
import { HistoryView }      from './views/HistoryView.js';

// ---- App ----

class App {
  constructor() {
    // Components
    this.debugPanel    = new DebugPanel();
    this.lang          = new LanguageManager();
    this.apiKeyModal   = new ApiKeyModal();
    this.settingsModal = new SettingsModal({
      onApiKey:     () => this.apiKeyModal.show(),
      onLangChange: (code) => {
        DebugLogger.log('App', 'UI lang change', code);
        this.lang.setLanguage(code);
      },
    });
    this.historyView      = new HistoryView({ onOpen: (data) => this.resultView.show(data) });
    this.privacyInfoModal = new PrivacyInfoModal();
    this.resultView       = new ResultView();

    // State
    this._selectedFile = null;
    this._fileDuration = 0;
    this._processing   = false;
    this._cancelFlag   = false;
    this._recording    = false;
    this._recTimerEl   = null;
  }

  async init() {
    // DebugPanel first — captures all subsequent logs
    this.debugPanel.init();
    DebugLogger.log('App', 'init start', `platform=${navigator.platform} debug=${AppConfig.DEBUG_MODE}`);

    // i18n
    this.lang.init();
    DebugLogger.log('App', 'lang init', this.lang.currentLang);

    // Mount UI components
    this.apiKeyModal.mount(document.body);
    this.settingsModal.mount(document.body);
    this.privacyInfoModal.mount(document.body);
    this.resultView.mount(document.body);
    this.historyView.init();
    DebugLogger.log('App', 'components mounted');

    // Translate all mounted DOM elements to the current UI language
    this.lang.translatePage();

    // AdMob init (non-fatal)
    AdMobService.initialize();

    // Wire all UI events
    this._bindUIEvents();

    // API key check
    const hasKey = await ApiKeyService.hasKey();
    DebugLogger.log('App', 'hasKey', hasKey);
    if (!hasKey) {
      this.apiKeyModal.show();
    } else {
      this._setPickerEnabled(true);
    }

    // Pre-load first interstitial while user reads instructions
    AdMobService.prepareInterstitial();

    DebugLogger.log('App', 'init complete');
  }

  // ---- UI Event Wiring ----

  _bindUIEvents() {
    DebugLogger.log('App', '_bindUIEvents');

    // Header buttons
    document.getElementById('settings-btn')
      ?.addEventListener('click', () => {
        DebugLogger.log('App', 'settings-btn click');
        this.settingsModal.show();
      });

    document.getElementById('privacy-btn')
      ?.addEventListener('click', () => {
        DebugLogger.log('App', 'privacy-btn click');
        this.privacyInfoModal.show();
      });

    // Tab bar
    document.getElementById('tab-home')?.addEventListener('click', () => this._switchTab('home'));
    document.getElementById('tab-history')?.addEventListener('click', () => this._switchTab('history'));

    // API key lifecycle
    window.addEventListener('apiKeySet',     () => { DebugLogger.log('App', 'apiKeySet'); this._setPickerEnabled(true); });
    window.addEventListener('apiKeyCleared', () => { DebugLogger.log('App', 'apiKeyCleared'); this._setPickerEnabled(false); this._resetFileSelection(); });

    // Recording
    document.getElementById('record-btn')
      ?.addEventListener('click', () => this._startRecording());

    document.getElementById('stop-record-btn')
      ?.addEventListener('click', () => this._stopRecording());

    // File picker
    document.getElementById('audio-file-input')
      ?.addEventListener('change', (e) => this._onFileSelected(e));

    document.getElementById('change-file-btn')
      ?.addEventListener('click',  () => this._resetFileSelection());

    // Translation toggle
    document.getElementById('translate-toggle')
      ?.addEventListener('change', (e) => {
        const row = document.getElementById('translate-lang-row');
        row?.classList.toggle('hidden', !e.target.checked);
        DebugLogger.log('App', 'translate toggle', e.target.checked);
      });

    // Populate translation language dropdown
    this._buildTranslateLangSelect();

    // Start transcription
    document.getElementById('main-cta')
      ?.addEventListener('click', () => this._startTranscription());

    // Cancel processing
    document.getElementById('processing-cancel-btn')
      ?.addEventListener('click', () => {
        DebugLogger.log('App', 'cancel requested');
        this._cancelFlag = true;
      });

    // ResultView closed → ready for next file
    window.addEventListener('resultClosed', () => {
      DebugLogger.log('App', 'resultClosed');
    });
  }

  _switchTab(tab) {
    DebugLogger.log('App', '_switchTab', tab);
    document.getElementById('page-home')?.classList.toggle('active', tab === 'home');
    document.getElementById('page-home')?.classList.toggle('hidden', tab !== 'home');
    document.getElementById('page-history')?.classList.toggle('active', tab === 'history');
    document.getElementById('page-history')?.classList.toggle('hidden', tab !== 'history');
    document.getElementById('tab-home')?.classList.toggle('active', tab === 'home');
    document.getElementById('tab-history')?.classList.toggle('active', tab === 'history');
    if (tab === 'history') this.historyView.activate();
  }

  _buildTranslateLangSelect() {
    const sel = document.getElementById('translate-lang-select');
    if (!sel) return;
    AppConfig.TRANSLATION_LANGUAGES.filter(l => l.code !== 'none').forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      sel.appendChild(opt);
    });
    DebugLogger.log('App', '_buildTranslateLangSelect', `${sel.options.length} options`);
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
    DebugLogger.log('App', '_handleFile', `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB type=${file.type}`);

    this._fileDuration = await this._getAudioDuration(file);
    DebugLogger.log('App', 'duration', `${this._fileDuration.toFixed(1)}s`);

    // Update UI
    const nameEl = document.getElementById('file-name');
    const durEl  = document.getElementById('file-duration');
    if (nameEl) nameEl.textContent = file.name;
    if (durEl)  durEl.textContent  = _fmtDuration(this._fileDuration);

    document.getElementById('audio-picker-section')?.classList.add('hidden');
    document.getElementById('recording-section')?.classList.add('hidden');
    document.getElementById('file-info-section')?.classList.remove('hidden');

    const hasKey = await ApiKeyService.hasKey();
    DebugLogger.log('App', 'hasKey at file select', hasKey);
    if (hasKey) document.getElementById('main-cta')?.removeAttribute('disabled');
  }

  // ---- Recording ----

  async _startRecording() {
    if (this._recording) return;

    if (!RecorderService.isSupported()) {
      alert('Recording is not supported in this browser.');
      return;
    }

    DebugLogger.log('App', '_startRecording');

    try {
      this._recording = true;
      this._recTimerEl = document.getElementById('recording-timer');

      // Show recording section, hide picker
      document.getElementById('audio-picker-section')?.classList.add('hidden');
      document.getElementById('recording-section')?.classList.remove('hidden');

      await RecorderService.start((elapsed) => {
        if (this._recTimerEl) {
          const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
          const s = String(elapsed % 60).padStart(2, '0');
          this._recTimerEl.textContent = `${m}:${s}`;
        }
      });
    } catch (err) {
      DebugLogger.error('App', '_startRecording FAILED', err.message);
      this._recording = false;
      document.getElementById('recording-section')?.classList.add('hidden');
      document.getElementById('audio-picker-section')?.classList.remove('hidden');
      alert(`Could not access microphone:\n${err.message}`);
    }
  }

  async _stopRecording() {
    if (!this._recording) return;
    DebugLogger.log('App', '_stopRecording');

    this._recording = false;

    try {
      const blob = await RecorderService.stop();

      // Convert blob to File so the existing pipeline can handle it
      const ext  = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      const ts   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const file = new File([blob], `recording-${ts}.${ext}`, { type: blob.type });

      DebugLogger.log('App', '_stopRecording blob→file', `${file.name} ${(file.size/1024).toFixed(1)}KB`);

      // Reset timer display for next time
      if (this._recTimerEl) this._recTimerEl.textContent = '00:00';

      await this._handleFile(file);
    } catch (err) {
      DebugLogger.error('App', '_stopRecording FAILED', err.message);
      document.getElementById('recording-section')?.classList.add('hidden');
      document.getElementById('audio-picker-section')?.classList.remove('hidden');
      alert(`Recording failed:\n${err.message}`);
    }
  }

  _resetFileSelection() {
    DebugLogger.log('App', '_resetFileSelection');
    this._selectedFile = null;
    this._fileDuration = 0;
    const input = document.getElementById('audio-file-input');
    if (input) input.value = '';
    // If user pressed Change while recording was in progress, cancel it
    if (this._recording) {
      this._recording = false;
      RecorderService.cancel();
    }
    document.getElementById('file-info-section')?.classList.add('hidden');
    document.getElementById('recording-section')?.classList.add('hidden');
    document.getElementById('audio-picker-section')?.classList.remove('hidden');
    document.getElementById('main-cta')?.setAttribute('disabled', 'true');
  }

  _setPickerEnabled(enabled) {
    DebugLogger.log('App', '_setPickerEnabled', enabled);
    const label     = document.querySelector('.audio-upload-label');
    const input     = document.getElementById('audio-file-input');
    const recordBtn = document.getElementById('record-btn');
    if (label)     label.style.opacity = enabled ? '1' : '0.4';
    if (input)     input.disabled = !enabled;
    if (recordBtn) recordBtn.disabled = !enabled;
  }

  // ---- Transcription Pipeline (Slices 3–5) ----

  async _startTranscription() {
    if (!this._selectedFile) {
      DebugLogger.warn('App', '_startTranscription: no file');
      return;
    }
    if (this._processing) {
      DebugLogger.warn('App', '_startTranscription: already processing');
      return;
    }

    DebugLogger.log('App', '=== START TRANSCRIPTION ===', this._selectedFile.name);

    const translateOn  = document.getElementById('translate-toggle')?.checked || false;
    const targetLang   = document.getElementById('translate-lang-select')?.value || 'zh-TW';
    const audioLang    = AppConfig.DEFAULT_TRANSCRIPTION_LANGUAGE;

    DebugLogger.log('App', 'options', `translate=${translateOn} target=${targetLang} lang=${audioLang}`);

    this._processing = true;
    this._cancelFlag = false;
    this._showProcessing(true);

    try {
      // ---- Slice 3: FFmpeg compress + split ----
      this._updateProgress({ stage: 'compressing', percent: 0, detail: 'Preparing FFmpeg…' });
      DebugLogger.log('App', 'SLICE 3: FFmpeg start');

      const segments = await FFmpegService.processAudio(
        this._selectedFile,
        (p) => {
          DebugLogger.log('App', 'ffmpeg progress', `${p.percent}% ${p.detail}`);
          this._updateProgress(p);
        }
      );

      DebugLogger.log('App', 'SLICE 3 done', `${segments.length} segments`);

      // Check cancel between slices — FFmpeg runs synchronously in WASM so
    // _cancelFlag is only checked at safe handoff points, not mid-compression.
      if (this._cancelFlag) throw new Error('Cancelled by user');

      // ---- Slice 4: Gemini transcription ----
      DebugLogger.log('App', 'SLICE 4: Gemini transcription start');

      const result = await TranscribeService.transcribeAll(
        segments,
        { language: audioLang, translate: translateOn, targetLanguage: targetLang },
        (p) => {
          DebugLogger.log('App', 'transcribe progress', `${p.percent}% ${p.detail}`);
          this._updateProgress(p);
        }
      );

      DebugLogger.log('App', 'SLICE 4 done', `original=${result.original.length} translated=${result.translated?.length || 0}`);

      if (this._cancelFlag) throw new Error('Cancelled by user');

      // ---- Slice 5: Show AdMob + ResultView ----
      DebugLogger.log('App', 'SLICE 5: show ad + result');

      this._showProcessing(false);
      this._processing = false;

      // Show interstitial ad (non-fatal)
      await AdMobService.showInterstitial();

      // Pre-load next ad for next session
      AdMobService.prepareInterstitial();

      // Auto-save to history before showing ResultView so that:
      // 1. User never loses a transcript by accidentally navigating away
      // 2. ResultView receives an id → _saved = true → "✓ Saved" shown immediately
      // Failure is non-fatal — user can still see and manually save the result.
      let historyId = null;
      try {
        historyId = await HistoryService.save({
          audioFileName:  this._selectedFile.name,
          durationSec:    this._fileDuration,
          language:       audioLang,
          targetLanguage: translateOn ? targetLang : null,
          original:       result.original,
          translated:     result.translated,
        });
        DebugLogger.log('App', 'auto-saved to history', historyId);
      } catch (err) {
        DebugLogger.warn('App', 'auto-save failed (non-fatal)', err.message);
      }

      // Show result
      this.resultView.show({
        original:   result.original,
        translated: result.translated,
        id:         historyId,
        meta: {
          audioFileName:  this._selectedFile.name,
          durationSec:    this._fileDuration,
          language:       audioLang,
          hasTranslation: !!result.translated,
          targetLanguage: translateOn ? targetLang : null,
        },
      });

      DebugLogger.log('App', '=== TRANSCRIPTION COMPLETE ===');

    } catch (err) {
      DebugLogger.error('App', '_startTranscription FAILED', err.message);
      this._showProcessing(false);
      this._processing = false;

      if (err.message !== 'Cancelled by user') {
        alert(`Transcription failed:\n${err.message}`);
      }
    }
  }

  // ---- Processing Overlay ----

  _showProcessing(show) {
    DebugLogger.log('App', '_showProcessing', show);
    document.getElementById('processing-overlay')?.classList.toggle('hidden', !show);
    // Reset progress bar
    if (show) {
      this._updateProgress({ stage: 'preparing', percent: 0, detail: 'Starting…' });
    }
  }

  _updateProgress({ stage, percent, detail }) {
    const stageEl  = document.getElementById('processing-stage');
    const fillEl   = document.getElementById('processing-fill');
    const detailEl = document.getElementById('processing-detail');

    const stageLabels = {
      loading:      'Loading FFmpeg…',
      compressing:  'Compressing audio…',
      uploading:    'Uploading to Gemini…',
      transcribing: 'Transcribing…',
      translating:  'Translating…',
      done:         'Complete!',
    };

    if (stageEl)  stageEl.textContent     = stageLabels[stage] || stage;
    if (fillEl)   fillEl.style.width      = `${percent}%`;
    if (detailEl) detailEl.textContent    = detail || '';
  }

  // ---- Helpers ----

  _getAudioDuration(file) {
    return new Promise((resolve) => {
      const url   = URL.createObjectURL(file);
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(audio.duration); };
      audio.onerror          = () => { URL.revokeObjectURL(url); resolve(0); };
      audio.src = url;
    });
  }
}

// ---- Boot ----

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// ---- Utility ----

function _fmtDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds === Infinity) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
