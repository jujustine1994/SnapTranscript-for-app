// ResultView — full-screen overlay showing transcription results.
// Tabs: Original · Translation · Summary · Q&A
//
// State lifecycle:
//   show(data)       → populate from fresh transcription OR HistoryService.load()
//   _generate(type)  → call Gemini, update _data[type], persist to disk if already saved
//   _sendQuestion()  → call Gemini Q&A, append to _qaMessages, overwrite qa.txt
//   hide()           → slide out, data stays in memory until next show()
//
// Storage note: summary is auto-persisted via HistoryService.saveExtra().
// Q&A uses an overwrite strategy (full array each time), so _qaSavedBytes tracks
// the previous size to calculate the correct delta for storageSizeBytes.

import { BaseComponent } from '../components/BaseComponent.js';
import { DebugLogger } from '../utils/debug_logger.js';
import { TranscribeService } from '../transcribe_service.js';
import { HistoryService } from '../history_service.js';
import { AppConfig } from '../config.js';

const MODULE = 'ResultView';

export class ResultView extends BaseComponent {
  constructor() {
    super('result-view');
    this._data       = null;   // { original, translated, summary, qa, id, meta }
    this._saved      = false;
    this._qaMessages = [];     // [{ role: 'user'|'ai', text }]
    this._qaSavedBytes = 0;    // bytes of last saved qa.txt (for delta calculation)
  }

  render() {
    return this.createElementFromHTML(`
      <div id="result-view" class="result-view hidden">

        <!-- Header -->
        <div class="result-header">
          <button class="result-back-btn" id="result-back-btn" data-i18n="app.back">← Back</button>
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
            <button class="ai-gen-btn hidden" id="btn-gen-translated" data-i18n="result.gen_translation">✨ Generate Translation</button>
            <p class="result-text selectable" id="text-translated"></p>
          </div>

          <div class="result-pane" id="pane-summary">
            <button class="ai-gen-btn" id="btn-gen-summary" data-i18n="result.gen_summary">✨ Generate Summary</button>
            <div class="prompt-editor hidden" id="prompt-editor-summary">
              <p class="prompt-editor-hint" data-i18n="result.prompt_edit_hint">Edit the prompt before sending</p>
              <textarea class="prompt-editor-textarea" id="prompt-textarea-summary"></textarea>
              <div class="prompt-editor-actions">
                <button class="secondary-btn prompt-cancel-btn" data-type="summary" data-i18n="app.cancel">Cancel</button>
                <button class="primary-btn prompt-send-btn" data-type="summary" data-i18n="result.prompt_send">Send</button>
              </div>
            </div>
            <p class="result-text selectable" id="text-summary"></p>
            <button class="ai-regen-btn hidden" id="btn-regen-summary" data-i18n="result.regen">🔄 Regenerate</button>
          </div>

          <div class="result-pane result-pane-qa" id="pane-qa">
            <div class="result-qa-messages" id="qa-messages"></div>
            <div class="result-qa-row">
              <input class="result-qa-input selectable" id="qa-input" type="text" placeholder="Ask a question about this transcript…" data-i18n="result.qa_placeholder" />
              <button class="result-qa-send" id="qa-send-btn" data-i18n="result.qa_send">Ask</button>
            </div>
          </div>

        </div>

        <!-- AI loading overlay (inside result view) -->
        <div class="result-ai-loading hidden" id="result-ai-loading">
          <div class="spinner"></div>
          <p id="result-ai-text">Generating…</p>
        </div>

      </div>
    `);
  }

  postMount() {
    this._bindEvents();
    DebugLogger.log(MODULE, 'mounted');
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
    DebugLogger.log(MODULE, 'show', `${data.original?.length} chars, translated=${!!data.translated}`);

    this._data = {
      original:   data.original   || '',
      translated: data.translated || null,
      summary:    data.summary    || null,
      qa:         data.qa         || null,
      id:         data.id         || null,
      meta:       data.meta       || {},
    };
    this._saved = !!data.id;
    this._qaMessages   = Array.isArray(data.qa) ? [...data.qa] : [];
    this._qaSavedBytes = this._qaMessages.length
      ? new Blob([JSON.stringify(this._qaMessages)]).size : 0;

    // Populate text fields
    this.$('#text-original').textContent   = this._data.original;
    this.$('#text-translated').textContent = this._data.translated || '';
    this.$('#text-summary').textContent    = this._data.summary    || '';

    // Translation tab: hide generate button if already translated
    const hasTranslation = !!this._data.translated;
    this.$('#btn-gen-translated').classList.toggle('hidden', hasTranslation);

    // Summary: show generate or regen button depending on state
    this.$('#btn-gen-summary').classList.toggle('hidden', !!this._data.summary);
    this.$('#btn-regen-summary').classList.toggle('hidden', !this._data.summary);

    // Translation tab: hide entirely if neither translated content nor a target language is set
    // (prevents showing an empty tab with just a generate button when user didn't request translation)
    this.$('#tab-translated').classList.toggle('tab-hidden', !hasTranslation && !this._data.meta?.targetLanguage);

    // Restore Q&A history (if opened from saved record)
    this.$('#qa-messages').innerHTML = '';
    this.$('#qa-input').value = '';
    this._qaMessages.forEach(msg => this._appendQa(msg.role, msg.text));

    this._updateSaveBtn();
    this._switchTab('original');

    // Slide in
    this.element.classList.remove('hidden');
    requestAnimationFrame(() => this.element.classList.add('visible'));
    DebugLogger.log(MODULE, 'visible');
  }

