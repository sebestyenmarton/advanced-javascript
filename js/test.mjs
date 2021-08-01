// test purpose

class Task {
    id = undefined;
    title = undefined;
    isDone = undefined;
    dueDate  = undefined;
    createdAt = undefined;

    constructor(initData) {
        if (typeof initData !== 'object') { return; }
        Object.keys(initData)
            .filter(propertyName => this.hasOwnProperty(propertyName))
            .forEach(propertyName => this[propertyName] = initData[propertyName]);
    }
}

const listConfig = {
    model: Task,
    endpoint: 'https://60fd9bcc1fa9e90017c70f18.mockapi.io/api/todos/',
    attributes: {},
    formFields: [
        { placeholder: 'Title', name: 'title', type: 'text', required: true }, 
        { placeholder: 'Is Done', name: 'isDone', type: 'checkbox' },
        { placeholder: 'Due Date', name: 'dueDate', type: 'datetime-local', required: true }, 
    ],
    beforeFormSubmit: (data) => {
        data.createdAt = new Date();
        return data;
    },
    searchFilter: (searchTerm, item) => {
        if (
            searchTerm === '' ||
            item.title.includes(searchTerm)
        ) {
            return true;
        }
        return false;
    },
    columns: [
        {
            id: 'title',
            label: 'Title',
            getCellValue: (task) => task.title,
            attributes: {},
            sorter: (task1, task2) => task1.title.localeCompare(task2.title)

        },
        {
            id: 'isDone',
            label: 'Is Done',
            getCellValue: (task) => task.isDone ? 'Yes' : 'No',
            attributes: {},
        },
        {
            id: 'dueDate',
            label: 'Due Date',
            getCellValue: (task) => task.dueDate instanceof Date ? task.dueDate.toISOString().substr(0, 16) : (task.dueDate || ''),
            attributes: {},
            sorter: (task1, task2) => new Date (task1.createdAt).getTime() > new Date(task2.createdAt).getTime() ? 1 : -1
        },
        {
            id: 'createdAt',
            label: 'Created at',
            getCellValue: (task) => task.createdAt instanceof Date ? task.createdAt.toISOString().substr(0, 19).replace('T', ' ') : (task.createdAt || '-'),
            attributes: {},
            sorter: (task1, task2) => new Date (task1.createdAt).getTime() > new Date(task2.createdAt).getTime() ? 1 : -1
        },
    ]
};
