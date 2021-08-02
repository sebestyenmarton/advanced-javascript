export class Employee {
    // we list property names for our self, so we know what property should have this object
    title = undefined;
    id = undefined;
    createdAt = undefined;
    isDone = undefined;
    dueDate = undefined;

    constructor(initData) {
        // check if we have initial data
        if (typeof initData !== 'object') { return; }
        // go over the initData propertyNames
        Object.keys(initData)
            .filter(propertyName => this.hasOwnProperty(propertyName))
            .forEach(propertyName => this[propertyName] = initData[propertyName]);
    }
}