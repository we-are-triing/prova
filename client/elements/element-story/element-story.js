class ElementStory extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            span: this.shadowRoot.querySelector('span')
        }
    }
    static get observedAttributes() {
        return [`name`];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch(attrName){
            case `name`:
                this.elems.span.innerText = newVal;
                break;
            default:
                break;
        }
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
    get active(){
        return this.getAttribute('active');
    }
    set active(val){
        if(val){
            this.setAttribute('active', val);
        }
        else {
            this.removeAttribute('active');
        }
    }
}
RootElement.registerElement('element-story', ElementStory);
