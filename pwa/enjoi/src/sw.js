const CACHE_NAME = 'v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './bundle.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || /http:/.test(event.request.url)) return;

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request).then(response => {
                cache.put(event.request, response.clone());
                return response;
            }).catch(() => cache.match(event.request));
        })
    )
});