import firebase from 'firebase';

const updateFirebaseField = (child, index, prop, value) => {
    return firebase.database().ref().child('0').child(child).update({
        [`${index}/${prop}`]: value
    });
};

const initialState = {
    stageId: null,
    coords: {},
    artists: []
};

const stageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_ARTISTS':
            return {
                ...state,
                stageId: action.stageId,
                artists: [...action.artists],
                coords: {...action.coords }
            };

        case 'UPDATE_SCORE':
            state.artists
                .filter(artist => artist.id === action.id)
                .map(artist => (artist.score = action.score));

            updateFirebaseField('artists', action.id, 'score', action.score);
            return Object.assign({}, state);

        case 'UPDATE_STATUS':
            const currId = action.id;
            const nextId = currId + 1;

            state.artists.filter(artist => artist.id === currId).map(artist => {
                artist.status = action.status;
                artist.live = action.live;
            });

            state.artists.filter(artist => artist.id === nextId).map(artist => {
                artist.status = 'live';
                artist.live = true;
            });

            updateFirebaseField('artists', currId, 'status', 'played');
            updateFirebaseField('artists', currId, 'live', false);

            updateFirebaseField('artists', nextId, 'status', 'live');
            updateFirebaseField('artists', nextId, 'live', true);
            return Object.assign({}, state);

        default:
            return state;
    }
};

export default stageReducer;