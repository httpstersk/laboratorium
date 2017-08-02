import firebase from 'firebase';
import store from '../../store/store';
import { initArtists } from '../../actions/stage';

const LOCAL_DATA_URL = '../data/data.json';
const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBe6D2gJvJCkHez4cArito9P-c74Vvuzns',
    authDomain: 'enjoi-efb8e.firebaseapp.com',
    databaseURL: 'https://enjoi-efb8e.firebaseio.com',
    storageBucket: 'enjoi-efb8e.appspot.com',
    messagingSenderId: '323606862579'
};

export class StageList extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['stage'];
    }

    connectedCallback() {
        this._onIsNearStage = this._onIsNearStage.bind(this);
        this._initFirebase(FIREBASE_CONFIG);
        this._readDataFromFirebase();

        store.subscribe(_ => {
            this.artists = store.getState().stage.artists;
            this.coords = store.getState().stage.coords;
            this.stageId = store.getState().stage.index;
            if (!this.artists) return;
            this.render();
        });

        this.addEventListener('is-near-stage', this._onIsNearStage, {
            once: true
        });
    }

    _initFirebase(config) {
        firebase.initializeApp(config);
    }

    _onIsNearStage(event) {}

    _readDataFromFirebase() {
        firebase
            .database()
            .ref()
            .once('value')
            .then(snapshot => snapshot.child(0).val())
            .then(state =>
                store.dispatch(
                    initArtists(state.artists, state.coords, state.index)
                )
            );
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
                store.dispatch(
                    initArtists(stage.artists, stage.coords, state.index)
                );
            })
            .catch(err => console.warn('💩'));
    }

    render() {
        const artists = JSON.stringify(this.artists);
        const coords = JSON.stringify(this.coords);
        const stageId = JSON.stringify(this.stageId);

        console.log({ stageId });

        this.innerHTML = `
            <geo-location target='${coords}' stage-id='${stageId}'></geo-location>
            <stage-artists artists='${artists}'></stage-artist>
        `;
    }
}