# -*- coding: utf-8 -*-
"""الجلساتُ والصلاحيّات: ارتباطُ جلسةٍ في قاعدة البيانات، ورمزٌ يمنع تزويرَ الطلبات."""
import hmac, hashlib, secrets, os
from fastapi import Request
from . import db, config

COOKIE = "tk_sid"
_secret_cache = {}


def secret() -> bytes:
    """مفتاحُ التوقيع: من البيئة إن وُجد، وإلّا يُولَّد مرّةً ويُحفَظ بجوار قاعدة البيانات."""
    if "k" in _secret_cache:
        return _secret_cache["k"]
    if config.SECRET_KEY:
        _secret_cache["k"] = config.SECRET_KEY.encode()
        return _secret_cache["k"]
    path = os.path.join(os.path.dirname(config.DB_PATH), "secret.key")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(os.open(path, os.O_CREAT | os.O_WRONLY, 0o600), "w") as f:
            f.write(secrets.token_hex(32))
    _secret_cache["k"] = open(path).read().strip().encode()
    return _secret_cache["k"]


def login(user_id: int) -> str:
    sid = secrets.token_urlsafe(32)
    with db.tx() as c:
        c.execute("INSERT INTO sessions(sid, user_id, created_at) VALUES (?,?,?)",
                  (sid, user_id, db.iso(db.now())))
    return sid


def logout(sid: str):
    if sid:
        with db.tx() as c:
            c.execute("DELETE FROM sessions WHERE sid=?", (sid,))


def current_user(request: Request):
    sid = request.cookies.get(COOKIE)
    if not sid:
        return None
    with db.conn() as c:
        return c.execute(
            "SELECT u.*, d.name AS dept FROM sessions s JOIN users u ON u.id = s.user_id "
            "LEFT JOIN departments d ON d.id = u.dept_id WHERE s.sid = ? AND u.active = 1",
            (sid,)).fetchone()


def authenticate(username: str, password: str):
    with db.conn() as c:
        u = c.execute("SELECT * FROM users WHERE username=? AND active=1", (username.strip(),)).fetchone()
    return u if u and db.check_pw(password, u["pw_hash"]) else None


# ── رمزُ منع التزوير: مشتقٌّ من معرّف الجلسة، فلا يحتاج تخزينًا ──
def csrf_token(request: Request) -> str:
    sid = request.cookies.get(COOKIE, "") or ""
    return hmac.new(secret(), ("csrf:" + sid).encode(), hashlib.sha256).hexdigest()[:40]


def csrf_ok(request: Request, sent: str) -> bool:
    """المقارنةُ على البايتات لا على النصّ: قيمةٌ غيرُ لاتينيّةٍ تُرفَض ولا تُسقِط الخادم."""
    if not sent:
        return False
    try:
        got = sent.encode("utf-8")
    except Exception:
        return False
    return hmac.compare_digest(got, csrf_token(request).encode("utf-8"))
