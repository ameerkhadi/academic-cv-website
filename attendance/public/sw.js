/* عامل خدمة صغير: يبقي واجهة التسجيل قابلة للفتح عند ضعف الشبكة. */
const CACHE = 'att-shell-v1';
const SHELL = ['/', '/a', '/css/app.css', '/js/common.js', '/js/attend.js', '/js/student.js', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  // لا نخزّن أي استجابة من الواجهة البرمجية ولا صفحات التدريسي.
  if (url.pathname.startsWith('/api/') || url.pathname === '/admin' || url.pathname === '/display') return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match('/a')))
  );
});
