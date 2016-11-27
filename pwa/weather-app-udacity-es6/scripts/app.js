const WEATHER_API = 'https://publicdata-weather.firebaseio.com/';
const STORAGE_KEY = 'cities';

const INJECTED_DATA = {
    key: 'newyork',
    label: 'New York, NY',
    currently: {
        time: 1453489481,
        summary: 'Clear',
        icon: 'partly-cloudy-day',
        temperature: 52.74,
        apparentTemperature: 74.34,
        precipProbability: 0.20,
        humidity: 0.77,
        windBearing: 125,
        windSpeed: 1.52
    },
    daily: {
        data: [{
            icon: 'clear-day',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'rain',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'snow',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'sleet',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'fog',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'wind',
            temperatureMax: 55,
            temperatureMin: 34
        }, {
            icon: 'partly-cloudy-day',
            temperatureMax: 55,
            temperatureMin: 34
        }]
    }
};


class WeatherApp {

    /**
     * Creates an instance of WeatherApp.
     * 
     * 
     * @memberOf WeatherApp
     */
    constructor() {
        this.isLoading = true;
        this.visibleCards = {};
        this.selectedCities = [];
        this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        this.spinner = document.querySelector('.loader');
        this.cardTemplate = document.querySelector('.template');
        this.container = document.querySelector('.main');
        this.dialog = document.querySelector('.dialog-container');

        if (typeof localforage !== 'undefined' && localforage.getItem(STORAGE_KEY)) {
            localforage.getItem(STORAGE_KEY)
                .then((cities) => {
                    this.selectedCities = cities;
                    cities.map(city => this.getForecast(city.key, city.label))
                    console.table(this.selectedCities);
                })
                .catch(() => {
                    this.selectedCities = [];
                    this.updateForecastCard(INJECTED_DATA);
                });
        }

        this.addListeners();
    }

    /**
     * Registering event listeners for buttons
     * 
     * 
     * @memberOf WeatherApp
     */
    addListeners() {
        document.getElementById('add').addEventListener('click', () => this.toggleAddDialog(true));
        document.getElementById('cancel').addEventListener('click', () => this.toggleAddDialog(false));
        document.getElementById('refresh').addEventListener('click', () => this.updateForecasts());

        document.getElementById('add-city').addEventListener('click', () => {
            const select = document.getElementById('select-city');
            const selected = select.options[select.selectedIndex];
            const key = selected.value;
            const label = selected.textContent;

            this.getForecast(key, label);
            this.addCity(key, label);
            this.toggleAddDialog(false);
        });
    }

    /**
     * Adding cities to `selectedCities` array and updating IndexedDB entry
     * 
     * @param {any} key
     * @param {any} label
     * 
     * @memberOf WeatherApp
     */
    addCity(key, label) {
        this.selectedCities.push({
            key,
            label
        });

        if (typeof localforage !== 'undefined') {
            localforage.setItem('cities', this.selectedCities).then(() => console.log(`addCity ${this.selectedCities}`));
        }
    }


    /**
     * Unregistering event listeners for buttons
     * 
     * 
     * @memberOf WeatherApp
     */
    removeListeners() {
        document.getElementById('refresh').removeEventListener('click', this.updateForecasts());
        document.getElementById('add').removeEventListener('click', this.toggleAddDialog(true));
    }

    /**
     * Toggles the visibility of the add new city dialog.
     * 
     * @param {bool} visible
     * 
     * @memberOf WeatherApp
     */
    toggleAddDialog(visible) {
        if (visible) {
            this.dialog.classList.add('dialog-container--visible');
        } else {
            this.dialog.classList.remove('dialog-container--visible');
        }

    }


    /**
     * Updates a weather card with the latest weather forecast. If the card
     * doesn't already exist, it's cloned from the template.
     * 
     * @param {object} data
     * 
     * @memberOf WeatherApp
     */

    updateForecastCard(data) {
        let card = this.visibleCards[data.key];

        if (!card) {
            card = this.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = data.label;
            card.removeAttribute('hidden');
            this.container.appendChild(card);
            this.visibleCards[data.key] = card;
        }

        const dateEl = card.querySelector('.date');

        if (dateEl.getAttribute('data-dt') >= data.currently.time) {
            return;
        }

        dateEl.setAttribute('data-dt', data.currently.time);
        dateEl.textContent = new Date(data.currently.time * 1000);

        card.querySelector('.description').textContent = data.currently.summary;
        card.querySelector('.current .icon').classList.add(data.currently.icon);
        card.querySelector('.current .temperature .value').textContent = Math.round(data.currently.temperature);
        card.querySelector('.current .feels-like .value').textContent = Math.round(data.currently.apparentTemperature);
        card.querySelector('.current .precip').textContent = Math.round(data.currently.precipProbability * 100) + '%';
        card.querySelector('.current .humidity').textContent = Math.round(data.currently.humidity * 100) + '%';
        card.querySelector('.current .wind .value').textContent = Math.round(data.currently.windSpeed);
        card.querySelector('.current .wind .direction').textContent = data.currently.windBearing;

        const nextDays = card.querySelectorAll('.future .oneday');

        let today = new Date();
        today = today.getDay();

        for (let i = 0; i < 7; i++) {
            let nextDay = nextDays[i];
            let daily = data.daily.data[i];
            if (daily && nextDay) {
                nextDay.querySelector('.date').textContent = this.daysOfWeek[(i + today) % 7];
                nextDay.querySelector('.icon').classList.add(daily.icon);
                nextDay.querySelector('.temp-high .value').textContent = Math.round(daily.temperatureMax);
                nextDay.querySelector('.temp-low .value').textContent = Math.round(daily.temperatureMin);
            }
        }

        if (this.isLoading) {
            this.spinner.setAttribute('hidden', true);
            this.container.removeAttribute('hidden');
            this.isLoading = false;
        }
    }


    /**
     * Gets a forecast for a specific city and update the card with the data
     * 
     * @param {any} key
     * @param {any} label
     * 
     * @memberOf WeatherApp
     */
    getForecast(key, label) {
        const url = WEATHER_API + key + '.json';

        if ('caches' in window) {
            caches.match(url).then(response => {
                if (response) {
                    response.json().then(json => {
                        json.key = key;
                        json.label = label;
                        this.updateForecastCard(json);
                    })
                }
            });
        }

        fetch(url)
            .then(response => {
                return response.json().then(data => {
                    console.log(data);
                    data.key = key;
                    data.label = label;
                    this.updateForecastCard(data);
                });

            });
    }

    /**
     * Iterate all of the cards and attempt to get the latest forecast data
     * 
     * 
     * @memberOf WeatherApp
     */
    updateForecasts() {
        const keys = Object.keys(this.visibleCards);
        keys.forEach(key => this.getForecast(key));
    }
}