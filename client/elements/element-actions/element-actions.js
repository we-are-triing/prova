class ElementActions extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();

        storehouse.register('element');
        document.addEventListener('storehouse-element', e => console.log('heard the return', e));
        //this.dispatchEvent( new CustomEvent('element', { detail: {data: {test: 'worked'} }, bubbles: true} ));
    }

}
RootElement.registerElement('element-actions', ElementActions);
