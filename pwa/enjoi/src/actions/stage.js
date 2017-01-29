export function initArtists(artists, coords) {
    return {
        type: 'INIT_ARTISTS',
        artists,
        coords
    };
}