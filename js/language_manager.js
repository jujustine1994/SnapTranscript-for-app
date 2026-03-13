// language_manager.js — UI language detection, switching, and DOM translation.

import { TRANSLATIONS } from './i18n_data.js';
import { AppConfig } from './config.js';

const STORAGE_KEY = AppConfig.STORAGE_KEYS.UI_LANGUAGE;

export class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem(STORAGE_KEY) || this._detectSystemLanguage();
  }

  init() {
    this.translatePage();
  }

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
      console.warn(`[LanguageManager] Unknown language: ${lang}`);
      return;
    }
    this.currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    this.translatePage();
  }

  /** Get translated string. Fallback chain: target → en-US → key itself. */
  t(key, params = {}) {
    let text =
      (TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) ||
      (TRANSLATIONS['en-US'] && TRANSLATIONS['en-US'][key]) ||
      key;

    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });

    return text;
  }

  /** Update all DOM elements with data-i18n attribute. */
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      let params = {};
      try {
        const raw = el.getAttribute('data-i18n-params');
        if (raw) params = JSON.parse(raw.replace(/'/g, '"'));
      } catch (e) { /* ignore malformed params */ }

      const text = this.t(key, params);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    });
  }

  // ---- Private ----

  _detectSystemLanguage() {
    const code = (navigator.language || '').toLowerCase();
    if (!code) return 'zh-TW';
    if (code.startsWith('zh')) return (code.includes('cn') || code.includes('sg')) ? 'zh-CN' : 'zh-TW';
    if (code.startsWith('en')) return 'en-US';
    if (code.startsWith('ja')) return 'ja-JP';
    if (code.startsWith('ko')) return 'ko-KR';
    if (code.startsWith('vi')) return 'vi-VN';
    if (code.startsWith('es')) return 'es-ES';
    if (code.startsWith('fr')) return 'fr-FR';
    if (code.startsWith('tl') || code.startsWith('fil')) return 'tl-PH';
    if (code.startsWith('id')) return 'id-ID';
    return 'zh-TW';
  }
}
