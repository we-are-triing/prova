class PropertyDisplay extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
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
            oldStore.splice(oldStore.findIndex( (item) => item.name === e.target.name), 1);
            oldStore.push({name: e.target.name, value: e.target.value});
            return oldStore;
        });

    }

}
RootElement.registerElement('property-display', PropertyDisplay);
