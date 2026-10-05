# -*- coding: utf-8 -*-
"""اختباراتٌ من طرفٍ إلى طرف: التصنيف، والمسار الكامل، والتصعيد، والصلاحيّات."""
import os, sys, tempfile, datetime as dt
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("TK_DB", str(tmp_path / "t.db"))
    for m in [k for k in list(sys.modules) if k.startswith("app")]:
        del sys.modules[m]
    from app import config, db
    config.DB_PATH = str(tmp_path / "t.db")
    db.init()
    from app.seed import ensure_users
    ensure_users(reset_pw="Pw!12345")
    from fastapi.testclient import TestClient
    import app.main as main
    return TestClient(main.app)


# ───────────────────────────── التصنيف ─────────────────────────────
@pytest.mark.parametrize("text,cat,pri", [
    ("قدمت معاملتي قبل شهرين ولحد الان ما خلصت", "تأخير", "عالية"),
    ("معاملتي متأخرة شوية وأريد أعرف وين وصلت", "تأخير", "متوسطة"),
    ("اسمي مكتوب غلط في الوثيقة وأطلب تصحيح البيانات", "خطأ بيانات", "متوسطة"),
    ("رفضوا طلبي بدون سبب ولم يبينوا لي المبرر", "رفض غير مبرَّر", "متوسطة"),
    ("الموظف رفع صوته علي وتعامل بأسلوب غير لائق", "سوء تعامل", "متوسطة"),
    ("أرجو الإفادة ما هي الإجراءات المطلوبة؟", "أخرى", "دنيا"),
])
def test_classify(client, text, cat, pri):
    from app.classify import classify
    c, p, d, why = classify("شكوى", text)
    assert (c, p) == (cat, pri)
    from app import config
    assert d == config.ROUTING[c] and why


def test_classify_is_deterministic(client):
    from app.classify import classify
    a = classify("س", "رفضوا طلبي بدون سبب")
    for _ in range(5):
        assert classify("س", "رفضوا طلبي بدون سبب") == a


# ───────────────────────── المسارُ الكامل ─────────────────────────
def test_full_citizen_journey(client):
    from app import config, service, db
    r = client.post("/new", data={"citizen_name": "علي حسن محمود", "citizen_phone": "07700000000",
                                  "subject": "رفض طلبي بلا سبب",
                                  "body": "رفضوا طلبي بدون سبب ولم يبينوا لي المبرر رغم اكتمال المستمسكات"})
    assert r.status_code == 200
    import re
    ref = re.search(r"TK-\d{4}-\d{5}", r.text).group(0)
    t = service.get_by_ref(ref)
    assert t["category"] == "رفض غير مبرَّر" and t["dept"] == "القسم القانوني"
    token = t["token"]

    # المتابعةُ لا تعمل إلّا بالرمز الصحيح
    assert "لا توجد تذكرة" in client.post("/track", data={"ref": ref, "token": "ZZZZZZ"}).text
    assert ref in client.post("/track", data={"ref": ref, "token": token}).text

    # الموظّفُ يغلق، ثمّ يُقيّم المواطن
    client.post("/login", data={"username": "qanoni", "password": "Pw!12345"})
    tid = t["id"]
    csrf = _csrf(client, "/t/%d" % tid)
    client.post("/t/%d/status" % tid, data={"status": config.STATUS_CLOSED, "csrf": csrf})
    assert service.get(tid)["status"] == config.STATUS_CLOSED
    client.get("/logout")

    assert service.rate(ref, token, 5) is True
    assert service.get(tid)["rating"] == 5


def _csrf(client, path):
    import re
    html = client.get(path).text
    m = re.search(r'name="csrf" value="([^"]+)"', html)
    return m.group(1) if m else ""


# ───────────────────────────── التصعيد ─────────────────────────────
def test_escalation_levels_and_idempotence(client):
    from app import service, db, config
    ref, tok = service.create_ticket("زينب كريم", "", "تأخير معاملة",
                                     "معاملتي متأخرة منذ مدة ولم تنجز بعد")
    t = service.get_by_ref(ref)
    created = db.parse(t["created_at"])
    span = config.SLA_HOURS[t["priority"]]

    assert service.run_escalation(created + dt.timedelta(hours=span * 0.5)) == []
    assert len(service.run_escalation(created + dt.timedelta(hours=span * 1.0))) == 1
    assert service.get(t["id"])["esc_level"] == 1
    assert service.run_escalation(created + dt.timedelta(hours=span * 1.2)) == []   # لا يتكرّر
    assert len(service.run_escalation(created + dt.timedelta(hours=span * 1.5))) == 1
    assert service.get(t["id"])["esc_level"] == 2
    assert service.run_escalation(created + dt.timedelta(hours=span * 9)) == []     # لا ثالثَ له


