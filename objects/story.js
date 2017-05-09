class Story {
    constructor(element, props = []){
        this.name = element;
        this.props = props;
        this.slotElements = [];
        this.stories = [];
    }
    add(name, markup, elements = []) {
        this.stories.push({name, markup, elements});
        return this;
    }
    addProp(name, values = []){
        if(Array.isArray(name)){
            name.forEach( n => this.props.push({name: n}) )
        }
        else {
            this.props.push({name,values});
        }
        return this;
    }
    addSlotElement(name){
        if(Array.isArray(name)){
            name.forEach( n => this.slotElements.push(n) )
        }
        else {
            this.slotElements.push(name);
        }
        return this;
    }
}
module.exports = Story;
// returns an array of objects
/*
    {
        name: "element-name",
        props: propsObject,
        stories: [
            {
                name: "story-name",
                markup: "markup"
            }
        ]
    }
*/
