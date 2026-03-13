// SettingsModal — API Key status, transcription language, translation language.

import { ModalComponent } from '../ModalComponent.js';
import { DebugLogger } from '../../utils/debug_logger.js';
import { ApiKeyService } from '../../api_key_service.js';
import { AppConfig } from '../../config.js';
import { Preferences } from '@capacitor/preferences';

const MODULE = 'SettingsModal';

export class SettingsModal extends ModalComponent {
  /**
   * @param {object} opts
   * @param {function} opts.onApiKey - callback to open ApiKeyModal
   */
  constructor({ onApiKey } = {}) {
    super('settings-modal');
    this._onApiKey = onApiKey;
  }

  render() {
    return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3>Settings</h3>
            <button class="close-btn">✕</button>
          </div>

          <div class="modal-body" style="padding: 0;">

            <!-- API Key section -->
            <div class="settings-section">
              <div class="settings-section-title">Gemini API</div>
              <div class="settings-row">
                <div>
                  <div class="settings-row-label">API Key</div>
                  <div class="settings-row-sub" id="settings-key-status">Checking…</div>
                </div>
                <button class="secondary-btn" id="settings-key-btn">Manage</button>
              </div>
            </div>

            <!-- Transcription defaults -->
            <div class="settings-section">
              <div class="settings-section-title">Defaults</div>
              <div class="settings-row">
                <div class="settings-row-label">Audio Language</div>
                <select class="setting-select" id="settings-audio-lang"></select>
              </div>
              <div class="settings-row">
                <div class="settings-row-label">Translate to</div>
                <select class="setting-select" id="settings-translate-lang"></select>
              </div>
            </div>

            <!-- About -->
            <div class="settings-section">
              <div class="settings-section-title">About</div>
              <div class="settings-row">
                <div class="settings-row-label">SnapTranscript</div>
                <div class="settings-row-sub">v1.0.0</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-sub" style="font-size:0.78rem;color:#475569;">Your API key is stored locally. No data passes through our servers.</div>
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
    const audioSel  = this.$('#settings-audio-lang');
    const transSel  = this.$('#settings-translate-lang');

    AppConfig.TRANSCRIPTION_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      audioSel?.appendChild(opt);
    });

    AppConfig.TRANSLATION_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code; opt.textContent = l.label;
      transSel?.appendChild(opt);
    });

    // Persist on change
    audioSel?.addEventListener('change', (e) => {
      Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE, value: e.target.value });
      DebugLogger.log(MODULE, 'audioLang saved', e.target.value);
    });
    transSel?.addEventListener('change', (e) => {
      Preferences.set({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE, value: e.target.value });
      DebugLogger.log(MODULE, 'transLang saved', e.target.value);
    });

    DebugLogger.log(MODULE, '_buildSelects done');
  }

  async _loadSavedLangs() {
    const [audio, trans] = await Promise.all([
      Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSCRIPTION_LANGUAGE }),
      Preferences.get({ key: AppConfig.STORAGE_KEYS.TRANSLATION_LANGUAGE }),
    ]);
    const audioSel = this.$('#settings-audio-lang');
    const transSel = this.$('#settings-translate-lang');
    if (audioSel && audio.value) audioSel.value = audio.value;
    if (transSel && trans.value) transSel.value = trans.value;
    DebugLogger.log(MODULE, '_loadSavedLangs', `audio=${audio.value} trans=${trans.value}`);
  }
}
