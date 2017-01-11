export class StageArtist extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['artist', 'status'];
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

    get status() {
        return this.getAttribute('status');
    }

    set status(val) {
        this.setAttribute('status', val);
    }

    render() {
        this.root.innerHTML = `
            <style>
                :host {
                    align-items: center;
                    background-color: var(--boring-grey-color);
                    color: #808080;
                    display: flex;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                    min-width: var(--artist-width);
                    text-align: center
                }

                :host(.live) {
                    background-color: white;
                }

                :host strong {
                    text-transform: uppercase;
                    transform: rotate(-90deg);
                }

                :host .status {
                    background-color: #666;
                    bottom: 10vh;
                    border-radius: 50%;
                    color: var(--boring-grey-color);
                    display: flex;
                    font-size: 20px;
                    height: calc(var(--artist-width) / 2);
                    justify-content: center;
                    line-height: calc(var(--artist-width) / 2);
                    position: absolute;
                    text-transform: uppercase;
                    width: calc(var(--artist-width) / 2);
                }

                :host(.live)  .status {
                    background-color: var(--highlight-color);
                    color: white;
                }
            </style>
            
            <strong>${this.artist}</strong>
            <span class="status">${this.status}</span>`;
    }
}