def test_closed_ticket_never_escalates(client):
    from app import service, db, config
    ref, _ = service.create_ticket("مصطفى جواد", "", "استفسار", "أرجو الإفادة ما هي الإجراءات المطلوبة؟")
    t = service.get_by_ref(ref)
    service.set_status(t["id"], "موظّف", config.STATUS_CLOSED)
    far = db.parse(t["created_at"]) + dt.timedelta(days=90)
    assert service.run_escalation(far) == []
    assert service.get(t["id"])["esc_level"] == 0


def test_priority_change_recomputes_due(client):
    from app import service, db
    ref, _ = service.create_ticket("نور الهدى", "", "استفسار", "أرجو الإفادة ما هي الشروط المطلوبة؟")
    t = service.get_by_ref(ref)
    before = db.parse(t["due_at"])
    service.set_priority(t["id"], "المدير", "عالية")
    after = db.parse(service.get(t["id"])["due_at"])
    assert after < before


# ───────────────────────── الصلاحيّاتُ والأمن ─────────────────────────
def test_staff_pages_need_login(client):
    for p in ["/inbox", "/dash"]:
        assert client.get(p, follow_redirects=False).status_code == 303


def test_agent_cannot_open_manager_dashboard(client):
    client.post("/login", data={"username": "tasjeel", "password": "Pw!12345"})
    assert client.get("/dash").status_code == 403


def test_agent_cannot_reassign(client):
    from app import service
    ref, _ = service.create_ticket("حيدر عباس", "", "تأخير", "معاملتي متأخرة ولم تنجز بعد")
    tid = service.get_by_ref(ref)["id"]
    client.post("/login", data={"username": "tasjeel", "password": "Pw!12345"})
    csrf = _csrf(client, "/t/%d" % tid)
    assert client.post("/t/%d/dept" % tid,
                       data={"dept": "القسم القانوني", "csrf": csrf}).status_code == 403


def test_post_without_csrf_is_rejected(client):
    from app import service
    ref, _ = service.create_ticket("رقية سعد", "", "تأخير", "معاملتي متأخرة ولم تنجز بعد")
    tid = service.get_by_ref(ref)["id"]
    client.post("/login", data={"username": "tasjeel", "password": "Pw!12345"})
    assert client.post("/t/%d/reply" % tid, data={"note": "اختبار", "csrf": "خطأ"}).status_code == 400


def test_bad_password_rejected(client):
    r = client.post("/login", data={"username": "manager", "password": "غلط"})
    assert "غير صحيحة" in r.text


def test_agent_inbox_only_shows_own_department(client):
    from app import service
    service.create_ticket("أ", "", "رفض طلبي", "رفضوا طلبي بدون سبب ولم يبينوا المبرر")      # القانوني
    service.create_ticket("ب", "", "تأخير معاملة", "معاملتي متأخرة منذ مدة ولم تنجز")        # التسجيل
    client.post("/login", data={"username": "tasjeel", "password": "Pw!12345"})
    html = client.get("/inbox").text
    assert "تأخير معاملة" in html and "رفض طلبي" not in html


# ───────────────────────── التحقّقُ من المدخلات ─────────────────────────
def test_short_body_is_refused(client):
    r = client.post("/new", data={"citizen_name": "علي حسن", "citizen_phone": "",
                                  "subject": "موضوع", "body": "قصير"})
    assert "تعذّر قبولُ الطلب" in r.text


def test_refs_are_unique(client):
    from app import service
    refs = {service.create_ticket("ش %d" % i, "", "تأخير معاملة", "معاملتي متأخرة ولم تنجز بعد")[0]
            for i in range(25)}
    assert len(refs) == 25


def test_healthz(client):
    assert client.get("/healthz").json()["ok"] is True


# ───────────────────── صياغةُ الأعداد بالعربيّة ─────────────────────
@pytest.mark.parametrize("n,want", [
    (1, "يوم"), (2, "يومين"), (3, "٣ أيّام"), (10, "١٠ أيّام"),
    (11, "١١ يومًا"), (99, "٩٩ يومًا"), (100, "١٠٠ يوم"), (103, "١٠٣ أيّام"),
])
def test_arabic_counting(client, n, want):
    from app.arabic import count
    assert count(n, "يوم") == want


def test_no_latin_digits_in_arabic_log(client):
    """سجلُّ التذكرة يُقرأ على الشاشة، فلا يصحّ أن تتسرّب إليه أرقامٌ لاتينيّة."""
    import re, datetime as dt
    from app import service, db
    ref, _ = service.create_ticket("علي حسن", "", "تأخير معاملة", "معاملتي متأخرة منذ مدة ولم تنجز")
    t = service.get_by_ref(ref)
    service.run_escalation(db.parse(t["created_at"]) + dt.timedelta(days=40))
    for e in service.events(t["id"]):
        note = e["note"] or ""
        assert not re.search(r"[0-9]", note.replace(t["ref"], "")), note
