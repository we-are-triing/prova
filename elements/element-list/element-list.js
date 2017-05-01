class ElementList extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            list: this.shadowRoot.querySelector('header'),
            overlay: this.shadowRoot.querySelector('.overlay'),
            close: this.shadowRoot.querySelector('.close'),
            title: this.shadowRoot.querySelector('.title'),
            stories: this.shadowRoot.querySelector('.stories'),
            search: this.shadowRoot.querySelector('.search input')
        }
        this.addEventListener('elementClick', this.handleElementClick.bind(this));
        this.elems.stories.addEventListener('click', this.handleStoriesClick.bind(this));
        this.elems.close.addEventListener('click', this.handleClose.bind(this));
        this.elems.search.addEventListener('keyup', this.handleSearch.bind(this));
        this.elems.search.addEventListener('change', this.handleSearch.bind(this));
    }
    handleSearch(e){

        if(e.target.value){
            [...this.querySelectorAll(`element-item`)].forEach( (child) => {
                child.hidden = true;
            });

            if(e.target.value){
                [...this.querySelectorAll(`element-item[name*=${e.target.value}]`)].forEach( (child) => {
                    child.hidden = false;
                });
            }
        }else {
            [...this.querySelectorAll(`element-item`)].forEach( (child) => {
                child.hidden = false;
            });
        }
    }
    handleClose(e){
        this.elems.overlay.classList.remove('active');
    }
    handleElementClick(e){
        this.elems.overlay.classList.add('active');
        this.elems.title.innerText = e.detail.element;
        this.elems.stories.innerHTML = "";
        [...e.detail.stories].forEach( (story) => this.elems.stories.appendChild(story) );
    }
    handleStoriesClick(e){
        //dispatch a story click
        console.log(this.querySelectorAll(`element-item[name="${this.elems.title.innerText}"] element-properties prop-item `));
        let props = [].slice.apply(this.querySelectorAll(`element-item[name="${this.elems.title.innerText}"] element-properties prop-item `))
            // .map((elem) => ({ values: elem.values, name: elem.innerText }) );
            .map((elem) => elem.cloneNode(true) )

        console.log(this.elems.title.innerText);
        this.dispatchEvent(new CustomEvent('newElement', {
            detail: {
                element: this.elems.title.innerText,
                story: e.target.name,
                markup: e.target.innerHTML,
                props: props
            },
            bubbles: true,
            cancelable: false
        }));
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
