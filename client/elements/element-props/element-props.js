class ElementProps extends RootElement {
    constructor() {
        super();
        this.buildShadowRoot();
        this.elems = {
            container: this.shadowRoot.querySelector('div')
        };
        this.elems.container.addEventListener('change', this.handleChange.bind(this));
        this.elems.container.addEventListener('keyup', this.handleChange.bind(this));
        document.addEventListener('newElement', this.handleNewElement.bind(this));
        this.populateForm();
    }
    populateForm(){
        this.elems.container.innerHTML = `
            <ul>
                ${[].slice.apply(this.children).map((child) => `
                    <li>
                        ${this.renderInput(child)}
                    </li>
                `).join('')}
            </ul>
        `;
    }
    handleNewElement(e){
        this.innerHTML = '';
        e.detail.props.forEach( (prop) => this.appendChild(prop));
        this.populateForm();
    }
    renderInput(child){
        //TODO: I am not sure why I need this, child.values should work.
        let values = child.getAttribute('values');
        if(values && values === "bool"){
            return `
                <label for="${child.innerText}" data-type="checkbox">${child.innerText}</label> 
                <input name="${child.innerText}" type="checkbox" />
            `;
        }
        else if(values) {
            return `
                <label for="${child.innerText}">${child.innerText}</label>
                <select name="${child.innerText}">
                    ${values.split(",").map( (item ) => `<option>${item}</option>`).join('')}
                </select>
            `
        }

        if(child.innerText === 'slot'){
            return `
                <label for="${child.innerText}">${child.innerText}</label>
                <textarea name="${child.innerText}"></textarea>
            `
        }

        return `
            <label for="${child.innerText}">${child.innerText}</label>
            <input name="${child.innerText}" type="text" />
        `

    }
    handleChange(e){
        this.dispatchEvent(new CustomEvent('propUpdate', {
            detail: {
                prop: e.target.name,
                value: e.target.value
            },
            bubbles: true,
            cancelable: false
        }));
    }

}
RootElement.registerElement('element-props', ElementProps);
