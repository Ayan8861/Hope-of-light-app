/* Hope of Light service worker: offline fallback + faster repeat visits. API calls are never cached. */
const CACHE = 'hol-v1';
const CORE = ['/', '/index.html', '/about.html', '/projects.html', '/contact.html', '/login.html', '/register.html',
  '/offline.html', '/css/style.css', '/js/app.js', '/js/pages.js', '/icons/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;          // ignore other sites (fonts) and POSTs
  if (url.pathname.startsWith('/api/') || url.pathname === '/healthz') return;  // live data: always network

  if (req.destination === 'image') {                                            // images: cache first
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
    return;
  }
  e.respondWith(                                                                // pages, css, js: network first, cache as backup
    fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('/offline.html') : Response.error())))
  );
});
