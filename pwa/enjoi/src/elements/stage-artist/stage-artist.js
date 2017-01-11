export class StageArtist extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
            <style>
                :host {
                    align-items: center;
                    background-color: #b3b3b3;
                    color: #808080;
                    display: flex;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                    max-width: 200px;
                    text-align: center
                }

                :host(.live) {
                    background-color: white;
                }

                :host strong {
                    text-transform: uppercase;
                    transform: rotate(-90deg);
                }
            </style>`;
    }

    static get observedAttributes() {
        return ['artist'];
    }

    connectedCallback() {
        this.render();
    }

    get artist() {
        return this.getAttribute('artist');
    }

    set artist(val) {
        this.setAttribute('artist', val);
    }

    render() {
        const strong = document.createElement('strong');
        strong.textContent = this.artist;
        this.root.appendChild(strong);
    }
}