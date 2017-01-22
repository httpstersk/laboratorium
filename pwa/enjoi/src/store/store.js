import { createStore } from 'redux';
import firebase from 'firebase';

const initialState = {
    artists: []
};

const updateFirebaseField = (child, index, prop, value) => {
    return firebase.database().ref().child('0')
        .child(child)
        .update({
            [`${index}/${prop}`]: value
        });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_ARTISTS':
            return Object.assign({}, state, { artists: action.artists });
            break;

        case 'UPDATE_SCORE':
            state.artists
                .filter(artist => artist.live === true)
                .map(artist => artist.score = action.score);

            updateFirebaseField('artists', action.id, 'score', action.score);
            return Object.assign({}, state);
            break;

        case 'UPDATE_STATUS':
            const currId = action.id;
            const nextId = parseInt(action.id) + 1;

            state.artists
                .filter(artist => artist.id === currId)
                .map(artist => {
                    artist.status = action.status;
                    artist.live = action.live;
                });

            state.artists
                .filter(artist => artist.id === nextId)
                .map(artist => {
                    artist.status = 'status';
                    artist.status = 'live'
                });

            updateFirebaseField('artists', currId, 'status', action.status);
            updateFirebaseField('artists', currId, 'live', action.live);

            updateFirebaseField('artists', nextId, 'status', 'live');
            updateFirebaseField('artists', nextId, 'live', true);
            return Object.assign({}, state);
            break;

        default:
            return state;
    }
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export { initialState, store };