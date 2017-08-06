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
        this._getStagesFromFirebase();
        this._getArtistsFromFirebase();

        store.subscribe(_ => {
            const state = store.getState();

            this.artists = state.stage.artists;
            this.coords = state.stage.coords;
            this.stageId = state.stage.stageId;
            if (!this.artists) return;
            this.render();
        });

        this.addEventListener('is-near-stage', this._onIsNearStage, {
            once: true
        });

        this.allCoords = [];
    }

    _initFirebase(config) {
        firebase.initializeApp(config);
    }

    _onIsNearStage(event) {
        const stageId = event.detail.stageId;
        console.log('📍', stageId);
        this._getArtistsFromFirebase(stageId);
    }

    _getArtistsFromFirebase(stageId = 0) {
        firebase
            .database()
            .ref()
            .once('value')
            .then(snapshot => snapshot.child(stageId).val())
            .then(data =>
                store.dispatch(
                    initArtists(data.artists, data.coords, data.index, stageId)
                )
            );
    }

    _getStagesFromFirebase() {
        firebase.database().ref().once('value').then(snapshot => {
            snapshot.forEach(child => {
                const coords = child.val().coords;
                this.allCoords.push(coords);
            });

            return this.allCoords;
        });
    }

    render() {
        const artists = JSON.stringify(this.artists);
        const coords = JSON.stringify(this.allCoords);

        this.innerHTML = `
            <geo-location coords='${coords}'></geo-location>
            <stage-artists artists='${artists}'></stage-artist>
        `;
    }
}