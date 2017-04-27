class ElementDisplay extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.addLocalElems();
        this.cleanIframe();
        this.addImports();
        document.body.addEventListener('propUpdate',this.handleUpdatedProp.bind(this));
    }
    handleUpdatedProp(e){

    }
    addLocalElems(){
        this.elems = {
            iframe: this.shadowRoot.querySelector('iframe')
        }
        this.elems.iframeDoc = this.elems.iframe.contentWindow.document;
        this.elems.iframeDoc.body.innerHTML = this.innerHTML;
        this.elems.targetElement = this.elems.iframeDoc.querySelector(this.element);
    }
    addImports(){
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
}
RootElement.registerElement('element-display', ElementDisplay);
