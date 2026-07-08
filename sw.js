const CACHE_NAME = 'myclass-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(['/'])));
});

self.addEventListener('fetch', (e) => {
  // Abaikan fetch ke Google Script agar data selalu fresh dari server
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse.clone()));
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
