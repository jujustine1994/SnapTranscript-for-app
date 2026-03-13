// Debug logger — stores timestamped logs in memory for the in-app Debug Panel.
// When DEBUG_MODE is off, logs still go to console but nothing is stored in memory.

import { AppConfig } from '../config.js';

const MAX_ENTRIES = 500;
const _logs = [];

function _record(level, module, message, data) {
  const entry = {
    time: new Date().toISOString().substring(11, 23), // HH:MM:SS.mmm
    level,  // 'LOG' | 'WARN' | 'ERROR'
    module,
    message,
    data: data !== undefined ? String(
      typeof data === 'object' ? JSON.stringify(data) : data
    ) : '',
  };

  if (AppConfig.DEBUG_MODE) {
    _logs.push(entry);
    if (_logs.length > MAX_ENTRIES) _logs.shift();
    // Expose on window so DebugPanel can read without importing this module
    window.__debugLogs = _logs;
    // Notify DebugPanel to re-render if it's open
    window.dispatchEvent(new CustomEvent('debugLogAdded', { detail: entry }));
  }

  // Always write to native console (visible in Xcode dev builds)
  const prefix = `[${entry.time}][${module}]`;
  if (level === 'ERROR') console.error(prefix, message, data ?? '');
  else if (level === 'WARN')  console.warn(prefix, message, data ?? '');
  else                        console.log(prefix, message, data ?? '');
}

export const DebugLogger = {
  log:   (module, msg, data) => _record('LOG',   module, msg, data),
  warn:  (module, msg, data) => _record('WARN',  module, msg, data),
  error: (module, msg, data) => _record('ERROR', module, msg, data),
  getLogs: () => [..._logs],
  clear: () => { _logs.length = 0; },
};
