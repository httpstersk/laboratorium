export class StageArtist extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['artist'];
    }

    connectedCallback() {
        this.render();
    }

    get artist() {
        return this.getAttribute('artist');
    }

    set artist(val) {
        this.setAttribute('artist', val);
    }

    render() {
        this.innerHTML = this.artist;
    }
}