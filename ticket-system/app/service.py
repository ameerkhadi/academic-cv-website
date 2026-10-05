# -*- coding: utf-8 -*-
"""منطقُ العمل: إنشاءُ التذكرة، ومعالجتُها، والتصعيدُ عند تجاوز المدّة، والمؤشّرات."""
import datetime as dt
from . import config, db
from .classify import classify
from .arabic import num as ar_num


# ──────────────────────────── الإنشاء ────────────────────────────
def create_ticket(citizen_name, citizen_phone, subject, body,
                  category=None, priority=None, dept=None, actor="المواطن"):
    """يفتح تذكرةً جديدة. ما لم يُحدَّد التصنيف صراحةً فالنظامُ يستنتجه من النصّ."""
    auto = category is None and priority is None and dept is None
    why = None
    if auto:
        category, priority, dept, why = classify(subject, body)
    category = category or "أخرى"
    priority = priority if priority in config.PRIORITIES else "متوسطة"
    dept = dept or config.ROUTING.get(category, "شعبة المتابعة")

    created = db.now()
    due = created + dt.timedelta(hours=config.SLA_HOURS[priority])

    with db.tx() as c:
        ref, token = db.next_ref(c), db.new_token()
        did = db.dept_id(c, dept)
        cur = c.execute(
            """INSERT INTO tickets(ref, token, citizen_name, citizen_phone, subject, body,
                                   category, priority, dept_id, status, auto_routed,
                                   created_at, due_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (ref, token, citizen_name.strip(), (citizen_phone or "").strip(),
             subject.strip(), body.strip(), category, priority, did,
             config.STATUS_NEW, 1 if auto else 0, db.iso(created), db.iso(due)))
        tid = cur.lastrowid
        db.log(c, tid, actor, "فتح", "استُلمت الشكوى وفُتحت التذكرة.", public=1)
        if why:
            db.log(c, tid, "النظام", "تصنيف",
                   "الفئة «%s»، الإلحاح «%s»، الإحالة «%s». %s" % (category, priority, dept, why))
        else:
            db.log(c, tid, actor, "تصنيف",
                   "صُنِّفت يدويًّا: الفئة «%s»، الإلحاح «%s»، الإحالة «%s»." % (category, priority, dept))
    return ref, token


# ──────────────────────────── القراءة ────────────────────────────
SELECT_T = """SELECT t.*, d.name AS dept FROM tickets t JOIN departments d ON d.id = t.dept_id"""


def get_by_ref(ref, token=None):
    with db.conn() as c:
        q = SELECT_T + " WHERE t.ref = ?"
        p = [ref.strip().upper()]
        if token is not None:
            q += " AND t.token = ?"
            p.append(token.strip().upper())
        return c.execute(q, p).fetchone()


def get(tid):
    with db.conn() as c:
        return c.execute(SELECT_T + " WHERE t.id = ?", (tid,)).fetchone()


def events(tid, public_only=False):
    with db.conn() as c:
        q = "SELECT * FROM events WHERE ticket_id = ?"
        if public_only:
            q += " AND public = 1"
        return c.execute(q + " ORDER BY id", (tid,)).fetchall()


def list_tickets(dept=None, status=None, overdue=None, escalated=None, q=None, limit=200):
    sql, p = SELECT_T, []
    w = []
    if dept:
        w.append("d.name = ?"); p.append(dept)
    if status:
        w.append("t.status = ?"); p.append(status)
    elif status is None:
        pass
    if overdue:
        w.append("t.status != ? AND t.due_at < ?"); p += [config.STATUS_CLOSED, db.iso(db.now())]
    if escalated:
        w.append("t.esc_level > 0")
    if q:
        w.append("(t.ref LIKE ? OR t.subject LIKE ? OR t.citizen_name LIKE ?)")
        p += ["%%%s%%" % q] * 3
    if w:
        sql += " WHERE " + " AND ".join(w)
    sql += " ORDER BY t.esc_level DESC, t.due_at ASC LIMIT ?"
    p.append(limit)
    with db.conn() as c:
        return c.execute(sql, p).fetchall()


# ──────────────────────────── المعالجة ────────────────────────────
def add_reply(tid, actor, note, public=1):
    with db.tx() as c:
        db.log(c, tid, actor, "ردّ", note, public=1 if public else 0)


def set_status(tid, actor, status):
    if status not in config.STATUSES:
        raise ValueError("حالةٌ غير معروفة")
    with db.tx() as c:
        row = c.execute("SELECT status FROM tickets WHERE id=?", (tid,)).fetchone()
        if not row or row["status"] == status:
            return
        closed = db.iso(db.now()) if status == config.STATUS_CLOSED else None
        c.execute("UPDATE tickets SET status=?, closed_at=? WHERE id=?", (status, closed, tid))
        db.log(c, tid, actor, "حالة", "صارت الحالة «%s»." % status, public=1)


def reassign(tid, actor, dept):
    with db.tx() as c:
        did = db.dept_id(c, dept)
        c.execute("UPDATE tickets SET dept_id=?, auto_routed=0 WHERE id=?", (did, tid))
        db.log(c, tid, actor, "إحالة", "أُحيلت إلى «%s»." % dept)


def set_priority(tid, actor, priority):
    if priority not in config.PRIORITIES:
        raise ValueError("درجةُ إلحاحٍ غير معروفة")
    with db.tx() as c:
        row = c.execute("SELECT created_at FROM tickets WHERE id=?", (tid,)).fetchone()
        due = db.parse(row["created_at"]) + dt.timedelta(hours=config.SLA_HOURS[priority])
        c.execute("UPDATE tickets SET priority=?, due_at=? WHERE id=?", (priority, db.iso(due), tid))
        db.log(c, tid, actor, "إلحاح", "صارت درجةُ الإلحاح «%s»، وأُعيد حسابُ مدّة الاستجابة." % priority)


def rate(ref, token, stars, note=None):
    t = get_by_ref(ref, token)
    if not t or t["status"] != config.STATUS_CLOSED:
        return False
    stars = max(1, min(5, int(stars)))
    with db.tx() as c:
        c.execute("UPDATE tickets SET rating=?, rating_note=? WHERE id=?", (stars, note, t["id"]))
        db.log(c, t["id"], "المواطن", "تقييم", "قيّم الخدمةَ بـ %s من ٥." % ar_num(stars), public=1)
    return True


# ──────────────────────────── التصعيد ────────────────────────────
def run_escalation(at=None):
    """يرفع كلَّ تذكرةٍ مفتوحةٍ تجاوزت مدّتها إلى المستوى المستحقّ.

    المستوى الأوّل عند بلوغ المدّة، والثاني عند تجاوزها بنصفها. والعمليّةُ
    لا تُكرِّر نفسَها: لا تُرفَع تذكرةٌ إلى مستوًى بلغته من قبل.
    """
    at = at or db.now()
    raised = []
    with db.tx() as c:
        rows = c.execute(
            "SELECT id, ref, created_at, due_at, esc_level, priority FROM tickets "
            "WHERE status != ?", (config.STATUS_CLOSED,)).fetchall()
        for r in rows:
            created, due = db.parse(r["created_at"]), db.parse(r["due_at"])
            span = (due - created).total_seconds()
            if span <= 0:
                continue
            elapsed = (at - created).total_seconds()
            want, who = r["esc_level"], None
            for mult, level, title in config.ESCALATION:
                if elapsed >= span * mult and level > want:
                    want, who = level, title
            if want > r["esc_level"]:
                c.execute("UPDATE tickets SET esc_level=?, esc_at=? WHERE id=?",
                          (want, db.iso(at), r["id"]))
                db.log(c, r["id"], "النظام", "تصعيد",
                       "تجاوزت التذكرةُ مدّةَ الاستجابة، فصُعِّدت إلى «%s» (المستوى %s)." % (who, ar_num(want)))
                raised.append((r["ref"], want, who))
    return raised


# ──────────────────────────── المؤشّرات ────────────────────────────
def metrics(at=None):
    at = at or db.now()
    now_iso = db.iso(at)
    with db.conn() as c:
        one = lambda q, p=(): c.execute(q, p).fetchone()[0]
        total   = one("SELECT COUNT(*) FROM tickets")
        open_   = one("SELECT COUNT(*) FROM tickets WHERE status != ?", (config.STATUS_CLOSED,))
        closed  = one("SELECT COUNT(*) FROM tickets WHERE status = ?", (config.STATUS_CLOSED,))
        overdue = one("SELECT COUNT(*) FROM tickets WHERE status != ? AND due_at < ?",
                      (config.STATUS_CLOSED, now_iso))
        esc     = one("SELECT COUNT(*) FROM tickets WHERE esc_level > 0 AND status != ?",
                      (config.STATUS_CLOSED,))
        rating  = c.execute("SELECT AVG(rating) FROM tickets WHERE rating IS NOT NULL").fetchone()[0]
        by_dept = c.execute(
            "SELECT d.name AS dept, COUNT(*) AS n, "
            "SUM(CASE WHEN t.status != ? THEN 1 ELSE 0 END) AS open_n, "
            "SUM(CASE WHEN t.status != ? AND t.due_at < ? THEN 1 ELSE 0 END) AS late_n "
            "FROM tickets t JOIN departments d ON d.id=t.dept_id GROUP BY d.name ORDER BY n DESC",
            (config.STATUS_CLOSED, config.STATUS_CLOSED, now_iso)).fetchall()
        by_cat = c.execute(
            "SELECT category, COUNT(*) AS n FROM tickets GROUP BY category ORDER BY n DESC").fetchall()
        # متوسّطُ زمن الإغلاق بالساعات
        rows = c.execute("SELECT created_at, closed_at FROM tickets WHERE closed_at IS NOT NULL").fetchall()
        avg_close = None
        if rows:
            hrs = [(db.parse(r["closed_at"]) - db.parse(r["created_at"])).total_seconds() / 3600 for r in rows]
            avg_close = sum(hrs) / len(hrs)
    return dict(total=total, open=open_, closed=closed, overdue=overdue, escalated=esc,
                rating=rating, avg_close=avg_close, by_dept=by_dept, by_cat=by_cat,
                on_time_pct=(100.0 * (closed) / total) if total else 0.0)
