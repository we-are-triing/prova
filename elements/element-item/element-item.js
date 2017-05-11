class ElementItem extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            block: this.shadowRoot.querySelector('.block')
        }
        this.elems.block.dataset.element = this.name;
        this.addEventListener('click', this.handleBlockClick.bind(this));
        if( this.hasAttribute('active') ) {
            this.handleBlockClick(this.getAttribute('story'));
        }
    }
    handleBlockClick(story) {
        this.dispatchEvent(new CustomEvent('elementChange', {
            detail: {
                stories: [].slice.apply(this.children).slice(1).map( (story) => story.cloneNode(true)),
                element: this.name,
                story
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
    get slotElements() {
        return this.getAttribute('slot-elements');
    }
    set slotElements(val) {
        if (val) {
            this.setAttribute('slot-elements', val);
        } else {
            this.removeAttribute('slot-elements');
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
