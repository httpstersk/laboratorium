export class ConfirmButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    static get extends() {
        return 'button';
    }

    static get observedAttributes() {
        return [];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.textContent = 'OK';
    }
}