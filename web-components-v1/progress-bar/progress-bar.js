class ProgressBar extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('mouseup', event => {
            event.preventDefault();

            if (event.button === 0) {
                this.increaseLimit();
            } else {
                this.decreaseLimit();
            }

            return false;
        });

        this.connected = false;
    }

    static get observedAttributes() {
        return ['max', 'current'];
    }

    connectedCallback() {
        this.max = this.getAttribute('max') || 5;
        this.current = this.getAttribute('current') || 0;
        this.connected = true;
        this.render();
    }

    disconnectedCallback() {}

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (this[name] !== newVal) {
            this[name] = newVal;
            this.refresh()
            this.dispatchEvent(new CustomEvent(`${name}-changed`), {
                detail: {
                    value: newVal
                }
            });
        }
    }

    updateAttribute(attr, newVal) {
        if (newVal !== undefined && newVal !== null) {
            const assignedValue = convertToNumber(newVal);
            this['_' + camelCase(attr)] = assignedValue;
            this.setAttribute(attr, assignedValue);
        }
    }

    get max() {
        return this._max;
    }

    set max(val) {
        this.updateAttribute('max', val);
    }

    get current() {
        return this._current;
    }

    set current(val) {
        this.updateAttribute('current', val);
    }

    getRatio() {
        if (this._current === 0) {
            return 0;
        }

        return Math.min(100, (parseInt(this._current) * 100) / parseInt(this._max));
    }

    render() {
        this.innerHTML = `
            <style>
                #progress-bar {
                    align-items: center;
                    background-color: #c6d7c7;
                    display: flex;
                    height: 100%;
                    position: relative;
                    width: 100%;
                    z-index: 1;
                }

                #bar-status {
                    position: absolute;
                    width: 1px;
                    left: 0;
                    top: 0;
                    height: 100%;
                    background-color: #ff5035;
                    transition: width 1.5s;
                    z-index: 2;
                }
                
                #legend {
                    color: white;
                    margin: auto;
                    z-index: 3;
                }
            </style>
            <div id="progress-bar">
                <div id="legend">${this._current} / ${this._max}</div>
                <div id="bar-status"></div>   
            </div>
        `;

        window.requestAnimationFrame(() => this.refresh());
    }

    refresh() {
        if (this.connected === true) {
            this.querySelector('#bar-status').style.width = this.getRatio() + '%';
            this.querySelector('#legend').textContent = this._current + '/' + this._max;

            if (this.getRatio() >= 100) {
                console.log('🔥 Limit reached 🔥');
                this.dispatchEvent(new CustomEvent('limit-reach', {
                    detail: {
                        text: 'Limit reach',
                        current: this.current,
                        max: this.max
                    }
                }));
            } else {
                console.log('🎈 Under limit 🎈');
                this.dispatchEvent(new CustomEvent('under-limit', {
                    detail: {
                        text: 'Under limit',
                        current: this.current,
                        max: this.max
                    }
                }));
            }
        }
    }

    increaseLimit() {
        this.max = parseInt(this.max) + 1;
    }

    decreaseLimit() {
        if (this.max > 0) {
            this.max = parseInt(this.max) - 1;
        }
    }
}

if (!window.customElements.get('progress-bar')) {
    window.customElements.define('progress-bar', ProgressBar);
}

function convertToNumber(val) {
    if (Number.isNaN(parseInt(val))) {
        return val;
    } else {
        return parseInt(val);
    }
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, (match, group) => group.toUpperCase());
}