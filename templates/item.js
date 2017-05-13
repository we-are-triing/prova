const BaseTemplate = require('./base.js');
const parse5 = require('parse5');
class ItemTemplate extends BaseTemplate {
    constructor({elementList, elementName, storyName, elementsRoot, storybookRoot, polyfills}){
        super();

        this.elementList = elementList;
        this.elementName = elementName;
        this.element = this.findByName(this.elementList, elementName);
        if(typeof storyName === "number"){
            this.story = this.element.stories[storyName];
            this.storyName = this.story.name;
        } else{
            this.storyName = storyName;
            this.story = this.findByName(this.element.stories, storyName);
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
        this.storehouse = this.populateStorehouse();
        this.page = this.populatePage();
    }
    populateStorehouse(){
        const props = this.element.props.reduce( (a,n) => {
            const {name} = n;
            const markup = parse5.parseFragment(this.story.markup);
            const elem = markup.childNodes.find( node => node.nodeName === this.element.name);
            let value;

            if(name === "slot"){
                value = elem.innerHTML;
            }
            else {
                if(name.startsWith('--')){

                    let style = elem.attrs.find( (attr) => attr.name === 'style' );
                    if(style){
                        style = style.value;
                        // TODO: get this working.
                        console.log(elem);
                        reg = new RegExp(`${name}:(.*?)(?:;|")`);
                        value = style.search(reg)[1].trim();
                    }
                } else {
                    let val = elem.attrs.find( (attr) => attr.name === name );
                    if(val){
                        value = val.value;
                    }
                }
            }
            return [...a,{name, value}];
        },[]);
        // TODO: you'll need to register the store items?
        return {
            element: this.element,
            story: this.story,
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
                <element-props>
                <!-- this needs to be based on the current item -->
                    ${this.addProps(this.element.props)}
                </element-props>
            </element-actions>
            <element-display elements="${this.element.name}${this.element.slotElements.length > 0 ? `, ${this.element.slotElements}`:``}" rootPath="${this.elementsRoot}" storybookroot="${this.storybookRoot}" polyfills="${this.polyfills}">${this.story.markup}</element-display>
        `;
    }
    addProps(props){
        return props.map( (prop) => (
            `<prop-item${ prop.values.length > 0 ? ` values="${prop.values}"` : ''}>${prop.name}</prop-item>`
        )).join('')
    }
}
module.exports = ItemTemplate;
