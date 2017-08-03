import firebase from 'firebase';

const updateFirebaseField = (stageId, child, index, prop, value) => {
    return firebase.database().ref().child(stageId).child(child).update({
        [`${index}/${prop}`]: value
    });
};

const initialState = {
    stageId: null,
    coords: {},
    artists: []
};

const stageReducer = (state = initialState, action) => {
    const { artists, coords, id, live, score, stageId, status, type } = action;

    switch (type) {
        case 'INIT_ARTISTS':
            return {
                ...state,
                artists: [...artists],
                coords: {...coords },
                stageId: stageId
            };

        case 'UPDATE_SCORE':
            state.artists
                .filter(artist => artist.id === id)
                .map(artist => (artist.score = score));

            updateFirebaseField(stageId, 'artists', id, 'score', score);
            return Object.assign({}, state);

        case 'UPDATE_STATUS':
            const currId = id;
            const nextId = currId + 1;

            state.artists.filter(artist => artist.id === currId).map(artist => {
                artist.status = status;
                artist.live = live;
            });

            state.artists.filter(artist => artist.id === nextId).map(artist => {
                artist.status = 'live';
                artist.live = true;
            });

            updateFirebaseField(stageId, 'artists', currId, 'status', 'played');
            updateFirebaseField(stageId, 'artists', currId, 'live', false);

            updateFirebaseField(stageId, 'artists', nextId, 'status', 'live');
            updateFirebaseField(stageId, 'artists', nextId, 'live', true);
            return Object.assign({}, state);

        default:
            return state;
    }
};

export default stageReducer;