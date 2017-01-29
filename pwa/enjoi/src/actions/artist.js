export function updateScore(id, score) {
    return {
        type: 'UPDATE_SCORE',
        id,
        score
    };
}

export function updateStatus(id) {
    return {
        type: 'UPDATE_STATUS',
        status: 'played',
        live: false,
        id
    };
}