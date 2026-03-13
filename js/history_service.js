// HistoryService — save, load, list, delete transcripts using Capacitor Filesystem.
// Storage path: Documents/SnapTranscript/transcripts/{id}/

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { DebugLogger } from './utils/debug_logger.js';

const MODULE  = 'History';
const BASE_DIR = 'SnapTranscript/transcripts';

export const HistoryService = {

  /**
   * Save a new transcript entry.
   * @param {object} data - { audioFileName, durationSec, language, targetLanguage, original, translated }
   * @returns {string} id
   */
  async save(data) {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const dir = `${BASE_DIR}/${id}`;

    DebugLogger.log(MODULE, 'save', id);

    const originalBytes   = new Blob([data.original   || '']).size;
    const translatedBytes = new Blob([data.translated || '']).size;

    const meta = {
      id,
      audioFileName:    data.audioFileName  || 'recording',
      durationSec:      data.durationSec    || 0,
      language:         data.language       || 'auto',
      hasTranslation:   !!data.translated,
      targetLanguage:   data.targetLanguage || null,
      createdAt:        new Date().toISOString(),
      originalLength:   (data.original || '').length,
      storageSizeBytes: originalBytes + translatedBytes,
    };

    try {
      await _write(`${dir}/meta.json`,     JSON.stringify(meta));
      await _write(`${dir}/original.txt`,  data.original   || '');
      if (data.translated) {
        await _write(`${dir}/translated.txt`, data.translated);
      }
      DebugLogger.log(MODULE, 'save OK', id);
      return id;
    } catch (err) {
      DebugLogger.error(MODULE, 'save FAILED', err.message);
      throw err;
    }
  },

  /**
   * List all saved transcripts (metadata only), newest first.
   * @returns {object[]}
   */
  async list() {
    DebugLogger.log(MODULE, 'list');
    try {
      const result = await Filesystem.readdir({ path: BASE_DIR, directory: Directory.Documents });

      const items = [];
      for (const entry of result.files) {
        try {
          const raw = await Filesystem.readFile({
            path: `${BASE_DIR}/${entry.name}/meta.json`,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
          items.push(JSON.parse(raw.data));
        } catch (e) {
          DebugLogger.warn(MODULE, 'list: skip bad entry', entry.name);
        }
      }

      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      DebugLogger.log(MODULE, 'list OK', `${items.length} items`);
      return items;

    } catch (err) {
      // Directory not created yet = no history
      if (_isNotFound(err)) {
        DebugLogger.log(MODULE, 'list: no history directory yet');
        return [];
      }
      DebugLogger.error(MODULE, 'list FAILED', err.message);
      throw err;
    }
  },

  /**
   * Load a full transcript record by id.
   * @returns {object} meta + original + translated? + polished? + summary?
   */
  async load(id) {
    DebugLogger.log(MODULE, 'load', id);
    const dir = `${BASE_DIR}/${id}`;

    try {
      const [metaRaw, origRaw] = await Promise.all([
        _read(`${dir}/meta.json`),
        _read(`${dir}/original.txt`),
      ]);

      const meta     = JSON.parse(metaRaw);
      const original = origRaw;

      // Optional files — don't throw if missing
      const translated = meta.hasTranslation ? await _readOptional(`${dir}/translated.txt`) : null;
      const polished   = await _readOptional(`${dir}/polished.txt`);
      const summary    = await _readOptional(`${dir}/summary.txt`);
      const qaRaw      = await _readOptional(`${dir}/qa.txt`);
      const qa         = qaRaw ? JSON.parse(qaRaw) : null;

      DebugLogger.log(MODULE, 'load OK', id);
      return { ...meta, original, translated, polished, summary, qa };

    } catch (err) {
      DebugLogger.error(MODULE, 'load FAILED', `${id}: ${err.message}`);
      throw err;
    }
  },

  /**
   * Save an extra generated file for an existing entry.
   * @param {string} id
   * @param {string} type - 'polished' | 'summary' | 'qa'
   * @param {string} content
   * @param {number} previousBytes - pass previous saved size for overwrite types (e.g. qa)
   */
  async saveExtra(id, type, content, previousBytes = 0) {
    DebugLogger.log(MODULE, 'saveExtra', `${id}/${type}`);
    await _write(`${BASE_DIR}/${id}/${type}.txt`, content);

    // Update storageSizeBytes in meta (subtract old size, add new size)
    try {
      const metaRaw = await _read(`${BASE_DIR}/${id}/meta.json`);
      const meta = JSON.parse(metaRaw);
      const newBytes = new Blob([content]).size;
      meta.storageSizeBytes = (meta.storageSizeBytes || 0) - previousBytes + newBytes;
      await _write(`${BASE_DIR}/${id}/meta.json`, JSON.stringify(meta));
    } catch (err) {
      DebugLogger.warn(MODULE, 'saveExtra: failed to update size', err.message);
    }

    DebugLogger.log(MODULE, 'saveExtra OK');
  },

  /** Update the display name for an existing transcript. */
  async updateFileName(id, newName) {
    DebugLogger.log(MODULE, 'updateFileName', `${id} → ${newName}`);
    const dir = `${BASE_DIR}/${id}`;
    const metaRaw = await _read(`${dir}/meta.json`);
    const meta = JSON.parse(metaRaw);
    meta.audioFileName = newName;
    await _write(`${dir}/meta.json`, JSON.stringify(meta));
    DebugLogger.log(MODULE, 'updateFileName OK');
  },

  /** Delete a transcript and all its files. */
  async delete(id) {
    DebugLogger.log(MODULE, 'delete', id);
    const dir = `${BASE_DIR}/${id}`;
    const files = ['meta.json', 'original.txt', 'translated.txt', 'polished.txt', 'summary.txt'];

    for (const f of files) {
      await Filesystem.deleteFile({ path: `${dir}/${f}`, directory: Directory.Documents }).catch(() => {});
    }
    await Filesystem.rmdir({ path: dir, directory: Directory.Documents, recursive: true }).catch(() => {});
    DebugLogger.log(MODULE, 'delete OK', id);
  },
};

// ---- Private helpers ----

async function _write(path, data) {
  await Filesystem.writeFile({ path, data, directory: Directory.Documents, encoding: Encoding.UTF8, recursive: true });
}

async function _read(path) {
  const result = await Filesystem.readFile({ path, directory: Directory.Documents, encoding: Encoding.UTF8 });
  return result.data;
}

async function _readOptional(path) {
  try {
    return await _read(path);
  } catch {
    return null;
  }
}

function _isNotFound(err) {
  const msg = err?.message?.toLowerCase() || '';
  return msg.includes('does not exist') || msg.includes('not found') || msg.includes('no such');
}
