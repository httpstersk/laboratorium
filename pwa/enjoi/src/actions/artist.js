export const updateScore = (id, score) => ({
    type: 'UPDATE_SCORE',
    id,
    score
});

export const updateStatus = (id) => ({
    type: 'UPDATE_STATUS',
    status: 'played',
    live: false,
    id
});