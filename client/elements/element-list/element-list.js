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
        document.addEventListener('stiva-element', this.handleElementChange.bind(this));
        this.elems.stories.addEventListener('click', this.handleStoriesClick.bind(this));
        this.elems.close.addEventListener('click', this.handleClose.bind(this));
        this.elems.search.addEventListener('keyup', this.handleSearch.bind(this));
        this.elems.search.addEventListener('change', this.handleSearch.bind(this));
        this.currentStoryIndex = 0;
        this.stories = [];
    }
    handleSearch(e){
        this.elems.overlay.classList.remove('active');
        if(e.target.value){
            [].slice.apply(this.querySelectorAll(`element-item`)).forEach( (child) => {
                child.hidden = true;
            });

            if(e.target.value){
                [].slice.apply(this.querySelectorAll(`element-item[name*=${e.target.value}]`)).forEach( (child) => {
                    child.hidden = false;
                });
            }
        } else {
            [].slice.apply(this.querySelectorAll(`element-item`)).forEach( (child) => {
                child.hidden = false;
            });
        }
    }
    handleClose(e){
        this.elems.overlay.classList.remove('active');
    }
    handleElementChange(e){
        const {stories, name, currentStory} = e.detail;
        this.elems.overlay.classList.add('active');
        this.elems.title.innerText = name;
        this.elems.stories.innerHTML = [].slice.apply(stories).map( story => `<element-story name=${story.name}>${story.markup}</element-story>` ).join('');
        let active = this.querySelector('[active]')
        active.removeAttribute('active');
        active.removeAttribute('story');

        this.querySelector(`element-item[name="${name}"]`).setAttribute(`active`,``);
        this.currentStoryIndex = currentStory;
        this.stories = stories;
        this.selectActiveStory(this.elems.stories.querySelector(`[name="${this.stories[this.currentStoryIndex].name}"]`));
        this.updateProps();
    }
    selectActiveStory(story){
        let activeStory = this.elems.stories.querySelector('[active]');
        if(activeStory){ activeStory.removeAttribute('active'); }
        story.setAttribute('active','');
    }
    handleStoriesClick(e){
        if(e.target.localName === 'element-story'){
            this.currentStoryIndex = [].slice.apply(this.elems.stories.children).indexOf(e.target);

            stiva.update('element', oldStore => ({
                currentStory: this.currentStoryIndex,
                name: oldStore.name,
                props: oldStore.props,
                slotElements: oldStore.slotElements,
                stories: oldStore.stories
            }));
            this.updateProps();
        }
    }
    updateProps(){
        const markup = this.stories[this.currentStoryIndex].markup;
        let temp = document.createElement('div');
        temp.innerHTML = markup;
        const elem = temp.children[0];
        const props = stiva.stores.element.props.reduce( (a,n) => {
            const {name} = n;
            let value;
            if(name === "slot"){
                value = elem.innerHTML;
            }
            else {
                if(name.startsWith('--')){
                    let style = elem.getAttribute('style');
                    if(style){
                        let reg = new RegExp(`${name}:(.*?)(?:;|$)`);
                        value = reg.exec(style)[1].trim();
                    }
                } else {
                    let val = elem.getAttribute(name);
                    if(elem.hasAttribute(name)){
                        value = val || true;
                    }
                }
            }
            a.push({name, value});
            return a;
        },[]);
        stiva.update('properties', oldStore => props);
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
