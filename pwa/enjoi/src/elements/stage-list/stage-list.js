import store from '../../store/store';

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

        store.subscribe(_ => {
            this.artists = store.getState().artists;
            if (!this.artists) return;
            this.render();
        });
    }

    _fetchArtists(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => this.artists = json.map(d => d.artists))
            .then(artists => {
                store.dispatch({
                    type: 'INIT_ARTISTS',
                    artists: [...artists]
                });
            })
            .catch(error => console.error('💩', error));
    }

    render() {
            this.innerHTML = `${this.artists.map(artist => `<stage-artists artists='${JSON.stringify(artist)}'></stage-artist>`).join('')}`;
    }
}