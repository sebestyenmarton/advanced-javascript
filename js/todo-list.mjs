import { GenericlistComponent } from './generic-list-page/generic-todo-component.mjs';
import { GenericlistStore } from './generic-list-page/generic-todo-store.mjs';
import { Employee } from './Todo.mjs';

if (document.readyState === 'complete') { this.init(); } 
    else {window.addEventListener('load', init);}


function init() {
    window.removeEventListener('load', init);
    const listConfig = {
        model: Employee,
        endpoint: 'https://60fd9bcc1fa9e90017c70f18.mockapi.io/api/todos/',
        attributes: {},
        formFields: [
            { placeholder: 'Is Done', name: 'isDone', type: 'checkbox' },
            { placeholder: 'Title', name: 'title', type: 'text', required: true }, 
            { placeholder: 'Due Date', name: 'dueDate', type: 'text', required: true },
        ],
        beforeFormSubmit: (data) => {
            data.salary = parseInt(data.salary);  
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
            {
                id: 'isDone',
                label: 'Is Done',
                getCellValue: (task) => 
                    task.isDone 
                        ? 
                    { tagName: 'input', attributes: { type: 'checkbox', className: 'myCheck', checked: true}} 
                        : 
                    { tagName: 'input', attributes: { type: 'checkbox', className: 'myCheck', checked: false } },
                attributes: {},
            },
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
        ]
    };

    const parentElement = document.querySelector('#root');
    const listStore = new GenericlistStore(listConfig);
    const cmp = new GenericlistComponent(listStore);
    cmp.mount(parentElement);
}