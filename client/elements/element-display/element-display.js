class ElementDisplay extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.addLocalElems();
        this.addPolyfills();
        this.cleanIframe();
        this.addImports();
        document.addEventListener('storehouse-element', this.handleNewElement.bind(this));
        document.addEventListener('storehouse-properties', this.handleUpdatedProp.bind(this));
    }
    handleUpdatedProp(e){
        e.detail.forEach( (prop) => {
            const {name, value = undefined} = prop;
            const {targetElement} = this.elems;
            if(value){
                if(name.startsWith('--')){
                    targetElement.style.setProperty(name, value);
                }
                else if(name === 'slot'){
                    targetElement.innerHTML = value;
                }
                else{
                    targetElement.setAttribute(name, value);
                }
            }
        });
    }
    addPolyfills(){
        const s = document.createElement('script');
        s.src = `${this.polyfills}/webcomponents-loader.js`;
        this.elems.iframeDoc.head.appendChild(s);
    }
    handleNewElement(e){
        let {name, slotElements, stories, currentStory} = e.detail;
        this.elems.iframeDoc.body.innerHTML = stories[currentStory].markup;
        this.elems.targetElement = this.elems.iframeDoc.querySelector(name);
        this.elements = `${name},${slotElements}`;
        this.addImports();

        // change out hte innerTHML and update the URL
        document.title = `${name} - Element Storybook`;
        window.history.pushState({"pageTitle":document.title},document.title, `${this.storybookroot}/${name}/${stories[currentStory].name}`);
    }
    addLocalElems(){
        this.elems = {
            iframe: this.shadowRoot.querySelector('iframe')
        }
        this.elems.iframeDoc = this.elems.iframe.contentWindow.document;
        this.elems.iframeDoc.body.innerHTML = this.innerHTML;
        this.elems.targetElement = this.elems.iframeDoc.querySelector(this.children[0].localName);
    }
    addImports(){
        this.elems.iframeDoc.head.querySelectorAll(`link[rel="import"]`).forEach((link) => link.remove());

        this.elements.split(',').forEach( (elem) => {
            if(elem){
                let link = document.createElement('link');
                link.rel = "import";
                link.href = `${this.rootpath}/${elem}/${elem}.html`;
                this.elems.iframeDoc.head.appendChild(link);
            }
        });
    }
    cleanIframe(){
        let style = document.createElement('style');
        style.innerHTML = `
            html, body {
                margin: 0;
                padding: 0;
            }
        `;
        this.elems.iframeDoc.head.appendChild(style);
    }
    get elements(){
        return this.getAttribute('elements');
    }
    set elements(val){
        if(val){
            this.setAttribute('elements', val);
        }
        else {
            this.removeAttribute('elements');
        }
    }
    get rootpath(){
        return this.getAttribute('rootpath');
    }
    set rootpath(val){
        if(val){
            this.setAttribute('rootpath', val);
        }
        else {
            this.removeAttribute('rootpath');
        }
    }
    get storybookroot(){
        return this.getAttribute('storybookroot');
    }
    set storybookroot(val){
        if(val){
            this.setAttribute('storybookroot', val);
        }
        else {
            this.removeAttribute('storybookroot');
        }
    }
    get polyfills(){
        return this.getAttribute('polyfills');
    }
    set polyfills(val){
        if(val){
            this.setAttribute('polyfills', val);
        }
        else {
            this.removeAttribute('polyfills');
        }
    }
}
RootElement.registerElement('element-display', ElementDisplay);
