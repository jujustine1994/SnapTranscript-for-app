// ApiKeyModal — UI for entering, viewing, and clearing the Gemini API Key.
// First thing user sees on launch if no key is set.

import { ModalComponent } from '../ModalComponent.js';
import { ApiKeyService } from '../../api_key_service.js';

export class ApiKeyModal extends ModalComponent {
  constructor() {
    super('api-key-modal');
  }

  render() {
    return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3 data-i18n="apikey.title">Gemini API Key</h3>
            <button class="close-btn" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">

            <!-- Privacy notice -->
            <div class="apikey-privacy-notice">
              <span class="apikey-privacy-icon">🔒</span>
              <p data-i18n="apikey.privacy_notice">Your key is stored only on this device. SnapTranscript never sees it — the app calls Gemini directly from your phone.</p>
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
                <button class="apikey-toggle-btn" id="apikey-toggle" aria-label="Show/hide key">👁</button>
              </div>
              <p class="field-hint" data-i18n="apikey.hint">Get your free key at <strong>aistudio.google.com</strong> → Get API key</p>
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
    super.postMount(); // binds .close-btn and outside-click from ModalComponent
    this._bindEvents();
    this._refreshStatus();
  }

  // ---- Status refresh ----

  async _refreshStatus() {
    const statusArea = this.$('#apikey-status-area');
    const inputGroup = this.$('#apikey-input-group');
    const saveBtn = this.$('#apikey-save-btn');
    const inputLabel = inputGroup?.querySelector('label');
    const hasKey = await ApiKeyService.hasKey();

    if (hasKey) {
      statusArea.innerHTML = `
        <div class="apikey-set-badge">
          <span>✅ API Key is set</span>
          <button class="danger-btn" id="apikey-clear-btn" data-i18n="apikey.remove">Remove Key</button>
        </div>
      `;
      statusArea.querySelector('#apikey-clear-btn')
        ?.addEventListener('click', () => this._clearKey());
      // Show input so user can replace key directly without removing first
      if (inputLabel) inputLabel.setAttribute('data-i18n', 'apikey.replace_label');
      if (inputLabel) inputLabel.textContent = 'Replace with a new key (optional)';
      inputGroup.classList.remove('hidden');
      saveBtn.classList.remove('hidden');
      saveBtn.setAttribute('data-i18n', 'apikey.replace');
      saveBtn.textContent = 'Replace Key';
    } else {
      statusArea.innerHTML = `<p class="apikey-not-set-hint" data-i18n="apikey.not_set">No API key set yet.</p>`;
      if (inputLabel) inputLabel.setAttribute('data-i18n', 'apikey.input_label');
      if (inputLabel) inputLabel.textContent = 'Paste your Gemini API Key';
      inputGroup.classList.remove('hidden');
      saveBtn.classList.remove('hidden');
      saveBtn.setAttribute('data-i18n', 'apikey.save');
      saveBtn.textContent = 'Save Key';
    }

    // Clear input field on refresh
    const input = this.$('#apikey-input');
    if (input) input.value = '';
    this.$('#apikey-error')?.classList.add('hidden');
  }

  // ---- Event binding ----

  _bindEvents() {
    // Toggle password visibility
    this.$('#apikey-toggle')?.addEventListener('click', () => {
      const input = this.$('#apikey-input');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // Validate format as user types
    this.$('#apikey-input')?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const errorEl = this.$('#apikey-error');
      // Only show error once user has typed enough to know it's wrong
      if (val.length >= 4 && !ApiKeyService.isValidFormat(val)) {
        errorEl.classList.remove('hidden');
      } else {
        errorEl.classList.add('hidden');
      }
    });

    // Save
    this.$('#apikey-save-btn')?.addEventListener('click', () => this._saveKey());
  }

  // ---- Actions ----

  async _saveKey() {
    const input = this.$('#apikey-input');
    const apiKey = input.value.trim();

    // If input is empty and a key already exists, just close
    const hasKey = await ApiKeyService.hasKey();
    if (!apiKey && hasKey) {
      this.hide();
      return;
    }

    if (!ApiKeyService.isValidFormat(apiKey)) {
      this.$('#apikey-error').classList.remove('hidden');
      return;
    }

    await ApiKeyService.save(apiKey);
    input.value = '';
    await this._refreshStatus();

    // Notify app.js that a key is now available
    window.dispatchEvent(new CustomEvent('apiKeySet'));
    this.hide();
  }

  async _clearKey() {
    await ApiKeyService.delete();
    await this._refreshStatus();
    window.dispatchEvent(new CustomEvent('apiKeyCleared'));
  }
}
