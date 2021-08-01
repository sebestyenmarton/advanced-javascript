export class BaseComponent {
    currentElement = null;
    parentElem = null;

    constructor() {
        this.refresh = this.refresh.bind(this);
    }

    renderElement(data) {
        if (typeof data !== 'object') {
            if (typeof data === 'string') {
                return document.createTextNode(data);
            } else if (typeof data === 'number') {
                return document.createTextNode(String(data));
            }
        }
        const { tagName, attributes, children } = data; 
            //= const { div, className: 'generic-list-page', 
            // [ renderSearchBar(),renderAddButton(),renderUl() ]}; from generic-list-page-component
        const element = document.createElement(tagName.toUpperCase());
        if (typeof attributes === 'object') {
            for (let attributeName in attributes) {
                element[attributeName] = attributes[attributeName];
            }
        }
        if (Array.isArray(children)) { 
            for (const child of children) {
                if (!child) { continue; }
                element.appendChild(this.renderElement(child));
            }
        }
        return element;
    }

    // initial we can mount component with this callback
    mount(parentElement) {
        const elem = this.render();
        if (this.currentElement) {
            this.currentElement.replaceWith(elem);
        } else {
            parentElement.appendChild(elem);
        }
        this.currentElement = elem;
        this.parentElem = parentElement;
    }

    refresh() {
        this.mount(this.parentElem);
    }
}
