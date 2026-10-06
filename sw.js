/* Turon Club — илова қобиғини телефонда сақлайди.
   Саҳифа: аввал тармоқ (2.5 сония), улгурмаса — сақланган нусха. Шунинг учун
   илова доим тез очилади ва янгиланиш ҳам ўзи келади.
   Сервер сўровлари (script.google.com) бу ердан ўтмайди. */
var KESH = 'turon-qobiq-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(KESH).then(function (c) {
    return c.addAll(['/', '/manifest.webmanifest', '/icon-180.png']).catch(function () {});
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== KESH; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function sahifa(req) {
  return caches.open(KESH).then(function (c) {
    var tarmoq = fetch(req, { cache: 'no-store' }).then(function (r) {
      if (r && r.ok) c.put('/', r.clone());
      return r;
    });
    return c.match('/').then(function (bor) {
      if (!bor) return tarmoq;
      var kutish = new Promise(function (ok) { setTimeout(function () { ok(bor); }, 2500); });
      return Promise.race([tarmoq.catch(function () { return bor; }), kutish]);
    });
  });
}

function keshAvval(req) {
  return caches.open(KESH).then(function (c) {
    return c.match(req).then(function (bor) {
      if (bor) return bor;
      return fetch(req).then(function (r) {
        if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
        return r;
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin === self.location.origin) {
    if (u.pathname === '/sw.js') return;
    if (r.mode === 'navigate' || u.pathname === '/' || /\.html$/.test(u.pathname)) e.respondWith(sahifa(r));
    else e.respondWith(keshAvval(r));
  } else if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(keshAvval(r));
  }
});
