const C = 'nafsrev-1795208033', FILES = ["./", "index.html", "manifest.webmanifest", "img/brain.png", "img/girl.jpg", "img/nafs.png", "img/skull.png", "img/snails.png", "img/stomach.png"];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('nafsrev-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  e.respondWith(caches.open(C).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true }); if (hit) return hit;
    try { const r = await fetch(e.request); if (r.ok && (u.origin === location.origin || u.host.includes('fonts.g'))) c.put(e.request, r.clone()); return r; }
    catch (err) { return (await c.match('./')) || Response.error(); }
  }));
});
