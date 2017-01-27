import { encapsulate, fire } from '../../utils/utils';

export class GeoLocation extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['target'];
    }

    get target() {
        const target = this.getAttribute('target');

        if (target) {
            return JSON.parse(target);
        }
    }

    connectedCallback() {
        this._onPositionSuccess = this._onPositionSuccess.bind(this);
        this._onPositionError = this._onPositionError.bind(this);

        const options = {
            enableHighAccuracy: true
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._onPositionSuccess,
                this._onPositionError,
                options
            );
        }

        console.log('TARGET', this.target);
        this._watchPosition();
    }

    disconnectedCallback() {
        this._stopWatching();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (newVal !== oldVal && oldVal !== null) {
            console.log(`${attrName}: ${oldVal} ———→ ${newVal}`);

            switch (attrName) {
                case 'target':
                    break;

                default:
                    break;
            }
        }
    }

    _onPositionSuccess(position) {
        if (!position) return;

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        console.log(`👀 { ${this.latitude}, ${this.longitude} }`);

        fire(this, 'position-changed', {
            latitude: this.latitude,
            longitude: this.longitude
        });
    }

    _onPositionError(error) {
        console.error(new Error(error));
    }

    _watchPosition() {
        if (!this._id) {
            this._id = navigator.geolocation.watchPosition(
                this._onPositionSuccess,
                this._onPositionError
            );
        }
    }

    _stopWatching() {
        if (!this._id) return;
        console.log('🙈');
        navigator.geolocation.clearWatch(this._id);
    }
}