// AdMobService — initialize AdMob, prepare and show interstitial ads.
// Called after transcription completes. All errors are non-fatal (app works without ads).

import { AdMob } from '@capacitor-community/admob';
import { DebugLogger } from './utils/debug_logger.js';
import { AppConfig } from './config.js';

const MODULE = 'AdMob';

export const AdMobService = {

  /** Initialize AdMob. Call once at app startup. */
  async initialize() {
    DebugLogger.log(MODULE, 'initialize');
    try {
      await AdMob.initialize({
        // Request iOS ATT (App Tracking Transparency) prompt
        requestTrackingAuthorization: true,
        // In debug mode, use test ads
        testingDevices:    AppConfig.DEBUG_MODE ? ['EMULATOR'] : [],
        initializeForTesting: AppConfig.DEBUG_MODE,
      });
      DebugLogger.log(MODULE, 'initialize OK');
    } catch (err) {
      // Non-fatal — running in browser during dev, or plugin not linked yet
      DebugLogger.warn(MODULE, 'initialize failed (non-fatal)', err.message);
    }
  },

  /**
   * Pre-load an interstitial ad. Call this while the user is reading transcription results,
   * so the ad is ready by the time we want to show it.
   */
  async prepareInterstitial() {
    DebugLogger.log(MODULE, 'prepareInterstitial');
    try {
      const adId = AppConfig.ADMOB_AD_UNIT_IOS; // TODO: detect iOS vs Android
      DebugLogger.log(MODULE, 'prepareInterstitial adId', adId);
      await AdMob.prepareInterstitial({ adId });
      DebugLogger.log(MODULE, 'prepareInterstitial OK');
      return true;
    } catch (err) {
      DebugLogger.warn(MODULE, 'prepareInterstitial failed (non-fatal)', err.message);
      return false;
    }
  },

  /** Show the pre-loaded interstitial. Non-fatal if ad is not ready. */
  async showInterstitial() {
    DebugLogger.log(MODULE, 'showInterstitial');
    try {
      await AdMob.showInterstitial();
      DebugLogger.log(MODULE, 'showInterstitial OK');
    } catch (err) {
      DebugLogger.warn(MODULE, 'showInterstitial failed (non-fatal)', err.message);
    }
  },
};
