// SettingsModal — App UI language, API Key status, transcription/translation defaults.

import { ModalComponent } from '../ModalComponent.js';
import { DebugLogger } from '../../utils/debug_logger.js';
import { ApiKeyService } from '../../api_key_service.js';
import { AppConfig } from '../../config.js';
import { Preferences } from '@capacitor/preferences';

const MODULE = 'SettingsModal';

export class SettingsModal extends ModalComponent {
  /**
   * @param {object} opts
   * @param {function} opts.onApiKey    - callback to open ApiKeyModal
   * @param {function} opts.onLangChange - callback(langCode) when UI language changes
   */
  constructor({ onApiKey, onLangChange } = {}) {
    super('settings-modal');
    this._onApiKey     = onApiKey;
    this._onLangChange = onLangChange;
  }

  render() {
    return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3 data-i18n="settings.title">Settings</h3>
            <button class="close-btn">✕</button>
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
                  <div class="settings-row-sub" id="settings-key-status">Checking…</div>
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
    this.$('#settings-key-btn')?.addEventListener('click', () => {
      this.hide();
      this._onApiKey?.();
    });
    DebugLogger.log(MODULE, 'mounted');
  }

  async show() {
    super.show();
    await this._refreshKeyStatus();
    await this._loadSavedLangs();
    DebugLogger.log(MODULE, 'show');
  }

  // ---- Private ----

  async _refreshKeyStatus() {
    const hasKey   = await ApiKeyService.hasKey();
    const statusEl = this.$('#settings-key-status');
    if (statusEl) {
      statusEl.textContent = hasKey ? '✅ Key is set' : '❌ No key — tap Manage';
      statusEl.style.color = hasKey ? 'var(--success-color)' : 'var(--danger-color)';
    }
    DebugLogger.log(MODULE, 'keyStatus', hasKey);
  }

  _buildSelects() {
    const uiSel    = this.$('#settings-ui-lang');
    const audioSel = this.$('#settings-audio-lang');
    const transSel = this.$('#settings-translate-lang');

    // UI language options
    AppConfig.UI_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      uiSel?.appendChild(opt);
    });

    // Transcription language options
    AppConfig.TRANSCRIPTION_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      audioSel?.appendChild(opt);
    });

    // Translation target language options
    AppConfig.TRANSLATION_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      transSel?.appendChild(opt);
    });

    // UI language change → save + notify app to re-render
    uiSel?.addEventListener('change', (e) => {
      const code = e.target.value;
      DebugLogger.log(MODULE, 'UI lang changed', code);
      Preferences.set({ key: AppConfig.STORAGE_KEYS.UI_LANGUAGE, value: code });
      this._onLangChange?.(code);
    });

    // Transcription language change → save only
    audioSel?.addEventListener('change', (e) => {
      Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE, value: e.target.value });
      DebugLogger.log(MODULE, 'audioLang saved', e.target.value);
    });

    // Translation target language change → save only
    transSel?.addEventListener('change', (e) => {
      Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE, value: e.target.value });
      DebugLogger.log(MODULE, 'transLang saved', e.target.value);
    });

    DebugLogger.log(MODULE, '_buildSelects done');
  }

  async _loadSavedLangs() {
    const [ui, audio, trans] = await Promise.all([
      Preferences.get({ key: AppConfig.STORAGE_KEYS.UI_LANGUAGE }),
      Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE }),
      Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE }),
    ]);

    const uiSel    = this.$('#settings-ui-lang');
    const audioSel = this.$('#settings-audio-lang');
    const transSel = this.$('#settings-translate-lang');

    // Fallback to zh-TW if nothing saved yet
    if (uiSel)    uiSel.value    = ui.value    || AppConfig.DEFAULT_UI_LANGUAGE;
    if (audioSel) audioSel.value = audio.value || AppConfig.DEFAULT_TRANSCRIPTION_LANGUAGE;
    if (transSel) transSel.value = trans.value || AppConfig.DEFAULT_TRANSLATION_LANGUAGE;

    DebugLogger.log(MODULE, '_loadSavedLangs', `ui=${ui.value} audio=${audio.value} trans=${trans.value}`);
  }
}
