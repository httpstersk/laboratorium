import { createStore } from 'redux';

const initialState = {
    artists: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_ARTISTS':
            return Object.assign({}, state, { artists: action.artists });
            break;

        case 'UPDATE_SCORE':
            const [artists] = state.artists;
            artists
                .filter(artist => artist.live === true)
                .map(artist => artist.score = action.score);
            return Object.assign({}, state);
            break;

        default:
            return state;
    }
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export { initialState, store };