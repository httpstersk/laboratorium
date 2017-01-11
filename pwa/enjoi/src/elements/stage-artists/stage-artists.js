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
        this._listeners();
        this.render();

        this.update = this.update.bind(this);
        requestAnimationFrame(this.update);
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

    _listeners() {
        this.addEventListener('touchstart', this._onDragStart);
        this.addEventListener('touchmove', this._onDragMove);
        this.addEventListener('touchend', this._onDragEnd);

        this.addEventListener('mousedown', this._onDragStart);
        this.addEventListener('mousemove', this._onDragMove);
        this.addEventListener('mouseup', this._onDragEnd);
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
        if (!this._target || !this._dragging) return;

        this._deltaX = this._currentX - this._startX;
        this.style.transform = `translateX(${this._deltaX}px)`;
    }

    render() {
        this.root.innerHTML = this.artists.map(artist => {
            return `<stage-artist artist="${artist.name}" class="${artist.status}"></stage-artist>`;
        }).join('');
    }
}