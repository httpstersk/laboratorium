import { store } from '../../store/store';
import { encapsulate } from '../../utils/utils';
import { updateScore } from '../../actions/artist';

export class StageArtists extends HTMLElement {
    constructor() {
        super();
        encapsulate(this);
    }

    static get observedAttributes() {
        return ['artists'];
    }

    connectedCallback() {
        this.artists = this.getAttribute('artists');
        this._startX = 0;
        this._currentX = 0;
        this._deltaX = 0;
        this._offsetX = 0;
        this._dragging = false;

        if (MutationObserver) {
            this.observer = new MutationObserver(mutations => {
                this.update();
            });

            const observerConfig = { attributes: true };
            this.observer.observe(this, observerConfig);
        }

        this._button = document.createElement('button');
        this._button.setAttribute('is', 'confirm-button');
        this._button.textContent = 'OK';

        Object.assign(this._button.style, {
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 0 var(--shadow-spread) rgba(0, 0, 0, 0.1)',
            color: 'var(--boring-grey-color)',
            cursor: 'pointer',
            fontSize: '20px',
            height: 'var(--status-size)',
            lineHeight: 'var(--status-size)',
            opacity: 0,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            top: '50%',
            width: 'var(--status-size)',
            zIndex: 3
        });

        this._onDragStart = this._onDragStart.bind(this);
        this._onDragMove = this._onDragMove.bind(this);
        this._onDragEnd = this._onDragEnd.bind(this);
        this._addListeners();
        this.render();

        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
    }

    disconnectedCallback() {
        this._removeListeners();
    }

    get artists() {
        const artists = this.getAttribute('artists');

        if (artists) {
            return JSON.parse(artists);
        }
    }

    set artists(val) {
        this.setAttribute('artists', val);
    }

    _addListeners() {
        this.addEventListener('touchstart', this._onDragStart);
        this.addEventListener('touchmove', this._onDragMove);
        this.addEventListener('touchend', this._onDragEnd);

        this.addEventListener('mousedown', this._onDragStart);
        this.addEventListener('mousemove', this._onDragMove);
        this.addEventListener('mouseup', this._onDragEnd);

        this.addEventListener('opened', this._removeListeners);
        this.addEventListener('score-changed', this._onScoreChanged);
    }

    _removeListeners() {
        this.removeEventListener('touchstart', this._onDragStart);
        this.removeEventListener('touchmove', this._onDragMove);
        this.removeEventListener('touchend', this._onDragEnd);

        this.removeEventListener('mousedown', this._onDragStart);
        this.removeEventListener('mousemove', this._onDragMove);
        this.removeEventListener('mouseup', this._onDragEnd);

        this.removeEventListener('opened', this._removeListeners);
    }

    _onDragStart(event) {
        this._target = event.target;
        this._startX = event.pageX || event.touches[0].pageX;
        this._currentX = this._startX;

        this._target.style.willChange = 'transform';
        this._dragging = true;

        event.preventDefault();
        event.stopPropagation();
    }

    _onDragMove(event) {
        if (!this._target || !this._dragging) return;

        this._currentX = event.pageX || event.touches[0].pageX;

        event.preventDefault();
        event.stopPropagation();
    }

    _onDragEnd(event) {
        if (!this._target || !this._dragging) return;

        this._dragging = false;
        event.preventDefault();
        event.stopPropagation();
    }

    _onScoreChanged(event) {
        this._button.style.opacity = 1;
        this._button.focus();
        this._button.addEventListener('click', () => {
            store.dispatch(updateScore(parseInt(event.detail.id, 10), event.detail.score));
        });
    }

    update() {
        requestAnimationFrame(this.update);
        if (!this._target) return;

        if (this._dragging) {
            this._deltaX = this._currentX - this._startX + this._offsetX;
        } else {
            this._deltaX = this._offsetX;
        }

        if (this._deltaX === 0 || (this._lastDeltaX === this._deltaX)) return;

        this._lastDeltaX = this._deltaX;
        this.style.transform = `translateX(${this._deltaX}px)`;
    }

    render() {
            this.shadowRoot.innerHTML = `
            ${this.artists.map((artist, index) => {
                if (artist.status === 'played') {
                    artist.status = `${artist.score} %`;
                }

                return `<stage-artist style="animation-delay: ${index * 50}ms" artist="${artist.artist}" status="${artist.status}" live="${artist.live}" start="${artist.start}" minutes="${artist.minutes}" score="${artist.score}" index="${artist.id}"></stage-artist>`;
            }).join('')}
        `;

        this.shadowRoot.appendChild(this._button);

        [this.live] = [...this.shadowRoot.children].filter(el => el.classList.contains('live'));

        if (this.live) {
            this._offsetX = (this.offsetWidth / 2) - (this.live.offsetWidth / 2) - this.live.offsetLeft;
            this.style.transform = `translateX(${this._offsetX}px)`;

            const offsetBtn = this.live.offsetLeft + this.live.offsetWidth;
            this._button.style.left = `${offsetBtn}px`;
        }
    }
}