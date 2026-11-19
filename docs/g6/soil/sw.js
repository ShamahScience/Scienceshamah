const C = 'soil-1795120490', FILES = ["./", "img/flag.jpg", "img/flags.jpg", "img/fonts/Qahwa-Arabic-Black.otf", "img/fonts/ZainRounded-VF.ttf", "img/forest_bg.jpg", "img/greet.jpg", "img/guard.png", "img/guard_face.png", "img/morning.jpg", "img/nafs/logo.png", "img/p165.jpg", "img/p166.jpg", "img/p167.jpg", "img/p168.jpg", "img/p169.jpg", "img/p170.jpg", "img/p171.jpg", "img/p172.jpg", "img/p173.jpg", "img/r_erosion.jpg", "img/r_gate.jpg", "img/r_jar.jpg", "img/r_oasis.jpg", "img/r_profile.jpg", "img/r_terrace.jpg", "img/rules.jpg", "img/watan.jpg", "index.html", "manifest.webmanifest", "vid/flag.mp4", "vid/watan.mp4", "../../assets/draw.js"];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('soil-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
async function ranged(req, res) {
  const r = req.headers.get('range'); if (!r) return res;
  const buf = await res.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(r), n = buf.byteLength;
  const a = m && m[1] ? +m[1] : 0, b = m && m[2] ? +m[2] : n - 1;
  return new Response(buf.slice(a, b + 1), { status: 206, headers: { 'Content-Type': res.headers.get('Content-Type') || 'video/mp4', 'Content-Range': `bytes ${a}-${b}/${n}`, 'Content-Length': String(b - a + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  e.respondWith((async () => {
    const c = await caches.open(C);
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) return ranged(e.request, hit);
    try {
      const res = await fetch(e.request);
      if (res.ok && !e.request.headers.get('range') && (u.origin === location.origin || u.host.includes('fonts.g'))) c.put(e.request, res.clone());
      return res;
    } catch (err) { return (await c.match('./')) || Response.error(); }
  })());
});
