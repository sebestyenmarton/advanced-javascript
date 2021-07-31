import { SORT_DIRECTION } from './generic-todo-store.mjs';
import { BaseComponent } from '../core/base-component.mjs';


export class GenericTableComponent extends BaseComponent {
    listConfig = null;
    store = null;

    constructor(store) {
        super();
        this.store = store;
        this.store.refreshCb = this.refresh;
        this.listConfig = store.listConfig;
    }

    renderUl = () => {
        //const headRow = this.renderHeadRow();
        const bodyRows = this.store.getItems().map(item => this.renderBodyRow(item));
        const ulist = { tagName: 'ul', attributes: this.listConfig.attributes, children: [ ...bodyRows] };
        return { tagName: 'div', attributes: { className: 'table-container' }, children: [ulist] };
    }

    renderHeadRow = () => { 
        const libox = this.listConfig.columns.map(column => {
            const ul = this.renderListHeadRow(column);
            return ul;
        });
        const actionLiBox = { tagName: 'div', children: ['Actions'], attributes: { className: 'enabling' }};
        const checkLiBox = { tagName: 'div', children: ['Is Done'], attributes: { className: 'enabling' }};
        return { tagName: 'li', children: [checkLiBox,...libox, actionLiBox] };
    }   

    renderBodyRow = (item) => {
        const libox = this.listConfig.columns.map(column => {
            const ul = this.renderUlLi(column.attributes, [column.getCellValue(item)]);
            return ul;
        });
        
        const deleteAction = { tagName: 'i', attributes: { className: 'fas fa-trash-alt', onclick: () => this.store.delete(item) }};
        const checkBox = { tagName: 'input', attributes: { type: 'checkbox', className: 'myCheck'} };
        const actionLiBox = this.renderUlLi({}, [deleteAction]);
        const checkLiBox = this.renderUlLi({}, [checkBox]);
/*         if(item.isDone === "false"){console.log("0");}
        if(item.isDone === "true"){console.log("1");} */
        console.log(item);
        return { tagName: 'li', attributes: { onclick: () => this.store.setCurrentItem(item) }, children: [checkLiBox, ...libox, actionLiBox] };
    }
                       // checkBox
    renderUlLi = (attributes, children) => {
        return { tagName: 'div', attributes, children };
    }

    renderListHeadRow = (column) => {
        const [ASC] = SORT_DIRECTION;
        const attributes = Object.assign({ className: 'sortable' }, column.attributes);
        const children = [
            { tagName: 'span', attributes: column.attributes, children: [column.label] }
        ];

        const [sortId, direction] = this.store.currentSort;
        if (column.sorter) {
            attributes.onclick = () => this.store.setSort(column.id);
            if (sortId === column.id) {
                const arrow = { tagName: 'span', attributes: { className: 'sort-arrow' }, children: [direction === ASC ? '↑': '↓'] };
                children.push(arrow);
            }
        }

        return { tagName: 'div', attributes, children };
    }

    renderForm = () => {

        const item = this.store.currentItem;

        const { formFields } = this.listConfig;

        const children = [
            { tagName: 'h2', children: 'Edit Form', attributes: { className: 'title' }, getCellValue: "TO DO LIST"},
        ];

        formFields.forEach(fieldAttributes => {
            let value = item[fieldAttributes.name] || '';
            if (fieldAttributes.type === 'checkbox') {
                fieldAttributes.checked = item[fieldAttributes.name]
            } else if (fieldAttributes.type === 'datetime-local' && typeof value === 'string') {
                value = value.substr(0, 16);
            }
            children.push({ tagName: 'input', attributes: {...fieldAttributes, value: value } });
        });

        children.push(
            { 
                tagName: 'button', 
                attributes: { type: 'button', 
                onclick: () => this.store.setCurrentItem() }, 
                children: ['Cancel'] 
            },
/*             { 
                tagName: 'input', 
                attributes: { type: 'checkbox'} 
            }, */
            { 
                tagName: 'input',  
                attributes: { value: 'Save', type: 'submit' } 
            },
            this.renderSearchBar(),
            this.renderHeadRow()
        );
        const form = { 
            tagName: 'form', 
            attributes: { onsubmit: this.store.onSubmit }, 
            children
        };

        return { 
            tagName: 'div', 
            attributes: { className: 'add-edit-form' }, 
            children: [form] }; 
    }

    renderSearchBar = () => {
        return { 
            tagName: 'div', 
            attribtues: { className: 'search-container' }, 
            children: [
                { 
                    tagName: 'input', 
                    attributes: { placeholder: 'search', className: 'search', value: this.store.searchTerm, onkeyup: this.store.onSearch } 
                }
            ]
        };
    }
    renderAddButton = () => {
        return { 
            tagName: 'div', 
            attributes: { className: 'add-container' }, 
            children: [
                { 
                    tagName: 'button', 
                    attributes: { onclick: () => this.store.setCurrentItem() }, 
                    children: ['+'] 
                }
            ] 
        };
    }
    render() {
        const children = [
            this.renderAddButton(),
            this.renderUl()
        ];
         if (this.store.currentItem) {
            children.unshift(this.renderForm());
        } 
        return this.renderElement({ tagName: 'div', attributes: { className: 'generic-table' }, children });
    }
}
