class Storehouse {
    constructor(stores = {}, context = document){
        this.stores = stores;
        this.context = context;
    }
    update(type, store){
        let newStore = store(this.stores[type]);
        this.stores[type] = newStore;
        this.dispatch(type);
    }
    dispatch(type){
        this.context.dispatchEvent( new CustomEvent(`storehouse-${type}`, {
            detail: this.stores[type],
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
