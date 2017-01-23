import { encapsulate, fire } from '../../utils/utils';

const TICK_MS = 1000;

export class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        encapsulate(this);
    }

    static get observedAttributes() {
        return ['seconds'];
    }

    connectedCallback() {
        if (this.seconds < 0) this.remove();

        this.render();
        this.remaining = this.seconds;
        this.update();

        const counter = setInterval(() => {
            this.remaining--;
            this.update();

            if (this.remaining === 0) {
                this._onCountdownEnd(counter);
            }
        }, TICK_MS);
    }

    _onCountdownEnd(counter) {
        clearInterval(counter);
        fire(this, 'countdown-ended', {});
    }

    get seconds() {
        return parseInt(this.getAttribute('seconds'));
    }

    set seconds(val) {
        this.setAttribute('seconds', val);
    }

    update() {
        this.shadowRoot.querySelector('.seconds-left').textContent = this.remaining;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <time class="seconds-left"></time>
        `;
    }
}