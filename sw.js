const CACHE_NAME = 'ysol-cache-v1';
const urlsToCache = [
  './app.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 캐시에 있으면 캐시된 걸 보여주고, 없으면 인터넷에서 가져옴
      return response || fetch(event.request);
    })
  );
});