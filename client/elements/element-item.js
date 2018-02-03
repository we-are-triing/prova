import buildShadowRoot from './buildShadowRoot.js'

class ElementItem extends HTMLElement {
    constructor() {
        super();
        const html = `
          <style>
              :host {
                  display: block;
                  box-sizing: border-box;
                  text-align: center;
                  font-size: 0.8em;

              }
              :host([hidden]){
                  display: none;
              }
              .block {
                  display: block;
                  width: 100%;
                  padding-bottom: 100%;
                  margin-bottom: 1px;
                  box-sizing: border-box;
                  background: var(--es-color-200);
                  border: 1px solid var(--es-color-400);
                  overflow: hidden;
                  position: relative;
                  border-radius: 0.5em;
              }
              .block::before{
                  content: attr(data-element);
                  display: block;
                  position: absolute;
                  top: 0;
                  right: 0;
                  left: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              :host([active]) .block{
                  background: var(--es-color-700);
                  color: var(--es-color-100);
              }
          </style>
          <span class="block"></span>
        `
        buildShadowRoot(html, this);
        this.elems = {
            block: this.shadowRoot.querySelector('.block'),
            props: [].slice.apply(this.querySelectorAll('element-properties prop-item'))
        }
        this.elems.block.dataset.element = this.name;
        this.addEventListener('click', this.handleBlockClick.bind(this));
    }
    handleBlockClick(e) {
        let props = this.elems.props.map( item => {
            if(item.values){
                return {
                    name: item.innerText,
                    values: item.values.indexOf(',') > -1 ? item.values.split(',') : item.values
                }
            }
            return { name: item.innerText, values: undefined}

        });


        stiva.update('element', oldStore => ({
            currentStory: this.findStoryIndex(),
            name: this.name,
            props,
            slotElements: this.slotElements ? this.slotElements.split(',') : [],
            stories: [].slice.apply(this.children).slice(1).map( (story) => ({name: story.name, markup: story.innerHTML}))
        }));
    }
    findStoryIndex(){
        if(this.story){
            return [].slice.apply(this.querySelectorAll('element-story')).findIndex( story => story.name === this.story);
        }
        else {
            return 0;
        }
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

    get story() {
        return this.getAttribute('story');
    }
    set story(val) {
        if (val) {
            this.setAttribute('story', val);
        } else {
            this.removeAttribute('story');
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
customElements.define('element-item', ElementItem);
export default ElementItem;
