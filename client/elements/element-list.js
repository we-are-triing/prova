import buildShadowRoot from './buildShadowRoot.js';

class ElementList extends HTMLElement {
    constructor() {
        super();
        const html = `
          <style>
              :host {
                  display: block;
                  box-sizing: border-box;
              }
              * {
                  box-sizing: border-box;
              }
              main {
                  padding: 0.4em;
                  overflow: hidden;
                  height: calc(100% - 6em);
                  position: relative;
              }
              .grid-container {
                  max-height: 100%;
                  width: 100%;
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 20%;
                  grid-gap: 0.5em;
                  justify-items: stretch;
                  align-items: stretch;
                  justify-content: stretch;
                  overflow: auto;
              }
              :host > header {
                  text-align: center;
                  background: transparent;
                  padding: 0.8em;
                  border: 1px solid var(--es-color-400);
                  margin-bottom: 0.5em;
                  border-radius: 0.2em;
              }
              .overlay header {
                  height: 2.4em;
                  display: grid;
                  grid-template-columns: 1fr 5fr;
                  background: var(--es-color-200);
                  color: var(--es-color-600);
                  border-bottom: 1px solid var(--es-color-400);
              }
              .overlay header > span {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  padding: 0.4em;
              }
              .close {
                  cursor: pointer;
                  font-size: 0.8em;
                  border-right: 1px solid var(--es-color-400);
                  background: var(--es-color-300);
              }
              .search {
                  height: 2em;
              }
              .search input {
                  display: block;
                  height: 100%;
                  width: 100%;
                  border: 1px solid var(--es-color-100);
                  font-size: 1em;
                  outline: none;
                  padding: 0.1em 0.4em;
              }
              .search input::placeholder {
                  color: var(--es-color-400);
              }
              .overlay {
                  display: none;
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: calc(100% - 0.3em);
                  width: 100%;
                  background: var(--es-color-100);
                  border: 1px solid var(--es-color-400);
                  margin: 0.3em 0;

              }
              .overlay.active {
                  display: block;
              }
              .stories {
                  overflow: auto;
                  height: calc(100% - 2.4em);
              }
          </style>
          <header>
              Element Storybook
          </header>
          <section class="search">
              <input type="search" placeholder="filter elements" />
          </section>
          <main>
              <section class="grid-container">
                  <slot></slot>
              </section>
              <div class="overlay active">
                  <header>
                      <span class="close">list</span>
                      <span class="title"></span>
                  </header>
                  <section class="stories"></section>
              </div>
          </main>
        `;
        buildShadowRoot(html, this);
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
        // put this on the bench until the element event finishes propigating.
        window.setTimeout(() => this.updateProps(), 100);
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
        const story = this.stories[this.currentStoryIndex];
        const markup = story.markup;
        let temp = document.createElement('div');
        temp.innerHTML = markup;
        const elem = temp.querySelector(this.elems.title.innerText);
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
customElements.define('element-list', ElementList);
export default ElementList;
