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

        Object.assign(this.style, {
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 0 var(--shadow-spread) rgba(0, 0, 0, 0.1)',
            color: 'var(--boring-grey-color)',
            fontSize: '20px',
            height: 'var(--status-size)',
            lineHeight: 'var(--status-size)',
            position: 'absolute',
            transfom: 'translateY(-50%)',
            top: '50%',
            width: 'var(--status-size)',
            zIndex: 1
        });
    }

    render() {
        this.textContent = 'OK';
    }
}