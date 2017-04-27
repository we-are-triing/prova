class ElementActions extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
    }
}
RootElement.registerElement('element-actions', ElementActions);
