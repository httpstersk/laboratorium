const EMOJI_API = 'https://emoji.getdango.com/api/emoji?q=';

export const fetchEmojis = text => {
    return fetch(`${EMOJI_API}${text}`)
        .then(res => res.json())
        .then(({ results }) => results)
};
