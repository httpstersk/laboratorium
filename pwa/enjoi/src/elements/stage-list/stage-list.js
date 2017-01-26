import firebase from 'firebase';
import { initialState, store } from '../../store/store';

const DATA_URL = '../data/data.json';
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBe6D2gJvJCkHez4cArito9P-c74Vvuzns",
    authDomain: "enjoi-efb8e.firebaseapp.com",
    databaseURL: "https://enjoi-efb8e.firebaseio.com",
    storageBucket: "enjoi-efb8e.appspot.com",
    messagingSenderId: "323606862579"
};

export class StageList extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['stage'];
    }

    connectedCallback() {
        this._initFirebase(FIREBASE_CONFIG);
        this._readDataFromFirebase();

        store.subscribe(_ => {
            this.artists = store.getState().artists;
            if (!this.artists) return;
            this.render(this.artists);
        });
    }

    _initFirebase(config) {
        firebase.initializeApp(config);
    }

    _readDataFromFirebase() {
        firebase.database().ref().once('value')
            .then(snapshot => snapshot.val()[0])
            .then(val => {
                const { artists } = val;

                store.dispatch({
                    type: 'INIT_ARTISTS',
                    artists: [...artists]
                });
            });
    }

    _fetchArtists(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network request failed! 💩');
                }
                return response;
            })
            .then(res => res.json())
            .then(json => this.artists = json.map(d => d.artists))
            .then(artists => {
                store.dispatch({
                    type: 'INIT_ARTISTS',
                    artists: [...artists]
                });
            }, () => {
                this.artists = initialState.artists;
            });
    }

    render(artists) {
        this.innerHTML = `
            <geo-location></geo-location>
            <stage-artists artists='${JSON.stringify(artists)}'></stage-artist>
        `;
    }
}