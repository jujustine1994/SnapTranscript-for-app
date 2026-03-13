// PrivacyInfoModal — explains BYOK architecture, data privacy, and how to verify.
// Accessible via the 🔒 button in the header.

import { ModalComponent } from '../ModalComponent.js';

export class PrivacyInfoModal extends ModalComponent {
  constructor() {
    super('privacy-info-modal');
  }

  render() {
    return this.createElementFromHTML(`
      <div class="modal hidden">
        <div class="modal-content privacy-modal-content">

          <div class="modal-header">
            <h3 data-i18n="privacy_info.title">🔒 隱私架構說明</h3>
            <button class="close-btn">✕</button>
          </div>

          <div class="modal-body privacy-modal-body">

            <!-- Architecture diagram -->
            <div class="privacy-arch-diagram">
              <div class="arch-node arch-node--device">
                <div class="arch-node-icon">📱</div>
                <div class="arch-node-label" data-i18n="privacy_info.your_device">你的裝置</div>
                <div class="arch-node-sub" data-i18n="privacy_info.device_sub">API Key · 音訊 · 轉錄結果</div>
              </div>
              <div class="arch-arrow">
                <span class="arch-arrow-line"></span>
                <span class="arch-arrow-label" data-i18n="privacy_info.direct_conn">直接連線</span>
                <span class="arch-arrow-line"></span>
              </div>
              <div class="arch-node arch-node--google">
                <div class="arch-node-icon">🤖</div>
                <div class="arch-node-label">Google Gemini API</div>
                <div class="arch-node-sub" data-i18n="privacy_info.google_sub">AI 轉錄服務</div>
              </div>
            </div>

            <div class="privacy-arch-note" data-i18n="privacy_info.no_server">
              SnapTranscript 沒有後端伺服器。這個 App 在你的裝置上直接呼叫 Google API。
            </div>

            <!-- Guarantee checklist -->
            <div class="privacy-section-title" data-i18n="privacy_info.guarantees_title">我們的保證</div>
            <ul class="privacy-checklist">
              <li class="privacy-check">
                <span class="check-icon">✅</span>
                <span data-i18n="privacy_info.check_key">API Key 只存在你的裝置本地，SnapTranscript 永遠看不到</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">✅</span>
                <span data-i18n="privacy_info.check_audio">音訊直接從你的裝置上傳到 Google，不經過我們任何伺服器</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">✅</span>
                <span data-i18n="privacy_info.check_result">轉錄結果只存在你的裝置，我們沒有資料庫儲存你的內容</span>
              </li>
              <li class="privacy-check">
                <span class="check-icon">✅</span>
                <span data-i18n="privacy_info.check_opensource">原始碼公開，任何人都可以審查</span>
              </li>
            </ul>

            <!-- How to verify -->
            <div class="privacy-section-title" data-i18n="privacy_info.verify_title">如何自行驗證</div>
            <div class="privacy-verify-box">
              <p data-i18n="privacy_info.verify_steps">在電腦瀏覽器按 <kbd>F12</kbd> 開啟開發者工具 → 切到 <strong>Network</strong> 頁籤 → 執行一次轉錄 → 確認所有 API 請求只發往 <code>generativelanguage.googleapis.com</code>，完全沒有任何請求到 SnapTranscript 的伺服器。</p>
            </div>

            <!-- For non-technical users -->
            <div class="privacy-ai-tip">
              <span class="privacy-ai-tip-icon">💡</span>
              <span data-i18n="privacy_info.ai_tip">看不懂上面這些？截圖這個頁面，貼到 ChatGPT 或 Claude 問：「這個 App 安全嗎？我的 API Key 會外洩嗎？」讓 AI 幫你解釋。</span>
            </div>

            <!-- Warning -->
            <div class="privacy-warning">
              <div class="privacy-warning-title" data-i18n="privacy_info.warning_title">⚠️ 重要提醒</div>
              <p data-i18n="privacy_info.warning_body">請勿將你的 API Key 提供給任何人，包括任何聲稱是 SnapTranscript 客服的人。我們永遠不會索取你的 Key。付費 API Key 外洩可能導致他人盜用你的額度。</p>
            </div>

          </div>

          <div class="modal-footer">
            <a class="secondary-btn" href="https://github.com/jujustine1994/SnapTranscript-for-app" target="_blank" rel="noopener" data-i18n="privacy_info.view_source">查看原始碼</a>
            <button class="primary-btn close-modal-btn" data-i18n="privacy_info.got_it">了解了</button>
          </div>

        </div>
      </div>
    `);
  }

  postMount() {
    super.postMount();
  }
}
