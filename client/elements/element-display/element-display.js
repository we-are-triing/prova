class ElementDisplay extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.addLocalElems();
        this.addPolyfills();
        this.cleanIframe();
        this.addImports();
        document.body.addEventListener('propUpdate',this.handleUpdatedProp.bind(this));
        document.body.addEventListener('newElement',this.handleNewElement.bind(this));
        window.onpopstate = this.handlePopState.bind(this);
    }
    handleUpdatedProp(e){
        const {prop,value} = e.detail;
        const {targetElement} = this.elems;

        if(prop.startsWith('--')){
            targetElement.style.setProperty(prop, value);
        }
        else if(prop === 'slot'){
            targetElement.innerHTML = value;
        }
        else {
            targetElement[prop] = value;
        }
    }
    addPolyfills(){
        const s = document.createElement('script');
        s.src = `${this.polyfills}/webcomponents-loader.js`;
        this.elems.iframeDoc.head.appendChild(s);
    }
    handleNewElement(e){
        this.elems.iframeDoc.body.innerHTML = e.detail.markup;
        this.elems.targetElement = this.elems.iframeDoc.querySelector(e.detail.element);
        this.elements = `${e.detail.element},${e.detail.slotElements}`;
        this.addImports();

        // change out hte innerTHML and update the URL
        document.title = `${e.detail.element} - Element Storybook`;
        window.history.pushState({"pageTitle":document.title},document.title, `${this.storybookroot}/${e.detail.element}/${e.detail.story}`);
    }
    handlePopState(){
        //location.reload();
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
            let link = document.createElement('link');
            link.rel = "import";
            //TODO: assuming a file structure, need to figure this out better.
            link.href = `${this.rootpath}/${elem}/${elem}.html`;
            this.elems.iframeDoc.head.appendChild(link);
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
