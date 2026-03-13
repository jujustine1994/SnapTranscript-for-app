// Manages Gemini API Key: save, load, delete, validate.
// Uses @capacitor/preferences (app-sandboxed on iOS/Android — other apps cannot read it).
// NOTE: NSUserDefaults on iOS, not Keychain. Acceptable for BYOK model.
// TODO: Upgrade to @aparajita/capacitor-secure-storage for full Keychain encryption if needed.

import { Preferences } from '@capacitor/preferences';
import { AppConfig } from './config.js';

const KEY = AppConfig.STORAGE_KEYS.API_KEY;

export const ApiKeyService = {

  /** Returns the stored API key, or null if not set. */
  async get() {
    const { value } = await Preferences.get({ key: KEY });
    return value;
  },

  /** Saves the API key to local storage. Trims whitespace. */
  async save(apiKey) {
    await Preferences.set({ key: KEY, value: apiKey.trim() });
  },

  /** Removes the API key from local storage. */
  async delete() {
    await Preferences.remove({ key: KEY });
  },

  /** Returns true if a key is stored. */
  async hasKey() {
    const key = await this.get();
    return typeof key === 'string' && key.length > 0;
  },

  /**
   * Validates key format without making a network call.
   * Gemini API keys: start with "AIza", total 39 characters.
   */
  isValidFormat(apiKey) {
    return typeof apiKey === 'string' && /^AIza[A-Za-z0-9_-]{35}$/.test(apiKey);
  },
};
