class Story {
    constructor(element, props = []){
        this.name = element;
        this.props = props;
        this.slotElements = [];
        this.stories = [];
    }
    add(name, markup) {
        this.stories.push({name, markup});
        return this;
    }
    addProp(name, values = []){
        if(name.indexOf('stiva-') === 0){
            this.props.push({name, values: JSON.stringify(values)});
        }
        else if(Array.isArray(name)){
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
