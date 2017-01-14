const DATA_URL = '../data/data.json'

export class StageList extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['stage'];
    }

    connectedCallback() {
        this._fetchArtists(DATA_URL);
    }

    _fetchArtists(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => this.artists = json.map(d => d.artists))
            .then(artists => this.render(this.artists))
            .catch(error => console.error('💩', error));
    }

    render(artists) {
        this.innerHTML = artists.map(artist => {
            return `<stage-artists artists='${JSON.stringify(artist)}'></stage-artist>`;
        }).join('');
    }
}