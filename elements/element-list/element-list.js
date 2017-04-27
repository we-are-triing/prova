class ElementList extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            list: this.shadowRoot.querySelector('header')
        }
    }
    static get observedAttributes() {
        return [`title`];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch(attrName){
            case `title`:
                this.elems.list.innerText = newVal;
                break;
            default:
                break;
        }
    }

    get title(){
        return this.getAttribute('title');
    }
    set title(val){
        if(val){
            this.setAttribute('title', val);
        }
        else {
            this.removeAttribute('title');
        }
    }
}
RootElement.registerElement('element-list', ElementList);
