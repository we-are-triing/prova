class PropItem extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
    }
    get values(){
        return this.getAttribute('values');
    }
    set values(val){
        if(val){
            this.setAttribute('values', val);
        }
        else {
            this.removeAttribute('values');
        }
    }

}
RootElement.registerElement('prop-item', PropItem);
