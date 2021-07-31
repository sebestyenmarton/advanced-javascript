import { GenericTableComponent } from './generic-list/generic-todo-component.mjs';
import { GenericTableStore } from './generic-list/generic-todo-store.mjs';
import { Employee } from './Todo.mjs';

// condition when page is ready then call init, else create event listener which wait till the page is loaded
if (document.readyState === 'complete') {
    this.init();
} else {
    window.addEventListener('load', init);
}

// application start here
function init() {
    // remove event listener, we not need anymore
    window.removeEventListener('load', init);

    // we create a table config
    const listConfig = {
        model: Employee,
        endpoint: 'https://60fd9bcc1fa9e90017c70f18.mockapi.io/api/todos/',
        attributes: {},
        formFields: [
            { placeholder: 'Title', name: 'title', type: 'text', required: true }, 
            { placeholder: 'Due Date', name: 'dueDate', type: 'text', required: true },
        ],
        beforeFormSubmit: (data) => {
            data.salary = parseInt(data.salary);  //átalakítja ,pl ha '1'az adat, akkor 1-re alakítja
            data.createdAt = new Date();
            return data;
        },
        searchFilter: (searchTerm, item) => {
            if (
                searchTerm === '' || item.title.includes(searchTerm) 
            ) {
                return true;
            }
            return false;
        },
        columns: [
/*             {
                id: 'isDone',
                label: 'Is Done',
                getCellValue: (user) => user.isDone,
                attributes: {},
                sorter: (user1, user2) => user1.isDone.localeCompare(user2.isDone)
            },   */
            {
                id: 'title',
                label: 'Title',
                getCellValue: (user) => user.title,
                attributes: {},
                sorter: (user1, user2) => user1.title.localeCompare(user2.title)
            },
            {
                id: 'dueDate',
                label: 'Due Date',
                getCellValue: (user) => user.dueDate instanceof Date ? user.dueDate.toISOString().substr(0, 19).replace('T', ' ') : (user.dueDate || '-'),
                attributes: {},
                sorter: (user1, user2) => new Date (user1.dueDate).getTime() > new Date(user2.dueDate).getTime() ? 1 : -1
            },

/*             {
                id: 'id',
                label: 'Id',
                getCellValue: (user) => user.id,
                attributes: {},
                sorter: (user1, user2) => user1.id.localeCompare(user2.id)
            },
            {
                id: 'createdAt',
                label: 'Created at',
                getCellValue: (user) => user.createdAt instanceof Date ? user.createdAt.toISOString().substr(0, 19).replace('T', ' ') : (user.createdAt || '-'),
                attributes: {},
                sorter: (user1, user2) => new Date (user1.createdAt).getTime() > new Date(user2.createdAt).getTime() ? 1 : -1
            }, */  
        ]
    };

    // search four our parent element, where we will insert our table component
    const parentElement = document.querySelector('#root');

    // table store, handle CRUD and logic
    const tableStore = new GenericTableStore(listConfig);

    // initialize the table component
    const cmp = new GenericTableComponent(tableStore);

    // mount into parent element
    cmp.mount(parentElement);
}