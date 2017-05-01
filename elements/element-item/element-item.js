class ElementItem extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            block: this.shadowRoot.querySelector('.block')
        }
        this.elems.block.dataset.element = this.name;
        this.addEventListener('click', this.handleBlockClick.bind(this));
    }
    handleBlockClick(e) {
        this.dispatchEvent(new CustomEvent('elementClick', {
            detail: {
                stories: [...this.children].slice(1).map( (story) => story.cloneNode(true)),
                element: this.name
            },
            bubbles: true,
            cancelable: false
        }));
    }
    get name() {
        return this.getAttribute('name');
    }
    set name(val) {
        if (val) {
            this.setAttribute('name', val);
        } else {
            this.removeAttribute('name');
        }
    }
    get hidden() {
        return this.hasAttribute('hidden');
    }
    set hidden(val) {
        if (val) {
            this.setAttribute('hidden', '');
        } else {
            this.removeAttribute('hidden');
        }
    }
}
RootElement.registerElement('element-item', ElementItem);
