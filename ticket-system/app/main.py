# -*- coding: utf-8 -*-
"""واجهةُ الويب: صفحاتُ المواطن وصفحاتُ الموظّف ولوحةُ المدير."""
import os, time, datetime as dt
from contextlib import asynccontextmanager
from collections import defaultdict
from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from . import config, db, service, auth
from .arabic import num as ar_num, count as ar_count

HERE = os.path.dirname(os.path.abspath(__file__))
@asynccontextmanager
async def lifespan(_app):
    db.init()
    yield


app = FastAPI(title=config.APP_NAME, docs_url="/api/docs", redoc_url=None, lifespan=lifespan)
app.mount("/static", StaticFiles(directory=os.path.join(HERE, "static")), name="static")
T = Jinja2Templates(directory=os.path.join(HERE, "templates"))

def ar_dt(s, with_time=True):
    if not s:
        return "—"
    t = db.parse(s).astimezone()
    return ar_num(t.strftime("%Y/%m/%d %H:%M") if with_time else t.strftime("%Y/%m/%d"))


def ar_ago(s):
    """فرقُ الزمن بعبارةٍ عربيّةٍ مختصرة."""
    secs = (db.now() - db.parse(s)).total_seconds()
    past = secs >= 0
    secs = abs(secs)
    if secs < 3600:
        v, u = max(1, int(secs // 60)), "دقيقة"
    elif secs < 86400:
        v, u = int(secs // 3600), "ساعة"
    else:
        v, u = int(secs // 86400), "يوم"
    return ("منذ %s" if past else "بعد %s") % ar_count(v, u)


def is_late(t):
    return t["status"] != config.STATUS_CLOSED and db.parse(t["due_at"]) < db.now()


T.env.filters.update(ar_num=ar_num, ar_dt=ar_dt, ar_ago=ar_ago)
T.env.globals.update(cfg=config, is_late=is_late, APP=config.APP_NAME, ORG=config.ORG_NAME)


def page(request, name, **ctx):
    ctx.setdefault("user", auth.current_user(request))
    ctx.setdefault("csrf", auth.csrf_token(request))
    return T.TemplateResponse(request, name, ctx)


# ───────────────────────── حُرّاسُ الوصول ─────────────────────────
def need_user(request: Request):
    u = auth.current_user(request)
    if not u:
        raise HTTPException(status_code=303, headers={"Location": "/login"})
    return u


def need_manager(request: Request):
    u = need_user(request)
    if u["role"] != "manager":
        raise HTTPException(status_code=403, detail="هذه الصفحة للمدير.")
    return u


def guard_csrf(request: Request, token: str):
    if not auth.csrf_ok(request, token):
        raise HTTPException(status_code=400, detail="رمزُ الطلب غير صالح. تُعاد الصفحةُ وتُحاوَل مرّةً أخرى.")


@app.exception_handler(HTTPException)
async def on_http_error(request: Request, exc: HTTPException):
    if exc.status_code == 303 and exc.headers and "Location" in exc.headers:
        return RedirectResponse(exc.headers["Location"], status_code=303)
    return T.TemplateResponse(request, "error.html",
                              {"code": exc.status_code, "detail": exc.detail,
                               "user": auth.current_user(request)}, status_code=exc.status_code)


# ───────────────────────── صفحاتُ المواطن ─────────────────────────
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return page(request, "home.html")


@app.get("/new", response_class=HTMLResponse)
def new_form(request: Request):
    return page(request, "new.html")


_RATE = defaultdict(list)          # حدٌّ بسيطٌ لعدد الطلبات من العنوان الواحد


def rate_limited(request: Request, limit=5, window=300):
    ip = (request.client.host if request.client else "?")
    nowt = time.time()
    hits = [t for t in _RATE[ip] if nowt - t < window]
    _RATE[ip] = hits + [nowt]
    return len(hits) >= limit


@app.post("/new", response_class=HTMLResponse)
def new_submit(request: Request,
               citizen_name: str = Form(...), citizen_phone: str = Form(""),
               subject: str = Form(...), body: str = Form(...)):
    errs = []
    if len(citizen_name.strip()) < 3:
        errs.append("الاسمُ قصيرٌ جدًّا.")
    if len(subject.strip()) < 5:
        errs.append("الموضوعُ قصيرٌ جدًّا.")
    if len(body.strip()) < 20:
        errs.append("نصُّ الشكوى يحتاج تفصيلًا أوفى (عشرون حرفًا على الأقلّ).")
    if rate_limited(request):
        errs.append("وردت طلباتٌ كثيرةٌ من هذا الجهاز في وقتٍ قصير. تُعاد المحاولةُ بعد قليل.")
    if errs:
        return page(request, "new.html", errors=errs, form=dict(
            citizen_name=citizen_name, citizen_phone=citizen_phone, subject=subject, body=body))

    ref, token = service.create_ticket(citizen_name, citizen_phone, subject, body)
    t = service.get_by_ref(ref)
    return page(request, "created.html", t=t, ref=ref, token=token)


@app.get("/track", response_class=HTMLResponse)
def track_form(request: Request, ref: str = "", token: str = ""):
    if ref and token:
        return _track(request, ref, token)
    return page(request, "track.html")


@app.post("/track", response_class=HTMLResponse)
def track_submit(request: Request, ref: str = Form(...), token: str = Form(...)):
    return _track(request, ref, token)


def _track(request, ref, token):
    t = service.get_by_ref(ref, token)
    if not t:
        return page(request, "track.html", error="لا توجد تذكرةٌ بهذا الرقم والرمز.",
                    form=dict(ref=ref, token=token))
    return page(request, "ticket_public.html", t=t, ev=service.events(t["id"], public_only=True),
                token=token.strip().upper())


@app.post("/rate", response_class=HTMLResponse)
def rate(request: Request, ref: str = Form(...), token: str = Form(...),
         stars: int = Form(...), note: str = Form("")):
    ok = service.rate(ref, token, stars, note.strip() or None)
    t = service.get_by_ref(ref, token)
    if not t:
        return page(request, "track.html", error="لا توجد تذكرةٌ بهذا الرقم والرمز.")
    return page(request, "ticket_public.html", t=service.get_by_ref(ref, token),
                ev=service.events(t["id"], public_only=True), token=token.strip().upper(),
                rated=ok, rate_error=None if ok else "التقييمُ يكون بعد إغلاق التذكرة.")


# ───────────────────────── الدخولُ والخروج ─────────────────────────
@app.get("/login", response_class=HTMLResponse)
def login_form(request: Request):
    return page(request, "login.html")


@app.post("/login")
def login_submit(request: Request, username: str = Form(...), password: str = Form(...)):
    u = auth.authenticate(username, password)
    if not u:
        return page(request, "login.html", error="اسمُ المستخدم أو كلمةُ المرور غير صحيحة.")
    sid = auth.login(u["id"])
    r = RedirectResponse("/dash" if u["role"] == "manager" else "/inbox", status_code=303)
    r.set_cookie(auth.COOKIE, sid, httponly=True, samesite="lax",
                 secure=bool(os.environ.get("TK_HTTPS")), max_age=60 * 60 * 12, path="/")
    return r


@app.get("/logout")
def logout(request: Request):
    auth.logout(request.cookies.get(auth.COOKIE))
    r = RedirectResponse("/", status_code=303)
    r.delete_cookie(auth.COOKIE, path="/")
    return r


# ───────────────────────── صفحاتُ الموظّف ─────────────────────────
@app.get("/inbox", response_class=HTMLResponse)
def inbox(request: Request, status: str = "", overdue: int = 0, q: str = ""):
    u = need_user(request)
    dept = None if u["role"] == "manager" else u["dept"]
    rows = service.list_tickets(dept=dept, status=status or None, overdue=bool(overdue), q=q or None)
    return page(request, "inbox.html", rows=rows, f=dict(status=status, overdue=overdue, q=q), dept=dept)


@app.get("/t/{tid}", response_class=HTMLResponse)
def ticket_page(request: Request, tid: int):
    need_user(request)
    t = service.get(tid)
    if not t:
        raise HTTPException(404, "لا توجد تذكرةٌ بهذا المعرّف.")
    return page(request, "ticket_staff.html", t=t, ev=service.events(tid))


@app.post("/t/{tid}/reply")
def do_reply(request: Request, tid: int, note: str = Form(...), public: int = Form(0), csrf: str = Form("")):
    u = need_user(request); guard_csrf(request, csrf)
    if note.strip():
        service.add_reply(tid, u["fullname"], note.strip(), public=public)
    return RedirectResponse("/t/%d" % tid, status_code=303)


@app.post("/t/{tid}/status")
def do_status(request: Request, tid: int, status: str = Form(...), csrf: str = Form("")):
    u = need_user(request); guard_csrf(request, csrf)
    service.set_status(tid, u["fullname"], status)
    return RedirectResponse("/t/%d" % tid, status_code=303)


@app.post("/t/{tid}/dept")
def do_dept(request: Request, tid: int, dept: str = Form(...), csrf: str = Form("")):
    u = need_manager(request); guard_csrf(request, csrf)
    service.reassign(tid, u["fullname"], dept)
    return RedirectResponse("/t/%d" % tid, status_code=303)


@app.post("/t/{tid}/priority")
def do_priority(request: Request, tid: int, priority: str = Form(...), csrf: str = Form("")):
    u = need_manager(request); guard_csrf(request, csrf)
    service.set_priority(tid, u["fullname"], priority)
    return RedirectResponse("/t/%d" % tid, status_code=303)


# ───────────────────────── لوحةُ المدير ─────────────────────────
@app.get("/dash", response_class=HTMLResponse)
def dash(request: Request):
    need_manager(request)
    service.run_escalation()
    return page(request, "dash.html", m=service.metrics(),
                late=service.list_tickets(overdue=True, limit=50),
                esc=service.list_tickets(escalated=True, limit=50))


@app.post("/escalate/run")
def do_escalate(request: Request, csrf: str = Form("")):
    need_manager(request); guard_csrf(request, csrf)
    service.run_escalation()
    return RedirectResponse("/dash", status_code=303)


@app.get("/healthz")
def healthz():
    with db.conn() as c:
        n = c.execute("SELECT COUNT(*) FROM tickets").fetchone()[0]
    return JSONResponse({"ok": True, "tickets": n})
