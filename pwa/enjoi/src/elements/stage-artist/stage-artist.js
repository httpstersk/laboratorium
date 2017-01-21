import { addMinutes, format } from 'date-fns';

export class StageArtist extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['artist', 'status', 'score', 'start', 'minutes'];
    }

    connectedCallback() {
        this._onClick = this._onClick.bind(this);
        this._onTransitionEnd = this._onTransitionEnd.bind(this);

        if (this.classList.contains('live')) {
            this.addEventListener('click', this._onClick, { once: true });
            this.addEventListener('transitionend', this._onTransitionEnd, { once: true });
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

    get start() {
        return this.getAttribute('start');
    }

    get minutes() {
        return this.getAttribute('minutes');
    }

    _onClick(event) {
        this.classList.add('opened');

        this.dispatchEvent(new CustomEvent('opened', {
            bubbles: true,
            composed: true,
            detail: {}
        }));
    }

    _onTransitionEnd(event) {
        const range = this.root.querySelector('input');
        const progress = this.root.querySelector('progress');

        range.addEventListener('input', () => progress.value = range.value);

        range.addEventListener('change', () => {
            this.dispatchEvent(new CustomEvent('score-changed', {
                bubbles: true,
                composed: true,
                detail: { score: range.value }
            }));

            progress.value = range.value;
        });
    }

    render() {
        const start = format(this.start, 'HH:mm');
        const end = format(addMinutes(this.start, this.minutes), 'HH:mm');

        this.root.innerHTML = `
            <style>
                :host {
                    align-items: center;
                    animation: translate 250ms ease 0s forwards;
                    background-color: var(--boring-grey-color);
                    box-shadow: 0 0 var(--shadow-spread) rgba(0, 0, 0, 0.1);
                    color: #808080;
                    display: flex;
                    flex: 1;
                    height: 100%;
                    justify-content: center;
                    position: relative;
                    text-align: center;
                    transform: translateY(100%);
                    transition: flex 250ms var(--custom-easing);
                    will-change: transform;
                    z-index: 1;
                }

                @keyframes translate {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
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
                    height: 100%;
                    left: 0;
                    margin: 0;
                    outline: none;
                    position: absolute;
                    transform: rotate(-90deg);
                    vertical-align: middle;
                    width: 100vh;
                    z-index: 1;
                }

                :host(.live) .enjoi-bar input {
                    cursor: ns-resize;
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
                    bottom: 15vh;
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

                time {
                    background-color: #808080;
                    bottom: 5vh;
                    color: white;
                    font-size: 16px;
                    padding: 4px;
                    position: absolute;
                }
            </style>
            
            <strong class="artist">${this.artist}</strong>
            <span class="status">${this.status}</span>
            <time class="start">${start} – ${end}</time>

            <div class="enjoi-bar">
                <div class="bar">
                    <input type="range" value="${this.score}" min="0" max="100" step="5">
                    <progress value="${this.score}" max="100"></progress>
                </div>
            </div>
        `;
    }
}