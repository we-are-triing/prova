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
    handleChange(e){
        stiva.update('properties', oldStore => {
            const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            oldStore.splice(oldStore.findIndex( (item) => item.name === e.target.name), 1);
            oldStore.push({name: e.target.name, value: val});
            return oldStore;
        });
    }

}
RootElement.registerElement('property-display', PropertyDisplay);
