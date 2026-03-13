/**
 * Base Component Class
 * Provides a standard way to create, render, and mount UI components.
 */
export class BaseComponent {
    constructor(id) {
        this.id = id;
        this.element = null;
    }

    /**
     * Renders the component's HTML and returns the element.
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("Render method must be implemented");
    }

    /**
     * Mounts the component to a parent element.
     * @param {HTMLElement} parentElement 
     */
    mount(parentElement) {
        this.element = this.render();
        if (this.id) this.element.id = this.id;
        parentElement.appendChild(this.element);
        this.postMount();
    }

    /**
     * Called after mounting. Use for event binding.
     */
    postMount() {
        // Override
    }

    /**
     * Utility to create element from HTML string
     * @param {string} htmlString 
     * @returns {HTMLElement}
     */
    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    $(selector) {
        return this.element ? this.element.querySelector(selector) : null;
    }
}
