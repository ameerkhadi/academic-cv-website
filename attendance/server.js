import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDb, makeStore, ensureCredentials } from './lib/db.js';
import { fail, createRateLimiter, clientIp } from './lib/util.js';
import { handleStudentApi } from './routes/student.js';
import { handleAdminApi, isAdmin } from './routes/admin.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, 'public');

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1';
const DATA_DIR = process.env.DATA_DIR || path.join(here, 'data');
const TRUST_PROXY = process.env.TRUST_PROXY !== '0';
const SECURE_COOKIES = process.env.SECURE_COOKIES !== '0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');

function securityHeaders(res) {
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=(self)');
}

function serveFile(res, filePath, { cache = false } = {}) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('غير موجود');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': cache ? 'public, max-age=3600' : 'no-store',
      'Content-Length': data.length
    });
    res.end(data);
  });
}

const PAGES = {
  '/': 'student.html',
  '/a': 'attend.html',
  '/attend': 'attend.html',
  '/me': 'student.html',
  '/admin': 'admin.html',
  '/display': 'display.html'
};

async function main() {
  const db = await initDb(DATA_DIR);
  const store = makeStore(db);
  const { secret, createdPassword } = ensureCredentials(store, DATA_DIR, process.env.ADMIN_PASSWORD);

  const app = {
    db,
    store,
    secret,
    trustProxy: TRUST_PROXY,
    secureCookies: SECURE_COOKIES,
    // قاعة كاملة قد تشترك في عنوان IP واحد، فالحدّ واسع على التسجيل العادي
    // وضيّق على المحاولات الفاشلة في الربط (حماية من التخمين).
    limitAttend: createRateLimiter({ windowMs: 60_000, max: 400 }),
    limitEnroll: createRateLimiter({ windowMs: 60_000, max: 25 }),
    limitLogin: createRateLimiter({ windowMs: 60_000, max: 8 })
  };

  const server = http.createServer(async (req, res) => {
    securityHeaders(res);
    let url;
    try {
      url = new URL(req.url, 'http://localhost');
    } catch {
      return fail(res, 400, 'bad-url', 'طلب غير صالح.');
    }

    try {
      if (url.pathname.startsWith('/api/admin/')) {
        if ((await handleAdminApi(app, req, res, url)) !== false) return;
        return fail(res, 404, 'not-found', 'مسار غير معروف.');
      }
      if (url.pathname.startsWith('/api/')) {
        if ((await handleStudentApi(app, req, res, url)) !== false) return;
        return fail(res, 404, 'not-found', 'مسار غير معروف.');
      }
    } catch (err) {
      const message = err.message === 'bad-json' ? 'صيغة الطلب غير صالحة.'
        : err.message === 'body-too-large' ? 'حجم الطلب كبير جداً.'
        : 'خطأ داخلي في الخادم.';
      const status = err.message === 'bad-json' || err.message === 'body-too-large' ? 400 : 500;
      if (status === 500) console.error('[error]', clientIp(req, TRUST_PROXY), url.pathname, err);
      return fail(res, status, 'server-error', message);
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return fail(res, 405, 'method', 'أسلوب غير مسموح.');
    }

    // شاشة العرض تحمل الرمز الحيّ، فلا تُفتح إلا بدخول التدريسي.
    if (url.pathname === '/display' && !isAdmin(app, req)) {
      res.writeHead(302, { Location: '/admin?next=display' });
      return res.end();
    }

    const page = PAGES[url.pathname];
    if (page) return serveFile(res, path.join(PUBLIC_DIR, page));

    const rel = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, rel);
    if (!filePath.startsWith(PUBLIC_DIR)) return fail(res, 403, 'forbidden', 'ممنوع.');
    const cache = /\.(js|css|png|svg|ico)$/.test(filePath) && !filePath.endsWith('sw.js');
    return serveFile(res, filePath, { cache });
  });

  server.listen(PORT, HOST, () => {
    console.log(`نظام الحضور يعمل على http://${HOST}:${PORT}`);
    console.log(`قاعدة البيانات: ${path.join(DATA_DIR, 'attendance.db')}`);
    if (createdPassword) {
      console.log(`كلمة مرور لوحة التدريسي (أُنشئت تلقائياً): ${createdPassword}`);
      console.log(`محفوظة أيضاً في ${path.join(DATA_DIR, 'admin-password.txt')}`);
    }
    if (!store.get('hall_lat')) {
      console.log('تنبيه: لم تُضبط إحداثيات القاعة بعد. افتح /admin ثم تبويب الإعدادات.');
    }
  });

  const shutdown = () => {
    server.close(() => {
      try { db.close(); } catch {}
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('فشل الإقلاع:', err);
  process.exit(1);
});
