class ElementItem extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            name: this.shadowRoot.querySelector('span')
        }
        this.elems.name.dataset.element = this.name;
    }
    get name(){
        return this.getAttribute('name');
    }
    set name(val){
        if(val){
            this.setAttribute('name', val);
        }
        else {
            this.removeAttribute('name');
        }
    }
}
RootElement.registerElement('element-item', ElementItem);
