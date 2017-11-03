import buildShadowRoot from "./buildShadowRoot.js";

class ElementStory extends HTMLElement {
  constructor() {
    super();
    const html = `<style>
                    :host {
                      display: block;
                    }
                    :host([active]){
                      color: var(--es-color-700);
                    }
                    span {
                      display: block;
                      border-bottom: 1px solid var(--es-color-300);
                      padding: 0.8em;
                      cursor: pointer;
                    }
                  </style>
                  <span></span>`;

    buildShadowRoot(html, this);
    this.elems = {
      span: this.shadowRoot.querySelector("span")
    };
  }
  static get observedAttributes() {
    return [`name`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `name`:
        this.elems.span.innerText = newVal;
        break;
      default:
        break;
    }
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(val) {
    if (val) {
      this.setAttribute("name", val);
    } else {
      this.removeAttribute("name");
    }
  }
  get active() {
    return this.getAttribute("active");
  }
  set active(val) {
    if (val) {
      this.setAttribute("active", val);
    } else {
      this.removeAttribute("active");
    }
  }
}

customElements.define('element-story', ElementStory);
export default ElementStory;
