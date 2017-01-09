export class StageArtists extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['artists'];
    }

    connectedCallback() {
        this.artists = this.getAttribute('artists');
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
            return `<stage-artist artist="${artist.name}">${artist.name}</stage-artist>`;
        }).join('')
    }
}