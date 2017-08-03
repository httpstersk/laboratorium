export const updateScore = (stageId, id, score) => ({
    type: 'UPDATE_SCORE',
    id,
    score,
    stageId
});

export const updateStatus = id => ({
    type: 'UPDATE_STATUS',
    status: 'played',
    live: false,
    id
});