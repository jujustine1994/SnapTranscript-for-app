// HistoryView — manages the #page-history tab page (search, rename, delete, open).

import { HistoryService } from '../history_service.js';
import { DebugLogger } from '../utils/debug_logger.js';

const MODULE = 'HistoryView';

export class HistoryView {
  /**
   * @param {object} opts
   * @param {function} opts.onOpen - callback(data) when user opens a transcript
   */
  constructor({ onOpen } = {}) {
    this._onOpen    = onOpen;
    this._allItems  = [];  // full list cache for search filtering
  }

  /** Call once after DOM is ready. Binds static event listeners. */
  init() {
    document.getElementById('history-search')
      ?.addEventListener('input', (e) => this._filterList(e.target.value.trim()));
    DebugLogger.log(MODULE, 'init');
  }

  /** Called when the History tab becomes active. Refreshes the list. */
  async activate() {
    DebugLogger.log(MODULE, 'activate');
    const searchInput = document.getElementById('history-search');
    if (searchInput) searchInput.value = '';
    await this._loadList();
  }

  // ---- Private ----

  async _loadList() {
    const list    = document.getElementById('history-list');
    const emptyEl = document.getElementById('history-empty');
    if (!list) return;

    list.innerHTML = '<p class="history-loading">Loading…</p>';
    if (emptyEl) emptyEl.classList.add('hidden');

    try {
      this._allItems = await HistoryService.list();
      DebugLogger.log(MODULE, '_loadList OK', `${this._allItems.length} items`);
      this._renderList(this._allItems);
    } catch (err) {
      DebugLogger.error(MODULE, '_loadList FAILED', err.message);
      list.innerHTML = `<p class="history-error">Error: ${err.message}</p>`;
    }
  }

  _filterList(query) {
    if (!query) { this._renderList(this._allItems); return; }
    const q = query.toLowerCase();
    this._renderList(this._allItems.filter(m =>
      (m.audioFileName || '').toLowerCase().includes(q)
    ));
  }

  _renderList(items) {
    const list    = document.getElementById('history-list');
    const emptyEl = document.getElementById('history-empty');
    if (!list) return;

    list.innerHTML = '';
    if (items.length === 0) {
      emptyEl?.classList.remove('hidden');
      return;
    }
    emptyEl?.classList.add('hidden');
    items.forEach(meta => list.appendChild(this._renderItem(meta)));
  }

  _renderItem(meta) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.dataset.id = meta.id;

    const nameRow = document.createElement('div');
    nameRow.className = 'history-item-name-row';
    nameRow.appendChild(this._buildNameDisplay(meta));

    const dateEl = document.createElement('span');
    dateEl.className = 'history-item-date';
    dateEl.textContent = _fmtDate(meta.createdAt);

    const tagsEl = document.createElement('span');
    tagsEl.className = 'history-item-tags';
    tagsEl.textContent = [
      meta.language || '',
      meta.hasTranslation ? 'Translated' : '',
      meta.storageSizeBytes ? _fmtSize(meta.storageSizeBytes) : '',
    ].filter(Boolean).join(' · ');

    const infoEl = document.createElement('div');
    infoEl.className = 'history-item-info';
    infoEl.appendChild(nameRow);
    infoEl.appendChild(dateEl);
    infoEl.appendChild(tagsEl);

    const actionsEl = document.createElement('div');
    actionsEl.className = 'history-item-actions';
    actionsEl.innerHTML = `
      <button class="history-open-btn">Open</button>
      <button class="history-del-btn" aria-label="Delete">🗑</button>
    `;

    div.appendChild(infoEl);
    div.appendChild(actionsEl);

    actionsEl.querySelector('.history-open-btn').addEventListener('click', () => this._openItem(meta.id));
    actionsEl.querySelector('.history-del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this._deleteItem(meta.id, div);
    });

    return div;
  }

  /** Build the name span + rename button (or returns a DocumentFragment). */
  _buildNameDisplay(meta) {
    const frag = document.createDocumentFragment();

    const nameSpan = document.createElement('span');
    nameSpan.className = 'history-item-name';
    nameSpan.textContent = meta.audioFileName || 'Recording';

    const renameBtn = document.createElement('button');
    renameBtn.className = 'history-rename-btn';
    renameBtn.setAttribute('aria-label', 'Rename');
    renameBtn.textContent = '✏️';
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._startRename(meta, nameSpan.closest('.history-item-name-row'));
    });

    frag.appendChild(nameSpan);
    frag.appendChild(renameBtn);
    return frag;
  }

  _startRename(meta, nameRow) {
    const currentName = meta.audioFileName || 'Recording';
    nameRow.innerHTML = '';

    const input = document.createElement('input');
    input.className = 'history-rename-input';
    input.value = currentName;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'history-rename-save-btn';
    saveBtn.textContent = '✓';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'history-rename-cancel-btn';
    cancelBtn.textContent = '✕';

    nameRow.appendChild(input);
    nameRow.appendChild(saveBtn);
    nameRow.appendChild(cancelBtn);

    input.focus();
    input.select();

    const restore = () => {
      nameRow.innerHTML = '';
      nameRow.appendChild(this._buildNameDisplay(meta));
    };

    const save = async () => {
      const newName = input.value.trim();
      if (!newName) { restore(); return; }
      try {
        await HistoryService.updateFileName(meta.id, newName);
        meta.audioFileName = newName;
        // Update cache
        const cached = this._allItems.find(m => m.id === meta.id);
        if (cached) cached.audioFileName = newName;
        DebugLogger.log(MODULE, 'rename OK', newName);
      } catch (err) {
        DebugLogger.error(MODULE, 'rename FAILED', err.message);
      }
      restore();
    };

    saveBtn.addEventListener('click', save);
    cancelBtn.addEventListener('click', restore);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  save();
      if (e.key === 'Escape') restore();
    });
  }

  async _openItem(id) {
    DebugLogger.log(MODULE, '_openItem', id);
    try {
      const data = await HistoryService.load(id);
      DebugLogger.log(MODULE, '_openItem loaded OK');
      this._onOpen?.(data);
    } catch (err) {
      DebugLogger.error(MODULE, '_openItem FAILED', err.message);
      alert('Failed to open: ' + err.message);
    }
  }

  async _deleteItem(id, el) {
    if (!confirm('Delete this transcript? This cannot be undone.')) return;
    try {
      await HistoryService.delete(id);
      el.remove();
      this._allItems = this._allItems.filter(m => m.id !== id);
      if (!document.getElementById('history-list').children.length) {
        document.getElementById('history-empty')?.classList.remove('hidden');
      }
      DebugLogger.log(MODULE, '_deleteItem OK', id);
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

function _fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function _esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
