// RecorderService — microphone recording via MediaRecorder API.
// Works on desktop browsers and iOS WKWebView (iOS 14.5+).
// Output: Blob in the best available format (webm/opus → mp4 → browser default).
// The caller is responsible for converting the blob to a File and feeding it
// into the existing FFmpeg → Gemini pipeline.

import { DebugLogger } from './utils/debug_logger.js';

const MODULE = 'Recorder';

// Preferred MIME types in order of preference
const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',  // Chrome, Edge, Android
  'audio/webm',              // Chrome fallback
  'audio/mp4',               // Safari, iOS WKWebView
  'audio/ogg;codecs=opus',   // Firefox
];

function _getSupportedMime() {
  for (const mime of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return ''; // let browser pick
}

export const RecorderService = {
  _mediaRecorder: null,
  _chunks:        [],
  _stream:        null,
  _startTime:     0,
  _tickInterval:  null,

  /**
   * Request microphone and start recording.
   * @param {function} onTick - called every second with elapsed seconds (number)
   * @throws if microphone permission is denied
   */
  async start(onTick) {
    DebugLogger.log(MODULE, 'start — requesting mic');

    this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this._chunks = [];

    const mimeType = _getSupportedMime();
    DebugLogger.log(MODULE, 'mimeType', mimeType || '(browser default)');

    this._mediaRecorder = new MediaRecorder(
      this._stream,
      mimeType ? { mimeType } : {}
    );

    // Collect audio data in 100ms chunks for smooth stop response
    this._mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this._chunks.push(e.data);
    };

    this._mediaRecorder.start(100);
    this._startTime = Date.now();

    // Tick timer every second
    this._tickInterval = setInterval(() => {
      onTick?.(Math.floor((Date.now() - this._startTime) / 1000));
    }, 1000);

    DebugLogger.log(MODULE, 'recording started');
  },

  /**
   * Stop recording and return the audio Blob.
   * @returns {Promise<Blob>}
   */
  stop() {
    return new Promise((resolve) => {
      clearInterval(this._tickInterval);

      this._mediaRecorder.onstop = () => {
        const blob = new Blob(this._chunks, { type: this._mediaRecorder.mimeType });
        DebugLogger.log(MODULE, 'stop OK', `${(blob.size / 1024).toFixed(1)}KB type=${blob.type}`);
        // Release microphone
        this._stream?.getTracks().forEach(t => t.stop());
        resolve(blob);
      };

      this._mediaRecorder.stop();
    });
  },

  /** Cancel recording without returning audio. */
  cancel() {
    DebugLogger.log(MODULE, 'cancel');
    clearInterval(this._tickInterval);
    try { this._mediaRecorder?.stop(); } catch {}
    this._stream?.getTracks().forEach(t => t.stop());
    this._chunks = [];
  },

  /** Whether the browser/device supports MediaRecorder at all. */
  isSupported() {
    return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  },
};
