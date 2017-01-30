import firebase from 'firebase';
import { initialState, store } from '../../store/store';
import { initArtists } from '../../actions/stage';

const LOCAL_DATA_URL = '../data/data.json';
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
            this.artists = store.getState().stage.artists;
            this.coords = store.getState().stage.coords;
            if (!this.artists) return;
            this.render();
        });
    }

    _initFirebase(config) {
        firebase.initializeApp(config);
    }

    _readDataFromFirebase() {
        firebase.database().ref().once('value')
            .then(snapshot => snapshot.child(0).val())
            .then(state => store.dispatch(initArtists(state.artists, state.coords)));
    }

    _fetchLocalData(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network request failed! 💩');
                }
                return response;
            })
            .then(res => res.json())
            .then(stages => {
                const stage = stages[0];
                store.dispatch(initArtists(stage.artists, stage.coords))
            })
            .catch(err => console.warn('💩'));
    }

    render() {
        const artists = JSON.stringify(this.artists);
        const coords = JSON.stringify(this.coords);

        this.innerHTML = `
            <geo-location target='${coords}'></geo-location>
            <stage-artists artists='${artists}'></stage-artist>
        `;
    }
}