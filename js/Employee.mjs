export class Employee {
    // we list property names for our self, so we know what property should have this object
    id = undefined;
    userName = undefined;
    salary = undefined;
    email = undefined;
    firstName = undefined;
    lastName = undefined;
    function = undefined;
    createdAt = undefined;

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(initData) {
        // check if we have initial data
        if (typeof initData !== 'object') { return; }
        // go over the initData propertyNames
        Object.keys(initData)
            .filter(propertyName => this.hasOwnProperty(propertyName))
            .forEach(propertyName => this[propertyName] = initData[propertyName]);
    }
}