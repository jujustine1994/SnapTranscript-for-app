// ResultView — full-screen overlay showing transcription results.
// Tabs: Original · Translation · Summary · Polish
// Footer: Q&A input

import { BaseComponent } from '../components/BaseComponent.js';
import { DebugLogger } from '../utils/debug_logger.js';
import { TranscribeService } from '../transcribe_service.js';
import { HistoryService } from '../history_service.js';

const MODULE = 'ResultView';

export class ResultView extends BaseComponent {
  constructor() {
    super('result-view');
    this._data  = null;   // { original, translated, polished, summary, id, meta }
    this._saved = false;
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
          <button class="result-tab" data-tab="polished" data-i18n="result.polished">Polish</button>
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
            <p class="result-text selectable" id="text-summary"></p>
          </div>

          <div class="result-pane" id="pane-polished">
            <button class="ai-gen-btn" id="btn-gen-polished" data-i18n="result.gen_polished">✨ Generate Polished Version</button>
            <p class="result-text selectable" id="text-polished"></p>
          </div>
        </div>

        <!-- Q&A -->
        <div class="result-qa">
          <div class="result-qa-messages" id="qa-messages"></div>
          <div class="result-qa-row">
            <input class="result-qa-input selectable" id="qa-input" type="text" placeholder="Ask a question about this transcript…" data-i18n="result.qa_placeholder" />
            <button class="result-qa-send" id="qa-send-btn" data-i18n="result.qa_send">Ask</button>
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
  show(data) {
    DebugLogger.log(MODULE, 'show', `${data.original?.length} chars, translated=${!!data.translated}`);

    this._data = {
      original:   data.original   || '',
      translated: data.translated || null,
      polished:   data.polished   || null,
      summary:    data.summary    || null,
      id:         data.id         || null,
      meta:       data.meta       || {},
    };
    this._saved = !!data.id;

    // Populate text fields
    this.$('#text-original').textContent   = this._data.original;
    this.$('#text-translated').textContent = this._data.translated || '';
    this.$('#text-summary').textContent    = this._data.summary    || '';
    this.$('#text-polished').textContent   = this._data.polished   || '';

    // Translation tab: hide generate button if already translated
    const hasTranslation = !!this._data.translated;
    this.$('#btn-gen-translated').classList.toggle('hidden', hasTranslation);

    // Summary / Polish: show generate buttons (reset state)
    this.$('#btn-gen-summary').classList.toggle('hidden', !!this._data.summary);
    this.$('#btn-gen-polished').classList.toggle('hidden', !!this._data.polished);

    // Translation tab visibility
    this.$('#tab-translated').classList.toggle('tab-hidden', !hasTranslation && !this._data.meta?.targetLanguage);

    // Reset Q&A
    this.$('#qa-messages').innerHTML = '';
    this.$('#qa-input').value = '';

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

    this.$('#btn-gen-summary')?.addEventListener('click',    () => this._generate('summary'));
    this.$('#btn-gen-polished')?.addEventListener('click',   () => this._generate('polished'));
    this.$('#btn-gen-translated')?.addEventListener('click', () => this._generate('translated'));

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

  // ---- AI Generation ----

  async _generate(type) {
    DebugLogger.log(MODULE, `_generate ${type}`);
    const labels = { summary: 'Generating summary…', polished: 'Polishing transcript…', translated: 'Translating…' };
    this._showAiLoading(labels[type] || 'Generating…');

    try {
      let result;
      if (type === 'summary')    result = await TranscribeService.summarize(this._data.original);
      else if (type === 'polished') result = await TranscribeService.polish(this._data.original);
      else if (type === 'translated') {
        const lang = this._data.meta?.targetLanguage || 'en';
        result = await TranscribeService.translate(this._data.original, lang);
      }

      DebugLogger.log(MODULE, `_generate ${type} OK`, `${result.length} chars`);
      this._data[type] = result;
      this.$(`#text-${type}`).textContent = result;
      this.$(`#btn-gen-${type}`)?.classList.add('hidden');

      // Persist to disk if already saved
      if (this._saved && this._data.id && (type === 'summary' || type === 'polished')) {
        await HistoryService.saveExtra(this._data.id, type, result).catch(err => {
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
