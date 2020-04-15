console.log('Service worker registration');

const excludeFromCache = [
  'https://www.google.com/images/phd/px.gif'
];

const cacheVersion = 'v3';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheVersion)
      .then(function(cache) {
        return cache.addAll([
          '/',
          // '/index.html',
          '/js/app.js',
          '/js/view/home.js',
          '/js/view/read.js',
          '/style/card.css',
          '/style/view.css',
        ]);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  const link = `${url.origin}${url.pathname}`;

  if (event.request.method === 'GET' && !excludeFromCache.includes(link)) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request)
            .then(function(response) {
              const responseClone = response.clone();
              caches.open(cacheVersion)
                .then(function(cache) {
                  cache.put(event.request, responseClone);
                });

                return response;
            })
        })
        .catch(function() {
          return cache.match('index.html');
        })
    )
  }
});

self.addEventListener('message', function (event) {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

