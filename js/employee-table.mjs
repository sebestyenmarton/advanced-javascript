import { GenericTableComponent } from './generic-table/generic-table-component.mjs';
import { GenericTableStore } from './generic-table/generic-table-store.mjs';
import { Employee } from './Employee.mjs';

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
    const tableConfig = {
        model: Employee,
        endpoint: 'https://60fd9bcc1fa9e90017c70f18.mockapi.io/api/employees/',
        attributes: {},
        formFields: [
            { placeholder: 'Username', name: 'userName', type: 'text', required: true }, 
            { placeholder: 'First name', name: 'firstName', type: 'text', required: true },
            { placeholder: 'Last name', name: 'lastName', type: 'text', required: true }, 
            { placeholder: 'Email', name: 'email', type: 'text', required: true }, 
            { placeholder: 'Function', name: 'function', type: 'text', required: true }, 
            { placeholder: 'Salary', name: 'salary', type: 'number', required: true }
        ],
        beforeFormSubmit: (data) => {
            data.salary = parseInt(data.salary);
            data.createdAt = new Date();
            return data;
        },
        searchFilter: (searchTerm, item) => {
            if (
                searchTerm === '' ||
                item.userName.includes(searchTerm) ||
                item.firstName.includes(searchTerm) ||
                item.lastName.includes(searchTerm)
            ) {
                return true;
            }
            return false;
        },
        columns: [
            {
                id: 'fullName',
                label: 'Full name',
                getCellValue: (user) => user.getFullName(),
                attributes: {},
                sorter: (user1, user2) => user1.getFullName().localeCompare(user2.getFullName())

            },
            {
                id: 'userName',
                label: 'User name',
                getCellValue: (user) => user.userName,
                attributes: {},
                sorter: (user1, user2) => user1.userName.localeCompare(user2.userName)
            },
            {
                id: 'email',
                label: 'Email',
                getCellValue: (user) => user.email,
                attributes: {},
                sorter: (user1, user2) => user1.email.localeCompare(user2.email)
            },
            {
                id: 'function',
                label: 'Function',
                getCellValue: (user) => user.function,
                attributes: {},
                sorter: (user1, user2) => user1.function.localeCompare(user2.function)
            },            
            {
                id: 'salary',
                label: 'Salary',
                getCellValue: (user) => user.salary,
                attributes: {},
                sorter: (user1, user2) => user1.salary > user2.salary ? 1 : -1
            },
            {
                id: 'createdAt',
                label: 'Created at',
                getCellValue: (user) => user.createdAt instanceof Date ? user.createdAt.toISOString().substr(0, 19).replace('T', ' ') : (user.createdAt || '-'),
                attributes: {},
                sorter: (user1, user2) => new Date (user1.createdAt).getTime() > new Date(user2.createdAt).getTime() ? 1 : -1
            },
        ]
    };

    // search four our parent element, where we will insert our table component
    const parentElement = document.querySelector('#root');

    // table store, handle CRUD and logic
    const tableStore = new GenericTableStore(tableConfig);

    // initialize the table component
    const cmp = new GenericTableComponent(tableStore);

    // mount into parent element
    cmp.mount(parentElement);
}