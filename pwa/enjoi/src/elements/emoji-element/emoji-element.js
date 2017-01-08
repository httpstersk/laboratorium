'use strict';

import './emoji-element.css';

export class EmojiElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <h2>😊</h2>
        `;
    }
}