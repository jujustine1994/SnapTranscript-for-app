/**
 * Modal Component Base Class
 * Extends BaseComponent to add specific Modal functionality (show, hide).
 */
import { BaseComponent } from './BaseComponent.js';

export class ModalComponent extends BaseComponent {
    constructor(id) {
        super(id);
    }

    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            requestAnimationFrame(() => {
                this.element.classList.add('visible');
            });
        }
    }

    hide() {
        if (this.element) {
            this.element.classList.remove('visible');
            setTimeout(() => this.element.classList.add('hidden'), 200);
        }
    }

    /**
     * Common Post-Mount for Modals: Bind Close Buttons and Outside Click
     */
    postMount() {
        const closeBtns = this.element.querySelectorAll('.close-btn, .close-modal-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.hide());
        });

        // Close on clicking outside content
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.hide();
        });
    }
}
