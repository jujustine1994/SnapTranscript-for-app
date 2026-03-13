// DebugPanel — floating overlay showing in-app logs.
// Trigger: tap the app title 5 times quickly.
// Only active when AppConfig.DEBUG_MODE === true.

import { BaseComponent } from './BaseComponent.js';
import { DebugLogger } from '../utils/debug_logger.js';
import { AppConfig } from '../config.js';

export class DebugPanel extends BaseComponent {
  constructor() {
    super('debug-panel');
    this._isVisible = false;
  }

  /** Call once after app init. Sets up the 5-tap trigger on the header title. */
  init() {
    if (!AppConfig.DEBUG_MODE) return;
    this.mount(document.body);

    // 5-tap trigger on the app title element
    const title = document.getElementById('app-title');
    if (!title) return;

    let tapCount = 0;
    let resetTimer = null;
    title.addEventListener('click', () => {
      tapCount++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { tapCount = 0; }, 1500);
      if (tapCount >= 5) {
        tapCount = 0;
        this._show();
      }
    });

    // Re-render when new log arrives (only if panel is open)
    window.addEventListener('debugLogAdded', () => {
      if (this._isVisible) this._renderLogs();
    });
  }

  render() {
    return this.createElementFromHTML(`
      <div id="debug-panel" class="debug-panel hidden">
        <div class="debug-panel-header">
          <span class="debug-panel-title">🐛 Debug Log</span>
          <div class="debug-panel-actions">
            <button id="debug-copy-btn" class="debug-action-btn">Copy</button>
            <button id="debug-clear-btn" class="debug-action-btn">Clear</button>
            <button id="debug-close-btn" class="debug-action-btn debug-close">✕</button>
          </div>
        </div>
        <div class="debug-log-list" id="debug-log-list"></div>
      </div>
    `);
  }

  postMount() {
    this.$('#debug-close-btn')?.addEventListener('click', () => this._hide());
    this.$('#debug-clear-btn')?.addEventListener('click', () => {
      DebugLogger.clear();
      this._renderLogs();
    });
    this.$('#debug-copy-btn')?.addEventListener('click', () => this._copyLogs());
  }

  // ---- Private ----

  _show() {
    this._renderLogs();
    this.element.classList.remove('hidden');
    this._isVisible = true;
  }

  _hide() {
    this.element.classList.add('hidden');
    this._isVisible = false;
  }

  _renderLogs() {
    const list = this.$('#debug-log-list');
    if (!list) return;
    const logs = DebugLogger.getLogs();
    if (logs.length === 0) {
      list.innerHTML = '<p class="debug-empty">No logs yet.</p>';
      return;
    }
    // Render newest at top
    list.innerHTML = [...logs].reverse().map(e => `
      <div class="debug-entry debug-${e.level.toLowerCase()}">
        <span class="debug-time">${e.time}</span>
        <span class="debug-module">[${e.module}]</span>
        <span class="debug-msg">${_escape(e.message)}</span>
        ${e.data ? `<span class="debug-data">${_escape(e.data)}</span>` : ''}
      </div>
    `).join('');
  }

  async _copyLogs() {
    const lines = DebugLogger.getLogs()
      .map(e => `${e.time} [${e.level}][${e.module}] ${e.message} ${e.data}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(lines);
      this.$('#debug-copy-btn').textContent = 'Copied!';
      setTimeout(() => { this.$('#debug-copy-btn').textContent = 'Copy'; }, 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }
}

function _escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
