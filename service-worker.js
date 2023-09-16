const VERSION = 'v1.1.70';
const CACHE_NAME = 'chrono-chime-hourly-notification-cache';

const urlsToCache = [
  '/',
  'index.html', // Add any other essential files here (e.g., stylesheets, JavaScript files, images, etc.)
  'chrono-chime-icon-32.png',
  'chrono-chime-icon-192.png',
  'chrono-chime-icon-512.png',
  'chrono-chime-maskable-icon-192.png',
  'chrono-chime-maskable-icon-512.png',
  'script.js',
  '_eaefda17-e770-4fdd-9e81-78fe64f78502.jpeg',
  'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,400;0,700;1,100;1,200;1,400;1,700&display=swap',
  'notification.mp3',
  'notification2.wav',
  'notification3.wav'
  // Add more URLs to cache as needed
];

self.addEventListener('install', event => {
  console.log('Service Worker installed');

  // Cache essential files during installation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');

  // Clean up any old caches or data from previous versions
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }),
    // Trigger the toast notification when activation is complete
    clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'show-toast' });
      });
    })
  );
  // Ensure that the new service worker takes control immediately
  self.clients.claim();
});

// Listen for messages sent by the waiting service worker
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  // Intercept fetch requests and serve cached assets if available
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(error => {
        console.error('Error fetching and caching:', error);
      })
  );
});
