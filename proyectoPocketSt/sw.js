const CACHE_NAME = 'pocketstore-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './images/icons/icono1.png',
  './images/icons/icono2.png',
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Guardando app shell en cache');
                return cache.addAll(urlsToCache);
            }).then(() => self.skipWaiting())
        );
    });

    self.addEventListener('activate', (event) => {
        console.log('Service Worker: Activando...');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log('Service Worker: Borrando cache antigua');
                            return caches.delete(cache);
                        }
                    })
                );
            }).then(() => self.clients.claim())
        );
    });

    self.addEventListener('fetch', (event) => {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then((networkResponse) => {
                        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                        return networkResponse;
                    });
                })
                .catch((err) => {
                    console.log('Error recuperando recurso offline:', err);
                })
            );
        });