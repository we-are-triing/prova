import buildShadowRoot from "./buildShadowRoot.js";

class PropItem extends HTMLElement {
  constructor() {
    super();
    const html = `<style>
                    :host {
                      display: block;
                    }
                  </style>
                  <slot></slot>`;
    buildShadowRoot(html, this);
  }
  get values() {
    return this.getAttribute("values");
  }
  set values(val) {
    if (val) {
      this.setAttribute("values", val);
    } else {
      this.removeAttribute("values");
    }
  }
}

customElements.define('prop-item', PropItem);
export default PropItem;
