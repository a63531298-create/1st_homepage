const CACHE_NAME = 'ysol-cache-v1.8.24';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. 서비스 워커 설치 및 최신화 (skipWaiting)
self.addEventListener('install', event => {
  self.skipWaiting(); // 즉시 새로운 서비스 워커로 교체되도록 강제
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. 기존 찌꺼기 캐시 삭제 (정리)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('기존 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 교체 즉시 제어권 확보
  );
});

// 3. 네트워크 우선 (Network-First) 전략
self.addEventListener('fetch', event => {
  // 구글 맵 API 등 외부 리소스는 캐싱하지 않고 바로 통과
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .
