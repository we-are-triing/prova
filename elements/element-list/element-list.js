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
        this.addEventListener('elementChange', this.handleElementChange.bind(this));
        this.elems.stories.addEventListener('click', this.handleStoriesClick.bind(this));
        this.elems.close.addEventListener('click', this.handleClose.bind(this));
        this.elems.search.addEventListener('keyup', this.handleSearch.bind(this));
        this.elems.search.addEventListener('change', this.handleSearch.bind(this));
    }
    handleSearch(e){
        this.elems.overlay.classList.remove('active');
        if(e.target.value){
            [...this.querySelectorAll(`element-item`)].forEach( (child) => {
                child.hidden = true;
            });

            if(e.target.value){
                [...this.querySelectorAll(`element-item[name*=${e.target.value}]`)].forEach( (child) => {
                    child.hidden = false;
                });
            }
        } else {
            [...this.querySelectorAll(`element-item`)].forEach( (child) => {
                child.hidden = false;
            });
        }
    }
    handleClose(e){
        this.elems.overlay.classList.remove('active');
    }
    handleElementChange(e){
        this.elems.overlay.classList.add('active');
        this.elems.title.innerText = e.detail.element;
        this.elems.stories.innerHTML = "";
        [...e.detail.stories].forEach( (story) => this.elems.stories.appendChild(story) );

        this.querySelector('[active]').removeAttribute('active');
        e.target.setAttribute('active','');
        let story;
        if(typeof e.detail.story === 'string'){
            story = [...e.detail.stories].find( s => s.getAttribute('name') === e.detail.story );
            console.log( e.detail.stories, story, e.detail.story);
            [...e.detail.stories].forEach( s => console.log(s.getAttribute('name')) );
        }
        else {
            story = e.detail.stories[0];
        }
        this.dispatchNewElement(story);

    }
    handleStoriesClick(e){
        this.dispatchNewElement(e.target);
    }
    dispatchNewElement(story){
        let activeStory = this.elems.stories.querySelector('[active]');
        if(activeStory){ activeStory.removeAttribute('active'); }
        story.setAttribute('active','');

        let elemItem = this.querySelector(`element-item[name="${this.elems.title.innerText}"]`);
        let props = [].slice.apply(elemItem.querySelectorAll(`element-properties prop-item `))
            // .map((elem) => ({ values: elem.values, name: elem.innerText }) );
            .map((elem) => elem.cloneNode(true) )
        this.dispatchEvent(new CustomEvent('newElement', {
            detail: {
                element: this.elems.title.innerText,
                story: story.name,
                markup: story.innerHTML,
                props: props,
                slotElements: elemItem.slotElements
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
