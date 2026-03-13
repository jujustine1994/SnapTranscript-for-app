// TranscribeService — all Gemini API calls: transcription, translation, summary, polish, Q&A.
// Uses the Gemini Files API (upload → wait → generateContent).
// API Key is fetched from ApiKeyService on demand; never hardcoded.

import { DebugLogger } from './utils/debug_logger.js';
import { AppConfig } from './config.js';
import { ApiKeyService } from './api_key_service.js';

const MODULE = 'Transcribe';
const BASE        = AppConfig.GEMINI_API_BASE;
const UPLOAD_BASE = AppConfig.GEMINI_UPLOAD_BASE;
const MODEL       = AppConfig.GEMINI_MODEL;

export const TranscribeService = {

  /**
   * Main entry point: transcribe all audio segments via Gemini.
   * @param {Blob[]} segments  - From FFmpegService.processAudio()
   * @param {object} options   - { language, translate, targetLanguage }
   * @param {function} onProgress - { stage, percent, detail }
   * @returns {{ original: string, translated: string|null }}
   */
  async transcribeAll(segments, options, onProgress) {
    DebugLogger.log(MODULE, 'transcribeAll start', `${segments.length} seg, lang=${options.language}, translate=${options.translate}`);

    const apiKey = await ApiKeyService.get();
    if (!apiKey) throw new Error('No Gemini API key found. Please set your key in Settings.');

    const transcripts = [];
    const total = segments.length;

    for (let i = 0; i < total; i++) {
      const seg = segments[i];
      const n = i + 1;

      DebugLogger.log(MODULE, `seg ${n}/${total}`, `${(seg.size / 1024 / 1024).toFixed(2)}MB`);

      // Upload
      onProgress?.({ stage: 'uploading', percent: Math.round((i / total) * 30), detail: `Uploading part ${n}/${total}...` });
      const { fileName, fileUri } = await this._uploadFile(seg, 'audio/ogg', apiKey);
      DebugLogger.log(MODULE, `upload OK ${n}`, fileUri);

      // Wait for Gemini to process the file
      onProgress?.({ stage: 'uploading', percent: Math.round((i / total) * 30 + 10), detail: `Waiting for part ${n}/${total}...` });
      await this._waitForFile(fileName, apiKey);
      DebugLogger.log(MODULE, `file ACTIVE ${n}`);

      // Transcribe
      onProgress?.({ stage: 'transcribing', percent: Math.round(40 + (i / total) * 50), detail: `Transcribing part ${n}/${total}...` });
      const text = await this._transcribeSegment(fileUri, options.language, apiKey);
      DebugLogger.log(MODULE, `transcript ${n} OK`, `${text.length} chars`);
      transcripts.push(text);
    }

    const original = transcripts.join('\n\n');
    DebugLogger.log(MODULE, 'all segments done', `${original.length} total chars`);

    // Optional translation
    let translated = null;
    if (options.translate && options.targetLanguage && options.targetLanguage !== 'none') {
      onProgress?.({ stage: 'translating', percent: 92, detail: `Translating to ${options.targetLanguage}...` });
      translated = await this.translate(original, options.targetLanguage, apiKey);
      DebugLogger.log(MODULE, 'translation OK', `${translated.length} chars`);
    }

    onProgress?.({ stage: 'done', percent: 100, detail: 'Complete!' });
    return { original, translated };
  },

  // ---- On-demand AI features (called from ResultView) ----

  async translate(text, targetLang, apiKey) {
    DebugLogger.log(MODULE, 'translate', targetLang);
    if (!apiKey) apiKey = await ApiKeyService.get();
    const langMap = {
      'zh-TW': 'Traditional Chinese (繁體中文)', 'zh-CN': 'Simplified Chinese (简体中文)',
      'en': 'English', 'ja': 'Japanese', 'ko': 'Korean',
      'fr': 'French', 'de': 'German', 'es': 'Spanish', 'pt': 'Portuguese', 'th': 'Thai',
    };
    const lang = langMap[targetLang] || targetLang;
    const prompt = `Translate the following transcript to ${lang}. Output only the translated text, no explanation or commentary.\n\n${text}`;
    return this._generateText(prompt, apiKey);
  },

  async summarize(text, apiKey, outputLang, customPrompt = null) {
    DebugLogger.log(MODULE, 'summarize', customPrompt ? 'custom' : outputLang);
    if (!apiKey) apiKey = await ApiKeyService.get();
    const prompt = customPrompt
      ? `${customPrompt}\n\n${text}`
      : `Extract all significant information from this transcript. Group the content under clear topic headings based on the discussion flow, with detailed nested bullet points under each heading. Capture key decisions, action items (with assignees and deadlines if mentioned), specific data or metrics, and important context. Include all relevant details, even minor ones.${outputLang ? ` Write the output in ${outputLang}.` : ''}\n\n${text}`;
    return this._generateText(prompt, apiKey);
  },

  async polish(text, apiKey, outputLang, customPrompt = null) {
    DebugLogger.log(MODULE, 'polish', customPrompt ? 'custom' : outputLang);
    if (!apiKey) apiKey = await ApiKeyService.get();
    const prompt = customPrompt
      ? `${customPrompt}\n\n${text}`
      : `Rewrite this transcript into a clean, readable version. Remove filler words, repetitions, and false starts. Fix grammar and punctuation. Preserve the speaker's original tone and intent. Break the content into natural paragraphs based on topic shifts.${outputLang ? ` Write the output in ${outputLang}.` : ''}\n\n${text}`;
    return this._generateText(prompt, apiKey);
  },

  async askQuestion(transcript, question, apiKey) {
    DebugLogger.log(MODULE, 'askQuestion', question.substring(0, 60));
    if (!apiKey) apiKey = await ApiKeyService.get();
    const prompt = `Based on this transcript, answer the question concisely.\n\nTranscript:\n${transcript}\n\nQuestion: ${question}`;
    return this._generateText(prompt, apiKey);
  },

  // ---- Private: Gemini Files API ----

  async _uploadFile(blob, mimeType, apiKey) {
    DebugLogger.log(MODULE, '_uploadFile', `${(blob.size / 1024 / 1024).toFixed(2)}MB mimeType=${mimeType}`);
    const url = `${UPLOAD_BASE}/files?uploadType=multipart&key=${apiKey}`;

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({ file: { mimeType } })], { type: 'application/json' }));
    form.append('file', blob, 'audio.ogg');

    DebugLogger.log(MODULE, '_uploadFile sending...');
    const resp = await fetch(url, { method: 'POST', body: form });

    if (!resp.ok) {
      const errText = await resp.text();
      DebugLogger.error(MODULE, '_uploadFile HTTP error', `${resp.status}: ${errText.substring(0, 300)}`);
      throw new Error(`Gemini upload failed (${resp.status}): ${errText}`);
    }

    const data = await resp.json();
    DebugLogger.log(MODULE, '_uploadFile resp', JSON.stringify(data).substring(0, 200));
    return { fileName: data.file.name, fileUri: data.file.uri };
  },

  // Polls the Gemini Files API until the uploaded file is ACTIVE (ready for generateContent).
  // Gemini needs time to process audio server-side before it can accept generateContent requests.
  // 2s interval: fast enough to not waste time, slow enough to avoid rate limits.
  // 90s timeout: covers even large files; typical processing is 5–20s.
  // Note: this endpoint (GET /files/{name}) does NOT count toward generateContent quota.
  async _waitForFile(fileName, apiKey, timeoutMs = 90000) {
    DebugLogger.log(MODULE, '_waitForFile', fileName);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const url = `${BASE}/${fileName}?key=${apiKey}`;
      const resp = await fetch(url);

      if (!resp.ok) {
        DebugLogger.error(MODULE, '_waitForFile poll error', resp.status);
        throw new Error(`File status poll failed (${resp.status})`);
      }

      const data = await resp.json();
      DebugLogger.log(MODULE, '_waitForFile state', data.state);

      if (data.state === 'ACTIVE') return;
      if (data.state === 'FAILED') throw new Error('Gemini rejected the audio file (FAILED state).');

      await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error('Timeout: Gemini took too long to process the audio file.');
  },

  async _transcribeSegment(fileUri, language, apiKey) {
    DebugLogger.log(MODULE, '_transcribeSegment', fileUri.substring(0, 60));
    const langHint = language && language !== 'auto' ? ` The audio language is ${language}.` : '';
    const prompt = `Transcribe this audio accurately.${langHint} Output only the transcription text. Do not add timestamps, speaker labels, or any commentary.`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { fileData: { mimeType: 'audio/ogg', fileUri } },
        ],
      }],
      // temperature: 0 = fully deterministic; critical for transcription accuracy
      // (any randomness risks hallucinating words that weren't spoken)
      generationConfig: { temperature: 0 },
    };

    return this._generateContent(body, apiKey);
  },

  async _generateText(prompt, apiKey) {
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      // temperature: 0.3 = slight creativity for summarize/polish/translate/Q&A
      // (better than 0 for generative tasks, avoids being too robotic)
      generationConfig: { temperature: 0.3 },
    };
    return this._generateContent(body, apiKey);
  },

  async _generateContent(body, apiKey) {
    const url = `${BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
    // Log URL with key masked
    // Mask API key in logs — key appears in URL query string and must never appear in debug output
    DebugLogger.log(MODULE, '_generateContent', url.replace(apiKey, '***KEY***'));

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      DebugLogger.error(MODULE, '_generateContent error', `${resp.status}: ${errText.substring(0, 300)}`);
      throw new Error(`Gemini API error (${resp.status}): ${errText}`);
    }

    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      DebugLogger.error(MODULE, '_generateContent empty', JSON.stringify(data).substring(0, 300));
      throw new Error('Gemini returned an empty response. Check your API key and quota.');
    }

    DebugLogger.log(MODULE, '_generateContent OK', `${text.length} chars`);
    return text.trim();
  },
};
