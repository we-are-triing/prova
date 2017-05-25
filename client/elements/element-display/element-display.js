class ElementDisplay extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            iframe: document.createElement('iframe')
        };
        this.elems.iframe.addEventListener('load', this.buildDevArea.bind(this));
        this.shadowRoot.appendChild(this.elems.iframe);

        document.addEventListener('stiva-element', this.handleNewElement.bind(this));
        document.addEventListener('stiva-properties', this.handleUpdatedProp.bind(this));
    }
    buildDevArea(){
        this.elems.iframeDoc = this.elems.iframe.contentDocument;
        this.addPolyfills();
        this.cleanIframe();
        this.addImports();
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
    reload(){
        this.elems.iframeDoc.location.reload();
        setTimeout( () => stiva.dispatchAll(), 300);
    }
    addPolyfills(){
        const s = document.createElement('script');
        s.src = `${this.polyfills}/webcomponents-loader.js`;
        this.elems.iframeDoc.head.appendChild(s);
    }
    handleNewElement(e){
        let {name, slotElements, stories, currentStory} = e.detail;
        this.elems.iframeDoc.body.innerHTML = `${stories[currentStory].markup}`;
        this.elems.targetElement = this.elems.iframeDoc.querySelector(name);
        this.elements = `${name},${slotElements}`;
        this.addImports();

        // change out hte innerTHML and update the URL
        document.title = `${name} - Element Storybook`;
        window.history.pushState({"pageTitle":document.title},document.title, `${this.storybookroot}/${name}/${stories[currentStory].name}`);
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
        if(this.stylesheet){
            let link = document.createElement('link');
            link.href = this.stylesheet;
            link.rel = "stylesheet";
            this.elems.iframeDoc.head.appendChild(link);
        }

        let script = document.createElement('script');
    	script.async = true;
    	script.src = `${this.storybookroot}/stiva.js`;
        script.onload = script.onreadystatechange = (e) => {
    		let rs = e.target.readyState;
    		if (rs && rs !== 'complete' && rs !== 'loaded') { return; }
            this.elems.iframe.contentWindow.stiva = new Stiva({},this.elems.iframeDoc);
    	};
    	this.elems.iframeDoc.head.appendChild(script);

        this.elems.iframeDoc.stiva = new Stiva();
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
    get stylesheet(){
        return this.getAttribute('stylesheet');
    }
    set stylesheet(val){
        if(val){
            this.setAttribute('stylesheet', val);
        }
        else {
            this.removeAttribute('stylesheet');
        }
    }

}
RootElement.registerElement('element-display', ElementDisplay);
