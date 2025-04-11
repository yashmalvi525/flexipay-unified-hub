
const CACHE_NAME = 'flexipay-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event handler - caches app shell resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All Resources Cached');
        return self.skipWaiting();  // Force activation
      })
  );
});

// Fetch event handler - serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from cached version
        if (response) {
          return response;
        }
        // Not in cache - fetch and cache the result
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it's a stream that can only be consumed once
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Activate event handler - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Now Ready to Handle Fetches');
      return self.clients.claim();  // Take control of all clients
    })
  );
});

// Add message listener for installation status
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_INSTALL_STATUS') {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'INSTALL_STATUS',
          installed: true
        });
      });
    });
  }
});
