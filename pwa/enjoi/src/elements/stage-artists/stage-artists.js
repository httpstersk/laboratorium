export class StageArtists extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['artists'];
    }

    connectedCallback() {
        this.artists = this.getAttribute('artists');

        if (MutationObserver) {
            this.observer = new MutationObserver(mutations => {
                this.render();
            });

            const observerConfig = { attributes: true };
            this.observer.observe(this, observerConfig);
        }

        Object.assign(this.style, {
            alignItems: 'center',
            backgroundColor: 'gray',
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            width: '100%'
        });

        this.render();
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

    render() {
        this.innerHTML = this.artists.map(artist => {
            return `<stage-artist artist="${artist.name}"></stage-artist>`;
        }).join('')
    }
}