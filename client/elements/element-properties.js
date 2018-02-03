import buildShadowRoot from './buildShadowRoot.js';

class ElementProperties extends HTMLElement {
    constructor() {
        super();
        const html = `<slot></slot>`;
        buildShadowRoot(html, this);
    }
}
customElements.define('element-properties', ElementProperties);
export default ElementProperties;
