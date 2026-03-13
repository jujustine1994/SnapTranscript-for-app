// HistoryModal — list of saved transcripts. Tap to open in ResultView.

import { ModalComponent } from '../ModalComponent.js';
import { HistoryService } from '../../history_service.js';
import { DebugLogger } from '../../utils/debug_logger.js';

const MODULE = 'HistoryModal';

export class HistoryModal extends ModalComponent {
  /**
   * @param {object} opts
   * @param {function} opts.onOpen - callback(data) called when user taps an item
   */
  constructor({ onOpen } = {}) {
    super('history-modal');
    this._onOpen = onOpen;
  }

  render() {
    return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content">

          <div class="modal-header">
            <h3 data-i18n="history.title">History</h3>
            <button class="close-btn">✕</button>
          </div>

          <div class="modal-body history-modal-body">
            <div id="history-list" class="history-list"></div>
            <p class="history-empty hidden" id="history-empty" data-i18n="history.empty">No saved transcripts yet.</p>
          </div>

        </div>
      </div>
    `);
  }

  postMount() {
    super.postMount();
    DebugLogger.log(MODULE, 'mounted');
  }

  async show() {
    super.show();
    await this._loadList();
  }

  // ---- Private ----

  async _loadList() {
    DebugLogger.log(MODULE, '_loadList');
    const list    = this.$('#history-list');
    const emptyEl = this.$('#history-empty');
    list.innerHTML = '<p class="history-loading">Loading…</p>';

    try {
      const items = await HistoryService.list();
      DebugLogger.log(MODULE, '_loadList OK', `${items.length} items`);

      list.innerHTML = '';
      if (items.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
      }
      emptyEl.classList.add('hidden');
      items.forEach(meta => list.appendChild(this._renderItem(meta)));

    } catch (err) {
      DebugLogger.error(MODULE, '_loadList FAILED', err.message);
      list.innerHTML = `<p class="history-error">Error: ${err.message}</p>`;
    }
  }

  _renderItem(meta) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-item-info">
        <span class="history-item-name">${_esc(meta.audioFileName || 'Recording')}</span>
        <span class="history-item-date">${_fmtDate(meta.createdAt)}</span>
        <span class="history-item-tags">${meta.language || ''}${meta.hasTranslation ? ' · Translated' : ''}</span>
      </div>
      <div class="history-item-actions">
        <button class="history-open-btn">Open</button>
        <button class="history-del-btn" aria-label="Delete">🗑</button>
      </div>
    `;
    div.querySelector('.history-open-btn').addEventListener('click', () => this._openItem(meta.id));
    div.querySelector('.history-del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this._deleteItem(meta.id, div);
    });
    return div;
  }

  async _openItem(id) {
    DebugLogger.log(MODULE, '_openItem', id);
    try {
      const data = await HistoryService.load(id);
      DebugLogger.log(MODULE, '_openItem loaded OK');
      this.hide();
      this._onOpen?.(data);
    } catch (err) {
      DebugLogger.error(MODULE, '_openItem FAILED', err.message);
      alert('Failed to open: ' + err.message);
    }
  }

  async _deleteItem(id, el) {
    DebugLogger.log(MODULE, '_deleteItem', id);
    if (!confirm('Delete this transcript? This cannot be undone.')) return;
    try {
      await HistoryService.delete(id);
      el.remove();
      DebugLogger.log(MODULE, '_deleteItem OK', id);
      if (!this.$('#history-list').children.length) {
        this.$('#history-empty').classList.remove('hidden');
      }
    } catch (err) {
      DebugLogger.error(MODULE, '_deleteItem FAILED', err.message);
      alert('Delete failed: ' + err.message);
    }
  }
}

function _fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function _esc(str) {
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
