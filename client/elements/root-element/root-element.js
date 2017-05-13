class RootElement extends HTMLElement {
    constructor(){
        super();
    }
    buildShadowRoot(id = '') {
        const templateSelector = `template${id !== '' ? `#${id}` : ``}`;
        const template = RootElement.ownerDocuments[this.localName].querySelector(templateSelector);
        typeof ShadyCSS !== 'undefined' && ShadyCSS.prepareTemplate(template, this.localName);

        const shadowRoot = this.attachShadow({mode: `open`});
        shadowRoot.appendChild(template.content.cloneNode(true), true);

        typeof ShadyCSS !== 'undefined' && ShadyCSS.styleElement(this);
        return shadowRoot;
    }
    static registerElement(name, constructor, options) {
        const ownerDoc = typeof HTMLImports !== 'undefined' && !HTMLImports.useNative ? HTMLImports.importForElement(document.currentScript) : document.currentScript.ownerDocument;
        RootElement.ownerDocuments[name] = ownerDoc;
        customElements.define(name, constructor, options);
    }
}
RootElement.ownerDocuments = {};
