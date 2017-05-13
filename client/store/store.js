class Storehouse {
    constructor(stores = {}){
        this.stores = stores;
    }
    register(type){
        document.addEventListener(type, this.handler.bind(this));
    }
    handler(e){
        let store = this.stores[e.type];
        switch(e.detail.type){
            case 'add':
                if(e.detail.index){
                    this.makeArray(e.detail.data.reverse()).forEach( item => {
                        store = store.splice(e.detail.index,1,item);
                    });
                }
                else {
                    this.makeArray(e.detail.data).forEach( item => store.push(item));
                }
                break;
            case 'remove':
                this.makeArray(e.detail.data).forEach( removeItem => {
                    let i = store.findIndex( item => item[e.detail.key] === removeItem[e.detail.key]);
                    store = store.splice(i,1);
                })
                break;
            case 'update':
                this.makeArray(e.detail.data.reverse()).forEach( updateItem => {
                    let i = store.findIndex( item => item[e.detail.key] === updateItem[e.detail.key]);
                    store = store.splice(i,1,updateItem);
                })
                break;
            default:
                store = e.detail.data;
                break;
        }
        this.stores[e.type] = store;
        this.dispatch(e.type);
    }
    makeArray(item){
        if(Array.isArray(item)){
            return item;
        }
        return [item];
    }
    dispatch(type){
        console.log(`dispatching "storehouse-${type}"`);
        document.dispatchEvent( new CustomEvent(`storehouse-${type}`, {
            detail: {
                data: this.stores[type]
            },
            bubbles: true
        }));
    }
    dispatchAll(){
        for(let store in this.stores ){
            if(this.stores.hasOwnProperty(store)){
                this.dispatch(store);
            }
        }
    }
};
