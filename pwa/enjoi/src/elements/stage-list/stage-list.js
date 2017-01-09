export class StageList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        Object.assign(this.style, {
            alignItems: 'center',
            backgroundColor: 'gray',
            display: 'flex',
            height: '100vh',
            minWidth: '600px'
        });

        this.render();
    }

    render() {

    }
}