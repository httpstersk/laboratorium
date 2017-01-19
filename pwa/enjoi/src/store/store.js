import { createStore } from 'redux';

const initialState = {
    artists: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_ARTISTS':
            const artists = state.artists.slice(0);
            return Object.assign({}, ...state, { artists: action.artists });

        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;