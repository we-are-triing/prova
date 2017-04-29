const BaseTemplate = require('./base.js');
class ItemTemplate extends BaseTemplate {
    constructor({elementList, elementName, storyName, elementsRoot, routeRoot}){
        super();

        this.elementList = elementList;
        this.elementName = elementName;
        this.element = this.findByName(this.elementList, elementName);
        console.log(this.element);
        if(typeof storyName === "number"){
            this.story = this.element.stories[storyName];
            this.storyName = this.story.name;
        } else{
            this.storyName = storyName;
            this.story = this.findByName(this.element.stories, storyName);
        }
        this.elementsRoot = elementsRoot;
        this.routeRoot = routeRoot;

        this.createParts();
    }
    findByName(list, name){
        return list.find( item => item.name === name);
    }
    createParts(){
        this.head.title = `${this.elementName} - Element Storybook`;
        this.head.content = ``;
        this.page = this.populatePage();
    }
    populatePage(){
        // make the list
        // make the props
        // make some componets that handle the interactions there
            // searchable list (tiles) that drills into the stories for that tile set.
            // props that get entered and update the current element
            // a screen that shows loads the component in an iframe
                // do I need an iframe? it would provide the cleanest experience of the component. Yes.

        return `
            <element-actions>
                <element-list title="Element Storybook">
                    ${
                        this.elementList.map( (item) => (
                            `<element-item name="${item.name}">
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
                    
                </element-props>
            </element-actions>
            <element-display elements="${this.element.name}${this.element.slotElements.length > 0 ? `, ${this.element.slotElements}`:``}" rootPath="${this.elementsRoot}" >${this.story.markup}</element-display>
        `;
    }
    addProps(props){
        return props.map( (prop) => (
            `<prop-item${ prop.values.length > 0 ? ` values="${prop.values}"` : ''}>${prop.name}</prop-item>`
        )).join('')
    }
}
module.exports = ItemTemplate;
