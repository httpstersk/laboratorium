import '../../style.css';

import Rx from 'rx';

function convertToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1);
}

const API_KEY = '68593c53a1fd11cbabfbdc6d93814221';
const API_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

const tempEl = document.querySelector('#weather');
const inputEl = document.querySelector('#location-input');

const inputSource = Rx.Observable
    .fromEvent(inputEl, 'change')
    .debounce(500);

const requestOnFindStream = inputSource
    .map(ev => {
        return `${API_URL}&q=${ev.target.value}`;
    });

const fromP = Rx.Observable.fromPromise;

const responseStream = requestOnFindStream
    .flatMap(requestUrl => fromP(fetch(requestUrl)))
    .filter(response => response.status === 200)
    .flatMap(res => fromP(res.json()))
    .filter(data => data.cod === 200)
    .map(d => convertToCelsius(d.main.temp))
    .startWith(0);

responseStream.subscribe(temp => {
    tempEl.innerHTML = `${temp} °C`;
});
