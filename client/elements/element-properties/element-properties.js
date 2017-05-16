class ElementProperties extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
    }
}
RootElement.registerElement('element-properties', ElementProperties);
