function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0; 
      let v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export const SORT_DIRECTION = ['ASC', 'DESC'];

export class GenericTableStore {
    refreshCb = null;           // function
    tableConfig = null;         // table config
    currentItem = null;         // current item for add and edit
    sortableColumns = [];       // which columns should be sorted
    currentSort = [];           // [id, direction]
    searchTerm = '';            // search term
    items = [];                 // unfiltred items
    
    constructor(tableConfig) {
        this.tableConfig = tableConfig;
        this.init();
    }

    init() {
        const firstSortableColumn = this.tableConfig.columns.find(x => x.sorter);
        if (firstSortableColumn) {
            this.setSort(firstSortableColumn.id);
        }
        this.getList();
        
    }

    // --- CRUD method: get/created/update/delete ---
    get = async (id) => {
        const Model = this.tableConfig.model;
        const request = await fetch(this.tableConfig.endpoint + id);
        const item = await request.json();
        const mappedItem = new Model(item);
        return mappedItem;
    }   

    getList = async () => {
        const Model = this.tableConfig.model;
        const request = await fetch(this.tableConfig.endpoint);
        const items = await request.json();
        const mappedItems = items.map(x => new Model(x));
        this.setItems(mappedItems);
        return mappedItems;
    }    

    create = async (data) => {
        data.id = guid();
        const Model = this.tableConfig.model;
        const item = new Model(data);
        const request = await fetch(this.tableConfig.endpoint, { 
            method: 'POST', 
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const savedItem = await request.json();
        const mappedItem = new Model(savedItem);
        this.setItems([mappedItem, ...this.items, item]);
        return mappedItem;
    }

    update = async  (data) => {
        const request = await fetch(this.tableConfig.endpoint + data.id, { 
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        });
        const updatedItem = await request.json();
        const mappedItem = new Model(updatedItem);
        this.setItems(this.items.map(item => item.id === data.id ? mappedItem : item));
        return mappedItem;
    }

    delete = async (deletedItem) => {
        await fetch(this.tableConfig.endpoint + deletedItem.id, { method: 'DELETE' });
        this.setItems(this.items.filter(item => item.id !== deletedItem.id));
    }

    // --- Helper methods for item list ---

    getItems() {
        if (!this.searchTerm) { return this.items; }
        return this.items.filter(item => this.tableConfig.searchFilter(this.searchTerm, item));
    }

    // set item + refresh the component
    setItems(items) {
        this.items = items;
        if (this.refreshCb) {
            this.refreshCb();
        }
    }

    setCurrentItem(currentItem) {
        if (typeof currentItem === 'undefined') {
            const Model = this.tableConfig.model;
            currentItem = new Model();
        }
        this.currentItem = currentItem;
        if (this.refreshCb) {
            this.refreshCb();
        }
    }
    
    setSort = (id) => {
        const [ASC, DESC] = SORT_DIRECTION;
        const [currentId, direction] = this.currentSort;
        this.currentSort = [id, id === currentId && direction === ASC ? DESC : ASC];
        const column = this.tableConfig.columns.find(c => c.id === id);
        const sortedItems = this.items.sort((user1, user2) => column.sorter(user1, user2) * (this.currentSort[1] === DESC ? -1 : 1))
        this.setItems(sortedItems);
    }

    onSearch = (event) => {
        if (event.key !== "Enter") { return; }
        this.searchTerm = event.target.value.trim();
        if (this.refreshCb) {
            this.refreshCb();
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const inputList = Array.from(event.target.querySelectorAll(`input[name]`));
        const formData = inputList.reduce((data, inputElem) => {
            let value = inputElem.value;
            if (inputElem.type === 'checkbox') {
                value = inputElem.checked;
            } else if (inputElem.type === 'datetime-local') {
                value = new Date(value).toISOString();
            }
            data[inputElem.name] = value;
            return data;
        }, {});
        const data = Object.assign(this.currentItem, this.tableConfig.beforeFormSubmit(formData));
        event.target.reset();
        if (data.id) {
            this.update(data);
        } else {
            this.create(data);
        }
        this.setCurrentItem(null);
        return false;
    }
}
