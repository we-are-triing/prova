const BaseTemplate = require('./base.js');
const parse5 = require('parse5');
class ItemTemplate extends BaseTemplate {
    constructor({elementList, elementName, currentStory, elementsRoot, storybookRoot, polyfills, stylesheet, inject, moduleType}){
        super();
        this.stylesheet = stylesheet;
        this.inject = inject;
        this.moduleType = moduleType;
        this.elementList = elementList;
        this.elementName = elementName;
        this.element = this.findByName(this.elementList, elementName);
        if(typeof currentStory === "number"){
            this.story = this.element.stories[currentStory];
            this.element.currentStory = currentStory;
        } else{
            this.story = this.findByName(this.element.stories, currentStory);
            this.element.currentStory = this.element.stories.findIndex( item => item.name === currentStory);
        }
        this.elementsRoot = elementsRoot;
        this.polyfills = polyfills;
        this.storybookRoot = storybookRoot;
        this.createParts();
    }
    findByName(list, name){
        return list.find( item => item.name === name);
    }
    createParts(){
        this.head.title = `${this.elementName} - Element Storybook`;
        this.head.content = ``;
        this.stiva = this.populatestiva();
        this.page = this.populatePage();
    }
    populatestiva(){
        const markup = parse5.parseFragment(this.story.markup);
        const elem = markup.childNodes.find( node => node.nodeName === this.element.name);

        const props = this.element.props.reduce( (a,n) => {
            const {name} = n;
            let value;
            if(name === "slot"){
                value = elem.innerHTML;
            }
            else {
                if(name.startsWith('--')){

                    let style = elem.attrs.find( (attr) => attr.name === 'style' );
                    if(style){
                        style = style.value;
                        let reg = new RegExp(`${name}:(.*?)(?:;|$)`);
                        value = reg.exec(style)[1].trim();
                    }
                } else {
                    let prop = elem.attrs.find( (attr) => attr.name === name );
                    if(prop){
                        value = prop.value || true;
                    }
                }
            }
            return [...a,{name, value}];
        },[]);
        return {
            element: this.element,
            properties: props
        };
    }
    populatePage(){
        return `
            <element-actions>
                <element-list title="Element Storybook">
                    ${
                        this.elementList.map( (item) => (
                            `<element-item
                                name="${item.name}"
                                ${item.slotElements.length > 0 ? `slot-elements="${item.slotElements.join(",")}"`:``}
                                ${item.name === this.element.name ? ` active${this.story ? ` story="${this.story.name}"` : ``}` : ``}

                                >
                                <element-properties>
                                    ${this.addProps(item.props)}
                                </element-properties>
                                ${
                                    item.stories.map( (story) => (
                                        `<element-story name="${story.name}">${story.markup}</element-story>`
                                    )).join('')
                                }
                            </element-item>`
                        )).join('')
                    }
                </element-list>
                <property-display>
                <!-- this needs to be based on the current item -->
                    ${this.addProps(this.element.props)}
                </property-display>
            </element-actions>
            <element-display elements="${this.element.name}${this.element.slotElements.length > 0 ? `,${this.element.slotElements}`:``}" rootPath="${this.elementsRoot}" storybookroot="${this.storybookRoot}" polyfills="${this.polyfills}" ${this.stylesheet ? `stylesheet="${this.stylesheet}"` : ``} moduletype="${this.moduleType}">${this.story.markup}</element-display>
        `;
    }
    addProps(props){
        return props.map( (prop) => {
            return `<prop-item${ prop.values.length > 0 ? ` values='${prop.values}'` : ''}>${prop.name}</prop-item>`
        }).join('')
    }
}
module.exports = ItemTemplate;
