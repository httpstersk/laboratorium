import haversineDistance from 'haversine-distance';
import { fire } from '../../utils/utils';

export class GeoLocation extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['coords'];
    }

    get coords() {
        const coords = this.getAttribute('coords');

        if (coords) {
            return JSON.parse(coords);
        }
    }

    connectedCallback() {
        this._watchPosition = this._watchPosition.bind(this);
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

        this._watchPosition();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (newVal !== oldVal && oldVal !== null) {
            console.log(`${attrName}: ${oldVal} ———→ ${newVal}`);

            switch (attrName) {
                case 'coords':
                    break;

                default:
                    break;
            }
        }
    }

    _onPositionSuccess(position) {
        if (!position) return;

        const { latitude, longitude } = position.coords;
        const current = { latitude, longitude };

        this.coords.map((coord, index) => {
            const distance = Math.floor(haversineDistance(current, coord));
            console.log(`🌍 #${index}: ${distance}m`);

            if (distance < 100) {
                fire('is-near-stage', { stageId: index }, this);
            }
        });

        fire('position-changed', { latitude, longitude }, this);
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