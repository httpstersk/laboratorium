export class StageArtist extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['artist', 'status', 'score'];
    }

    connectedCallback() {
        this._onClick = this._onClick.bind(this);

        if (this.classList.contains('live')) {
            this.addEventListener('click', this._onClick);
        }

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

    get score() {
        return this.getAttribute('score');
    }

    set score(val) {
        this.setAttribute('score', val);
    }

    _onClick(event) {
        this.classList.toggle('opened');
    }

    render() {
        this.root.innerHTML = `
            <style>
                :host {
                    align-items: center;
                    background-color: var(--boring-grey-color);
                    box-shadow: 0 0 var(--shadow-spread) rgba(0, 0, 0, 0.1);
                    color: #808080;
                    display: flex;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                    position: relative;
                    text-align: center;
                    transition: flex 250ms var(--custom-easing);
                    z-index: 1;
                }

                :host(.opened) {
                    flex: 2;
                }

                .enjoi-bar {
                    height: 100%;
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
                    transform: rotate(-90deg);
                    width: 100vh;
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

                .bar {
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                    width: 100%;
                }

                .artist {
                    color: #606060;
                    mix-blend-mode: darken;
                    text-transform: uppercase;
                    transform: rotate(-90deg);
                }

                :host(.live) .artist {
                    color: var(--highlight-color);
                    mix-blend-mode: multiply;
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
                <div class="bar">
                    <input type="range" value="${this.score}" min="0" max="100" step="1">
                    <progress value="${this.score}" max="100"></progress>
                </div>
            </div>
        `;
    }
}