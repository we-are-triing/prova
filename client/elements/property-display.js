import buildShadowRoot from './buildShadowRoot.js';

class PropertyDisplay extends HTMLElement {
    constructor() {
        super();
        const html = `<style>
                        :host {
                            display: block;
                        }
                        * {
                            box-sizing: border-box;
                        }
                        div {
                            height: 100%;
                            overflow: auto;
                            border: 1px solid var(--es-color-400);
                            /*border-top: none;*/
                            background: var(--es-color-100);
                        }
                        div ul {
                            display: block;
                            list-style: none;
                            margin: 0;
                            padding: 0;
                        }
                        li {
                            margin-bottom: 1em;
                            /*border-bottom: 1px solid var(--es-color-300);*/
                            padding: 0.2em 0.6em;
                        }
                        label:not([data-type="checkbox"]) {
                            font-size: 0.8em;
                            font-weight: 300;
                            color: var(--es-color-500);
                        }
                        input[type="checkbox"]{
                            float: right;
                            margin-right: 0.6em;
                            border: none;
                            outline: none;
                            background: var(--es-color-300);
                        }
                        input:not([type="checkbox"]), select, textarea, [contenteditable] {
                            display: block;
                            width: 100%;
                            font-size: 0.8em;
                            padding: 0.6em 1em;
                            border: none;
                            outline: none;
                            background: var(--es-color-300);
                        }
                        textarea, [contenteditable] {
                            font-family: monospace;
                            min-height: 12em;
                        }
                    </style>
                    <div></div>`;
        buildShadowRoot(html, this);
        this.props = [];
        this.elems = {
            container: this.shadowRoot.querySelector('div')
        };
        this.elems.container.addEventListener('change', this.handleChange.bind(this));
        this.elems.container.addEventListener('keyup', this.handleChange.bind(this));
        document.addEventListener('stiva-element', this.handleNewElement.bind(this));
        document.addEventListener('stiva-properties', this.handleProperties.bind(this));
        this.populateForm();
    }
    handleNewElement(e){
        this.innerHTML = '';
        this.props = e.detail.props;
        this.populateForm();
    }
    populateForm(){
        this.elems.container.innerHTML = `
            <ul>
                ${[].slice.apply(this.props).map((prop) => `
                    <li>
                        ${this.renderInput(prop)}
                    </li>
                `).join('')}
            </ul>
        `;
    }
    handleProperties(e){
        e.detail.forEach( (prop) => {
            const {name, value = ''} = prop;
            let elem = this.elems.container.querySelector(`[name=${name}]`)
            if(elem){
                if(elem.type === 'checkbox'){
                    elem.checked = value
                } else if (elem.contenteditable){
                    elem.innerHTML = JSON.stringify(JSON.parse(value));
                } else {
                    elem.value = value;
                }
            }
        });
    }
    renderInput({name, values}){
        if(values === "bool"){
            return `
                <label for="${name}" data-type="checkbox">${name}</label>
                <input name="${name}" type="checkbox" />
            `;
        }

        if(name.indexOf('stiva-') === 0){
            let store = name.replace('stiva-','');
            this.updateStiva(store, JSON.parse(values));
            return `
                <label for="${name}">${name}</label>
                <div contenteditable name="${name}">${JSON.stringify(JSON.parse(values))}</div>
            `
        }

        if(Array.isArray(values) && values.length > 0) {
            return `
                <label for="${name}">${name}</label>
                <select name="${name}">
                    ${values.map( (item ) => `<option>${item}</option>`).join('')}
                </select>
            `
        }

        if(name === 'slot'){
            return `
                <label for="${name}">${name}</label>
                <textarea name="${name}"></textarea>
            `
        }

        return `
            <label for="${name}">${name}</label>
            <input name="${name}" type="text" />
        `

    }
    updateStiva(store, value){
        document.querySelector('element-display').elems.iframe.contentWindow.stiva.update(store, oldStore => value);
    }
    handleChange(e){
        if(e.target.localName === 'div'){
            let store = e.target.getAttribute('name').replace('stiva-','');
            try {
                let json = JSON.parse(e.target.innerHTML);
                this.updateStiva(store, json);
            }
            catch(err){}
        }

        stiva.update('properties', oldStore => {
            const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            oldStore.splice(oldStore.findIndex( (item) => item.name === e.target.name), 1);
            oldStore.push({name: e.target.name, value: val});
            return oldStore;
        });

    }

}
customElements.define('property-display', PropertyDisplay);
export default PropertyDisplay;
