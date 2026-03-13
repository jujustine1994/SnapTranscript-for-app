// FFmpegService — loads FFmpeg.wasm, compresses audio to Opus 32kbps, splits into 30-min segments.
// Uses single-thread core (no SharedArrayBuffer) for WKWebView / Capacitor iOS compatibility.

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { DebugLogger } from './utils/debug_logger.js';
import { AppConfig } from './config.js';

const MODULE = 'FFmpeg';

let _ffmpeg = null;
let _loaded = false;

export const FFmpegService = {

  /** Lazy-load FFmpeg.wasm from CDN. Safe to call multiple times. */
  async load(onProgress) {
    if (_loaded) {
      DebugLogger.log(MODULE, 'already loaded');
      return;
    }

    DebugLogger.log(MODULE, 'loading from CDN', AppConfig.FFMPEG_CORE_URL);
    onProgress?.({ stage: 'loading', percent: 0, detail: 'Loading FFmpeg...' });

    try {
      _ffmpeg = new FFmpeg();

      // Pipe FFmpeg internal messages to DebugLogger
      _ffmpeg.on('log', ({ message }) => {
        DebugLogger.log(MODULE, 'ffmpeg-log', message);
      });

      // FFmpeg progress events (0.0 – 1.0)
      _ffmpeg.on('progress', ({ progress }) => {
        const pct = Math.min(Math.round(progress * 100), 95);
        DebugLogger.log(MODULE, 'progress', `${pct}%`);
        onProgress?.({ stage: 'compressing', percent: pct, detail: 'Compressing audio...' });
      });

      // toBlobURL fetches from CDN and converts to a local blob URL
      // — @ffmpeg/ffmpeg v0.12 requires this, plain string URLs are rejected
      DebugLogger.log(MODULE, 'fetching core from CDN...');
      const coreURL = await toBlobURL(AppConfig.FFMPEG_CORE_URL, 'text/javascript');
      const wasmURL = await toBlobURL(AppConfig.FFMPEG_WASM_URL, 'application/wasm');
      DebugLogger.log(MODULE, 'CDN fetch OK, loading ffmpeg...');

      await _ffmpeg.load({ coreURL, wasmURL });

      _loaded = true;
      DebugLogger.log(MODULE, 'loaded OK');
      onProgress?.({ stage: 'loading', percent: 100, detail: 'FFmpeg ready' });

    } catch (err) {
      DebugLogger.error(MODULE, 'load FAILED', err.message);
      throw new Error(`FFmpeg load failed: ${err.message}`);
    }
  },

  /**
   * Compress audio + split into 30-min segments.
   * @param {File} file       - Input audio/video file from the file picker
   * @param {function} onProgress  - { stage, percent, detail }
   * @returns {Blob[]}        - Array of compressed Opus audio blobs (audio/ogg)
   */
  async processAudio(file, onProgress) {
    DebugLogger.log(MODULE, 'processAudio start', `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    onProgress?.({ stage: 'loading', percent: 0, detail: 'Preparing FFmpeg...' });

    if (!_loaded) {
      await this.load(onProgress);
    }

    try {
      // Write input to FFmpeg virtual FS
      const ext = _getExt(file.name);
      const inputName = `input${ext}`;
      DebugLogger.log(MODULE, 'writing input', inputName);
      onProgress?.({ stage: 'compressing', percent: 2, detail: 'Reading file...' });

      await _ffmpeg.writeFile(inputName, await fetchFile(file));
      DebugLogger.log(MODULE, 'input written OK');

      // Single-pass: compress + split with FFmpeg segment muxer
      // Output: part000.ogg, part001.ogg, ...
      DebugLogger.log(MODULE, 'exec compress+split');
      onProgress?.({ stage: 'compressing', percent: 5, detail: 'Compressing audio...' });

      await _ffmpeg.exec([
        '-i', inputName,
        '-vn',                                      // strip video track
        '-c:a', 'libopus',                          // Opus codec
        '-b:a', AppConfig.AUDIO_BITRATE,            // 32kbps
        '-ac', '1',                                 // mono — sufficient for speech
        '-ar', '16000',                             // 16kHz — optimal for speech recognition
        '-f', 'segment',                            // segment muxer
        '-segment_time', String(AppConfig.SEGMENT_DURATION_SEC),
        '-reset_timestamps', '1',
        'part%03d.ogg',
      ]);

      DebugLogger.log(MODULE, 'FFmpeg exec done');
      onProgress?.({ stage: 'compressing', percent: 90, detail: 'Reading output segments...' });

      // Collect all output segments
      const segments = [];
      for (let i = 0; ; i++) {
        const name = `part${String(i).padStart(3, '0')}.ogg`;
        let data;
        try {
          data = await _ffmpeg.readFile(name);
        } catch {
          DebugLogger.log(MODULE, `no more segments after index ${i}`);
          break;
        }

        const blob = new Blob([data], { type: 'audio/ogg' });
        const sizeMB = blob.size / 1024 / 1024;
        DebugLogger.log(MODULE, `segment[${i}]`, `${sizeMB.toFixed(2)}MB`);

        if (sizeMB > AppConfig.MAX_SEGMENT_SIZE_MB) {
          throw new Error(`Segment ${i} is ${sizeMB.toFixed(0)}MB — exceeds ${AppConfig.MAX_SEGMENT_SIZE_MB}MB limit. Audio may be too long.`);
        }

        segments.push(blob);
        await _ffmpeg.deleteFile(name).catch(() => {});
      }

      // Clean up input
      await _ffmpeg.deleteFile(inputName).catch(() => {});

      if (segments.length === 0) {
        throw new Error('FFmpeg produced no output — unsupported audio format or empty file.');
      }

      DebugLogger.log(MODULE, 'processAudio complete', `${segments.length} segment(s)`);
      onProgress?.({ stage: 'compressing', percent: 100, detail: `${segments.length} segment(s) ready` });
      return segments;

    } catch (err) {
      DebugLogger.error(MODULE, 'processAudio FAILED', err.message);
      throw err;
    }
  },
};

function _getExt(filename) {
  if (!filename) return '.audio';
  const m = filename.match(/\.[^.]+$/);
  return m ? m[0] : '.audio';
}
