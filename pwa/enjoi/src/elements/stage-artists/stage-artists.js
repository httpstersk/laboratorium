export class StageArtists extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
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
    }

    _removeListeners() {
        this.removeEventListener('touchstart', this._onDragStart);
        this.removeEventListener('touchmove', this._onDragMove);
        this.removeEventListener('touchend', this._onDragEnd);

        this.removeEventListener('mousedown', this._onDragStart);
        this.removeEventListener('mousemove', this._onDragMove);
        this.removeEventListener('mouseup', this._onDragEnd);
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
        this.root.innerHTML = this.artists.map(artist => {
            if (artist.status === 'played') {
                artist.status = `${artist.score} %`;
            }

            return `<stage-artist artist="${artist.artist}" status="${artist.status}" class="${artist.status}" score="${artist.score}"></stage-artist>`;
        }).join('');

        [this.live] = [...this.root.children].filter(el => el.classList.contains('live'));
        this._offsetX = (this.offsetWidth / 2) - (this.live.offsetWidth / 2) - this.live.offsetLeft;
        this.style.transform = `translateX(${this._offsetX}px)`;
    }
}