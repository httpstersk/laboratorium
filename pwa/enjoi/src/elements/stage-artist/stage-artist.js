export class StageArtist extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['artist'];
    }

    connectedCallback() {
        Object.assign(this.style, {
            alignItems: 'center',
            backgroundColor: '#b3b3b3',
            color: '#808080',
            display: 'flex',
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center'
        });

        this.render();
    }

    get artist() {
        return this.getAttribute('artist');
    }

    set artist(val) {
        this.setAttribute('artist', val);
    }

    render() {
        const strong = document.createElement('strong');
        strong.textContent = this.artist;

        Object.assign(strong.style, {
            textTransform: 'uppercase',
            transform: 'rotate(-90deg)'
        });

        this.root.appendChild(strong);
    }
}