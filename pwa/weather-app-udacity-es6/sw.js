const CACHE_VERSION = 'PWA-v3';
const DATA_CACHE_VERSION = 'DATA-v3';
const WEATHER_API_BASE_URL = 'https://publicdata-weather.firebaseio.com/';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './images/clear.png',
    './images/cloudy-scattered-showers.png',
    './images/cloudy.png',
    './images/fog.png',
    './images/ic_add_white_24px.svg',
    './images/ic_refresh_white_24px.svg',
    './images/partly-cloudy.png',
    './images/rain.png',
    './images/scattered-showers.png',
    './images/sleet.png',
    './images/snow.png',
    './images/thunderstorm.png',
    './images/wind.png',
    './scripts/app.js',
    './scripts/localforage.min.js',
    './styles/style.css'
];

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_VERSION)
        .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');

    event.waitUntil(
        caches.keys()
        .then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_VERSION && key !== DATA_CACHE_VERSION) {
                        console.log('[ServiceWorker] Removing old cache');
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch');

    if (event.request.url.startsWith(WEATHER_API_BASE_URL)) {
        event.respondWith(
            fetch(event.request)
            .then(response => {
                return caches.open(DATA_CACHE_VERSION).then(cache => {
                    console.log('[ServiceWorker] Fetched & Cached');
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                console.log('[ServiceWorker] Fetch Only');
                return response || fetch(event.request);
            })
        );
    }

});