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
                    position: relative;
                    text-align: center;
                    z-index: 1;
                }

                .enjoi-bar {
                    background-color: tomato;
                    height: 100%;
                    margin: auto;
                    top: 0;
                    position: absolute;
                    width: 100%;
                    z-index: -1;
                }

                .enjoi-bar input {
                    background-color: transparent;
                    margin: 0;
                    left: 0;
                    outline: none;
                    position: absolute;
                    top: 0;
                    vertical-align: middle;
                    width: 100%;
                }

                .enjoi-bar progress {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 100%;
                    left: 0;
                    position: absolute;
                    top: 0;
                    width: 100%;
                }

                .enjoi-bar progress::-webkit-progress-bar {
                    background-color: var(--boring-grey-color);
                }

                .enjoi-bar progress::-webkit-progress-value {
                    background-color: #808080;
                }

                :host(.live) .enjoi-bar progress::-webkit-progress-bar {
                    background-color: white;
                }

                :host(.live) .enjoi-bar progress::-webkit-progress-value {
                    background-color: var(--enjoi-color);
                }

                :host(.live) {
                    background-color: white;
                    box-shadow: 0 0 var(--shadow-spread) rgba(0, 0, 0, 0.35);
                    cursor: pointer;
                    z-index: 2;
                }

                .artist {
                    text-transform: uppercase;
                    transform: rotate(-90deg);
                }

                .status {
                    background-color: #666;
                    bottom: 10vh;
                    border-radius: 50%;
                    color: var(--boring-grey-color);
                    display: flex;
                    font-size: 20px;
                    height: var(--status-size);
                    justify-content: center;
                    line-height: var(--status-size);
                    position: absolute;
                    text-transform: uppercase;
                    width: var(--status-size);
                }

                :host(.live) .status {
                    background-color: var(--highlight-color);
                    color: white;
                }
            </style>
            
            <strong class="artist">${this.artist}</strong>
            <span class="status">${this.status}</span>

            <div class="enjoi-bar">
                <input type="range" slot="range" value="50" min="0" max="100" step="1">
                <progress slot="progress" value="50" max="100"></progress>
            </div>
        `;
    }
}