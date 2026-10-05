# -*- coding: utf-8 -*-
"""طبقةُ قاعدة البيانات: SQLite بملفٍّ واحد، وكلُّ استعلامٍ بمعاملاتٍ مربوطة."""
import os, sqlite3, secrets, hashlib, datetime as dt
from contextlib import contextmanager
from . import config

SCHEMA = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS departments (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id       INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  fullname TEXT NOT NULL,
  pw_hash  TEXT NOT NULL,
  role     TEXT NOT NULL CHECK (role IN ('agent','manager')),
  dept_id  INTEGER REFERENCES departments(id),
  active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tickets (
  id            INTEGER PRIMARY KEY,
  ref           TEXT NOT NULL UNIQUE,
  token         TEXT NOT NULL,
  citizen_name  TEXT NOT NULL,
  citizen_phone TEXT,
  subject       TEXT NOT NULL,
  body          TEXT NOT NULL,
  category      TEXT NOT NULL,
  priority      TEXT NOT NULL,
  dept_id       INTEGER NOT NULL REFERENCES departments(id),
  status        TEXT NOT NULL,
  auto_routed   INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  due_at        TEXT NOT NULL,
  closed_at     TEXT,
  esc_level     INTEGER NOT NULL DEFAULT 0,
  esc_at        TEXT,
  rating        INTEGER,
  rating_note   TEXT
);
CREATE INDEX IF NOT EXISTS ix_tickets_status  ON tickets(status);
CREATE INDEX IF NOT EXISTS ix_tickets_dept    ON tickets(dept_id);
CREATE INDEX IF NOT EXISTS ix_tickets_due     ON tickets(due_at);

CREATE TABLE IF NOT EXISTS events (
  id        INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  at        TEXT NOT NULL,
  actor     TEXT NOT NULL,
  kind      TEXT NOT NULL,
  note      TEXT,
  public    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS ix_events_ticket ON events(ticket_id);

CREATE TABLE IF NOT EXISTS sessions (
  sid        TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS counters (
  year INTEGER PRIMARY KEY,
  n    INTEGER NOT NULL
);
"""


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0)


def iso(t):
    return t.isoformat()


def parse(s):
    return dt.datetime.fromisoformat(s)


def connect():
    os.makedirs(os.path.dirname(config.DB_PATH), exist_ok=True)
    c = sqlite3.connect(config.DB_PATH, timeout=15, isolation_level=None)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA foreign_keys=ON")
    return c


@contextmanager
def conn():
    c = connect()
    try:
        yield c
    finally:
        c.close()


@contextmanager
def tx():
    c = connect()
    try:
        c.execute("BEGIN IMMEDIATE")
        yield c
        c.execute("COMMIT")
    except Exception:
        c.execute("ROLLBACK")
        raise
    finally:
        c.close()


def init():
    with conn() as c:
        c.executescript(SCHEMA)
        for name in config.DEPARTMENTS:
            c.execute("INSERT OR IGNORE INTO departments(name) VALUES (?)", (name,))


# ── كلماتُ المرور: PBKDF2 من المكتبة القياسيّة، بلا اعتمادٍ خارجيّ ──
def hash_pw(pw: str, salt: str = None) -> str:
    salt = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt.encode(), 200_000)
    return "pbkdf2$200000$%s$%s" % (salt, dk.hex())


def check_pw(pw: str, stored: str) -> bool:
    try:
        _, rounds, salt, want = stored.split("$")
        dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt.encode(), int(rounds))
        return secrets.compare_digest(dk.hex(), want)
    except Exception:
        return False


def dept_id(c, name: str) -> int:
    r = c.execute("SELECT id FROM departments WHERE name=?", (name,)).fetchone()
    if not r:
        raise ValueError("شعبةٌ غير معروفة: %s" % name)
    return r["id"]


def next_ref(c) -> str:
    y = now().year
    c.execute("INSERT INTO counters(year, n) VALUES (?, 0) ON CONFLICT(year) DO NOTHING", (y,))
    c.execute("UPDATE counters SET n = n + 1 WHERE year = ?", (y,))
    n = c.execute("SELECT n FROM counters WHERE year=?", (y,)).fetchone()["n"]
    return "TK-%d-%05d" % (y, n)


def new_token() -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"      # بلا حروفٍ تلتبس بالأرقام
    return "".join(secrets.choice(alphabet) for _ in range(6))


def log(c, ticket_id: int, actor: str, kind: str, note: str = None, public: int = 0):
    c.execute("INSERT INTO events(ticket_id, at, actor, kind, note, public) VALUES (?,?,?,?,?,?)",
              (ticket_id, iso(now()), actor, kind, note, public))
