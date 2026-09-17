import fs from 'node:fs';
import path from 'node:path';
import { hashPassword, randomId, now } from './util.js';

/**
 * طبقة قاعدة البيانات: تستخدم node:sqlite المدمج (Node 22.5+)
 * ومع النسخ الأقدم تعود تلقائياً إلى حزمة better-sqlite3 إن كانت منصّبة.
 */
async function openDatabase(file) {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    return new DatabaseSync(file);
  } catch (err) {
    try {
      const mod = await import('better-sqlite3');
      return new mod.default(file);
    } catch {
      throw new Error(
        'تعذّر فتح قاعدة البيانات: يلزم Node 22.5 أو أحدث (node:sqlite)، ' +
        'أو تنصيب حزمة better-sqlite3. التفصيل: ' + err.message
      );
    }
  }
}

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id         INTEGER PRIMARY KEY,
  student_no TEXT,
  name       TEXT NOT NULL,
  code       TEXT,
  active     INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_no
  ON students(student_no) WHERE student_no IS NOT NULL AND student_no <> '';

CREATE TABLE IF NOT EXISTS devices (
  id         TEXT PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fp         TEXT,
  ua         TEXT,
  ip         TEXT,
  created_at INTEGER NOT NULL,
  last_seen  INTEGER,
  revoked    INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_devices_one_per_student
  ON devices(student_id) WHERE revoked = 0;
CREATE INDEX IF NOT EXISTS idx_devices_fp ON devices(fp);

CREATE TABLE IF NOT EXISTS subjects (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  code        TEXT,
  day_of_week INTEGER,
  start_min   INTEGER,
  end_min     INTEGER,
  sort        INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sessions (
  id         INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  date       TEXT NOT NULL,
  opened_at  INTEGER NOT NULL,
  closed_at  INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_unique ON sessions(subject_id, date);

CREATE TABLE IF NOT EXISTS checks (
  id         INTEGER PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  seq        INTEGER NOT NULL,
  opened_at  INTEGER NOT NULL,
  closes_at  INTEGER NOT NULL,
  closed_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_checks_session ON checks(session_id);

CREATE TABLE IF NOT EXISTS marks (
  id          INTEGER PRIMARY KEY,
  check_id    INTEGER NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  session_id  INTEGER NOT NULL,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  device_id   TEXT,
  ts          INTEGER NOT NULL,
  captured_at INTEGER,
  ip          TEXT,
  fp          TEXT,
  lat         REAL,
  lng         REAL,
  acc         REAL,
  dist        REAL,
  late        INTEGER NOT NULL DEFAULT 0,
  flags       TEXT NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_marks_unique ON marks(check_id, student_id);
CREATE INDEX IF NOT EXISTS idx_marks_session ON marks(session_id);

CREATE TABLE IF NOT EXISTS overrides (
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  note       TEXT,
  ts         INTEGER NOT NULL,
  PRIMARY KEY (session_id, student_id)
);

CREATE TABLE IF NOT EXISTS rebind_requests (
  id         INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fp         TEXT,
  ua         TEXT,
  ip         TEXT,
  reason     TEXT,
  created_at INTEGER NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS audit (
  id     INTEGER PRIMARY KEY,
  ts     INTEGER NOT NULL,
  actor  TEXT,
  action TEXT NOT NULL,
  detail TEXT
);
`;

export const DEFAULT_SETTINGS = {
  term_name: 'الفصل الدراسي الحالي',
  hall_name: 'القاعة الكبرى',
  hall_lat: '',
  hall_lng: '',
  radius_m: '120',
  max_accuracy_m: '150',
  require_geo: '1',
  check_seconds: '120',
  slot_seconds: '30',
  late_minutes: '60',
  enrollment_open: '0',
  timezone: 'Asia/Baghdad',
  present_rule: 'all'   // all = يجب حضور كل التدقيقات | any = يكفي تدقيق واحد
};

export async function initDb(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = await openDatabase(path.join(dataDir, 'attendance.db'));
  db.exec(SCHEMA);

  const put = db.prepare('INSERT OR IGNORE INTO settings(key, value) VALUES(?, ?)');
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) put.run(k, v);

  return db;
}

export function makeStore(db) {
  const q = {
    getSetting: db.prepare('SELECT value FROM settings WHERE key = ?'),
    setSetting: db.prepare(
      'INSERT INTO settings(key, value) VALUES(?, ?) ' +
      'ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    ),
    allSettings: db.prepare('SELECT key, value FROM settings'),
    audit: db.prepare('INSERT INTO audit(ts, actor, action, detail) VALUES(?, ?, ?, ?)')
  };

  const store = {
    db,
    get(key) {
      const row = q.getSetting.get(key);
      return row ? row.value : DEFAULT_SETTINGS[key] ?? null;
    },
    getNum(key) {
      const v = Number(store.get(key));
      return isFinite(v) ? v : 0;
    },
    getBool: (key) => store.get(key) === '1',
    set(key, value) {
      q.setSetting.run(key, value === null || value === undefined ? '' : String(value));
    },
    settings() {
      const out = { ...DEFAULT_SETTINGS };
      for (const row of q.allSettings.all()) out[row.key] = row.value;
      delete out.admin_hash;
      return out;
    },
    log(actor, action, detail) {
      q.audit.run(now(), actor || 'system', action, detail ? JSON.stringify(detail) : null);
    }
  };

  return store;
}

/** يضمن وجود سر التوقيع وكلمة مرور المشرف عند أول تشغيل */
export function ensureCredentials(store, dataDir, envPassword) {
  let secret = store.get('signing_secret');
  if (!secret) {
    secret = randomId(32);
    store.set('signing_secret', secret);
  }

  let created = null;
  if (envPassword) {
    store.set('admin_hash', hashPassword(envPassword));
  } else if (!store.get('admin_hash')) {
    created = randomId(6);
    store.set('admin_hash', hashPassword(created));
    fs.writeFileSync(
      path.join(dataDir, 'admin-password.txt'),
      `كلمة مرور لوحة التدريسي (أنشئت تلقائياً): ${created}\n`,
      { mode: 0o600 }
    );
  }
  return { secret, createdPassword: created };
}