  hide() {
    DebugLogger.log(MODULE, 'hide');
    this.element.classList.remove('visible');
    setTimeout(() => this.element.classList.add('hidden'), 300);
  }

  // ---- Events ----

  _bindEvents() {
    this.$('#result-back-btn')?.addEventListener('click',  () => {
      DebugLogger.log(MODULE, 'back');
      this.hide();
      window.dispatchEvent(new CustomEvent('resultClosed'));
    });

    this.$('#result-save-btn')?.addEventListener('click',  () => this._save());
    this.$('#result-share-btn')?.addEventListener('click', () => this._share());

    this.$('#result-tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) this._switchTab(tab.dataset.tab);
    });

    this.$('#btn-gen-summary')?.addEventListener('click',    () => this._showPromptEditor('summary'));
    this.$('#btn-gen-translated')?.addEventListener('click', () => this._generate('translated'));
    this.$('#btn-regen-summary')?.addEventListener('click',  () => this._showPromptEditor('summary'));

    // Prompt editor: send / cancel
    this.element.querySelectorAll('.prompt-send-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const customPrompt = this.$(`#prompt-textarea-${type}`)?.value?.trim() || null;
        this._hidePromptEditor(type);
        this._generate(type, customPrompt);
      });
    });
    this.element.querySelectorAll('.prompt-cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => this._hidePromptEditor(btn.dataset.type));
    });

    this.$('#qa-send-btn')?.addEventListener('click', () => this._sendQuestion());
    this.$('#qa-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._sendQuestion();
    });
  }

  _switchTab(name) {
    DebugLogger.log(MODULE, 'tab', name);
    this.element.querySelectorAll('.result-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    this.element.querySelectorAll('.result-pane').forEach(p => p.classList.toggle('active', p.id === `pane-${name}`));
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
      summary: `Extract all significant information from this transcript. Group the content under clear topic headings based on the discussion flow, with detailed nested bullet points under each heading. Capture key decisions, action items (with assignees and deadlines if mentioned), specific data or metrics, and important context. Include all relevant details, even minor ones. Write the output in ${outputLang}.`,
    };
    const textarea = this.$(`#prompt-textarea-${type}`);
    if (textarea) textarea.value = defaults[type] || '';
    this.$(`#btn-gen-${type}`)?.classList.add('hidden');
    this.$(`#btn-regen-${type}`)?.classList.add('hidden');
    this.$(`#prompt-editor-${type}`)?.classList.remove('hidden');
    textarea?.focus();
  }

  _hidePromptEditor(type) {
    this.$(`#prompt-editor-${type}`)?.classList.add('hidden');
    const hasContent = !!this._data[type];
    this.$(`#btn-gen-${type}`)?.classList.toggle('hidden', hasContent);
    this.$(`#btn-regen-${type}`)?.classList.toggle('hidden', !hasContent);
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
    DebugLogger.log(MODULE, `_generate ${type}`, customPrompt ? 'custom prompt' : 'default prompt');
    const labels = { summary: 'Generating summary…', translated: 'Translating…' };
    this._showAiLoading(labels[type] || 'Generating…');

    try {
      let result;
      if (type === 'summary') {
        const uiLangCode = localStorage.getItem(AppConfig.STORAGE_KEYS.UI_LANGUAGE) || AppConfig.DEFAULT_UI_LANGUAGE;
        const outputLang = _uiLangToOutputLang(uiLangCode);
        result = await TranscribeService.summarize(this._data.original, null, outputLang, customPrompt);
      } else if (type === 'translated') {
        const lang = this._data.meta?.targetLanguage || 'en';
        result = await TranscribeService.translate(this._data.original, lang);
      }

      DebugLogger.log(MODULE, `_generate ${type} OK`, `${result.length} chars`);
      const previousBytes = this._data[type] ? new Blob([this._data[type]]).size : 0;
      this._data[type] = result;
      this.$(`#text-${type}`).textContent = result;
      this.$(`#btn-gen-${type}`)?.classList.add('hidden');
      this.$(`#btn-regen-${type}`)?.classList.remove('hidden');

      // Persist to disk if already saved
      if (this._saved && this._data.id && type === 'summary') {
        await HistoryService.saveExtra(this._data.id, type, result, previousBytes).catch(err => {
          DebugLogger.warn(MODULE, 'saveExtra failed', err.message);
        });
      }
    } catch (err) {
      DebugLogger.error(MODULE, `_generate ${type} FAILED`, err.message);
      this.$(`#text-${type}`).textContent = `Error: ${err.message}`;
    }

    this._hideAiLoading();
  }

  // ---- Q&A ----

  async _sendQuestion() {
    const input = this.$('#qa-input');
    const q = input?.value?.trim();
    if (!q) return;
    DebugLogger.log(MODULE, '_sendQuestion', q.substring(0, 60));

    input.value = '';
    this._appendQa('user', q);
    const pendingEl = this._appendQa('ai', '…');

    try {
      const answer = await TranscribeService.askQuestion(this._data.original, q);
      DebugLogger.log(MODULE, '_sendQuestion answered', `${answer.length} chars`);
      pendingEl.textContent = answer;

      // Persist Q&A to disk — full array overwrite each time.
      // Pass _qaSavedBytes so saveExtra subtracts old size before adding new,
      // keeping storageSizeBytes accurate without re-reading the file.
      this._qaMessages.push({ role: 'user', text: q }, { role: 'ai', text: answer });
      if (this._saved && this._data.id) {
        const json = JSON.stringify(this._qaMessages);
        await HistoryService.saveExtra(this._data.id, 'qa', json, this._qaSavedBytes).catch(err => {
          DebugLogger.warn(MODULE, 'qa saveExtra failed', err.message);
        });
        this._qaSavedBytes = new Blob([json]).size; // track for next delta calculation
      }
    } catch (err) {
      DebugLogger.error(MODULE, '_sendQuestion FAILED', err.message);
      pendingEl.textContent = `Error: ${err.message}`;
    }
  }

  _appendQa(role, text) {
    const msgs = this.$('#qa-messages');
    const div  = document.createElement('div');
    div.className = `qa-bubble qa-${role}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  // ---- Save & Share ----

  async _save() {
    if (this._saved) return;
    DebugLogger.log(MODULE, '_save');
    this._showAiLoading('Saving…');
    try {
      const id = await HistoryService.save({
        ...this._data.meta,
        original:   this._data.original,
        translated: this._data.translated,
      });
      this._data.id = id;
      this._saved   = true;
      this._updateSaveBtn();
      DebugLogger.log(MODULE, '_save OK', id);
    } catch (err) {
      DebugLogger.error(MODULE, '_save FAILED', err.message);
      alert('Save failed: ' + err.message);
    }
    this._hideAiLoading();
  }

  async _share() {
    DebugLogger.log(MODULE, '_share');
    const activeTab  = this.element.querySelector('.result-tab.active')?.dataset?.tab || 'original';
    const shareText  = this._data[activeTab] || this._data.original;
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        DebugLogger.log(MODULE, '_share native OK');
      } else {
        await navigator.clipboard.writeText(shareText);
        DebugLogger.log(MODULE, '_share clipboard fallback OK');
        alert('Copied to clipboard');
      }
    } catch (err) {
      DebugLogger.warn(MODULE, '_share failed', err.message);
    }
  }

  _updateSaveBtn() {
    const btn = this.$('#result-save-btn');
    if (!btn) return;
    btn.textContent = this._saved ? '✓ Saved' : 'Save';
    btn.disabled    = this._saved;
  }

  _showAiLoading(text) {
    this.$('#result-ai-text').textContent = text;
    this.$('#result-ai-loading').classList.remove('hidden');
  }

  _hideAiLoading() {
    this.$('#result-ai-loading').classList.add('hidden');
  }
}

// Map UI language code → human-readable name for AI prompt
function _uiLangToOutputLang(code) {
  const map = {
    'zh-TW': 'Traditional Chinese (繁體中文)',
    'zh-CN': 'Simplified Chinese (简体中文)',
    'en-US': 'English',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'vi-VN': 'Vietnamese',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'tl-PH': 'Filipino',
    'id-ID': 'Indonesian',
  };
  return map[code] || 'English';
}
