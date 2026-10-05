# -*- coding: utf-8 -*-
"""تهيئةُ النظام: الحساباتُ وبياناتُ عرضٍ واقعيّةٌ تملأ لوحةَ المدير.

    python3 -m app.seed --demo         بيانات عرضٍ كاملة
    python3 -m app.seed --users-only   الحساباتُ وحدها (للتشغيل الحقيقيّ)
"""
import sys, random, datetime as dt
from . import db, config, service

USERS = [
    ("manager", "مدير الدائرة",        "manager", None),
    ("tasjeel", "موظّف شعبة التسجيل",  "agent",   "شعبة التسجيل"),
    ("qanoni",  "موظّف القسم القانوني", "agent",   "القسم القانوني"),
    ("mawarid", "موظّف الموارد البشرية","agent",   "الموارد البشرية"),
    ("mutabaa", "موظّف شعبة المتابعة",  "agent",   "شعبة المتابعة"),
]

SAMPLES = [
    ("تأخير إنجاز معاملة", "قدّمت معاملتي قبل شهرين ولحد الآن ما خلصت، وراجعت عدّة مرّات ووعدوني بلا نتيجة."),
    ("خطأ في اسمي بالوثيقة", "اسمي مكتوب غلط في الوثيقة الصادرة وأطلب تصحيح البيانات."),
    ("رفض طلبي بلا سبب", "رفضوا طلبي بدون سبب ولم يبيّنوا لي المبرّر رغم استكمال المستمسكات."),
    ("أسلوب موظّف غير لائق", "الموظّف رفع صوته عليّ وتعامل بأسلوب غير لائق أمام المراجعين."),
    ("استفسار عن الإجراءات", "أرجو الإفادة ما هي الإجراءات المطلوبة لاستخراج الوثيقة؟"),
    ("استقطاع من الراتب", "تمّ استقطاع مبلغ من راتبي بدون علمي وأطلب بيان السبب."),
    ("تأخّر ثلاثة أشهر", "مرّت ٣ أشهر على معاملتي ولم تُنجَز وتجاوزت المدّة القانونيّة."),
    ("خطأ في رقم المعاملة", "رقم المعاملة المثبّت في الوصل غير صحيح ولا يظهر عند الاستعلام."),
    ("تجاهل من الشعبة", "راجعت الشعبة ثلاث مرّات والموظّف تجاهلني ولم يعرني انتباهًا."),
    ("طلب معلومة عن الدوام", "متى يُفتح الدوام الرسميّ لاستقبال المراجعين؟"),
    ("رفض استلام المستمسكات", "رفضوا استلام مستمسكاتي بدون مبرّر واضح."),
    ("تأخير صرف المستحقّات", "مستحقّاتي متأخّرة منذ شهرين ولم يُصرف المبلغ لحد الآن."),
    ("خطأ في تاريخ الميلاد", "تاريخ الميلاد مثبّت خطأ في السجلّ وأطلب تصحيح المعلومة."),
    ("سوء تعامل عند الاستعلام", "الموظّف في الاستعلامات تعامل بقلّة احترام ولم يجب عن سؤالي."),
    ("استفسار عن الشروط", "ما هي الشروط المطلوبة لتقديم الطلب؟ أرجو التوضيح."),
    ("معاملة ضائعة", "معاملتي متأخّرة ولا أحد يعرف أين وصلت منذ أسبوعين."),
    ("رفض تجديد الإجازة", "رُفض تجديد إجازتي بلا سبب رغم استيفاء الشروط."),
    ("خطأ بيانات العنوان", "العنوان المسجّل غير صحيح وأطلب تصحيحه."),
]

NAMES = ["علي حسن محمود", "زينب كريم عبد", "مصطفى جواد سلمان", "نور الهدى عامر",
         "حيدر عبّاس فاضل", "رقيّة سعد ناصر", "أحمد وليد خضير", "مريم فالح جبر",
         "عمّار ياسر داود", "سجى منذر طالب", "كرار حميد شاكر", "دعاء رياض لطيف"]

REPLIES = ["أُحيلت المعاملة إلى الشعبة المختصّة وجارٍ النظر فيها.",
           "طُلب استكمالُ مستمسكٍ ناقص، وينتظر النظامُ ردَّ المواطن.",
           "روجعت المعاملةُ وتبيّن أنّها في مرحلة التدقيق النهائيّ.",
           "صُحِّحت البيانةُ في السجلّ وأُشعِر المواطنُ بذلك."]


def ensure_users(reset_pw=None):
    db.init()
    out = []
    with db.tx() as c:
        for username, fullname, role, dept in USERS:
            did = db.dept_id(c, dept) if dept else None
            pw = reset_pw or db.new_token() + db.new_token()
            row = c.execute("SELECT id FROM users WHERE username=?", (username,)).fetchone()
            if row:
                if reset_pw:
                    c.execute("UPDATE users SET pw_hash=? WHERE id=?", (db.hash_pw(pw), row["id"]))
                    out.append((username, pw, role, dept))
                continue
            c.execute("INSERT INTO users(username, fullname, pw_hash, role, dept_id) VALUES (?,?,?,?,?)",
                      (username, fullname, db.hash_pw(pw), role, did))
            out.append((username, pw, role, dept))
    return out


def demo(n=18):
    """يملأ النظامَ بتذاكرَ موزّعةٍ على الأيّام الماضية، بعضُها مغلقٌ وبعضُها متأخّرٌ ومُصعَّد."""
    rnd = random.Random(20261005)
    # أعمارٌ موزّعةٌ بالقرعة على التذاكر كلِّها، فلا يتكدّس التأخّرُ في شعبةٍ واحدة
    ages = [2, 6, 10, 20, 30, 40, 50, 60, 72, 90, 100, 120, 140, 160, 190, 220, 14, 26]
    while len(ages) < n:
        ages.append(rnd.randrange(2, 200))
    ages = ages[:n]
    rnd.shuffle(ages)
    made = []
    for i in range(n):
        subj, body = SAMPLES[i % len(SAMPLES)]
        name = NAMES[i % len(NAMES)]
        ref, token = service.create_ticket(name, "0770%07d" % rnd.randrange(10 ** 7), subj, body)
        made.append(ref)
        # تعتيقُ التذكرة: تُزاح أزمنتُها إلى الوراء لتظهر اللوحةُ بحالةٍ واقعيّة
        back = ages[i]
        t = service.get_by_ref(ref)
        created = db.parse(t["created_at"]) - dt.timedelta(hours=back)
        due = created + dt.timedelta(hours=config.SLA_HOURS[t["priority"]])
        with db.tx() as c:
            c.execute("UPDATE tickets SET created_at=?, due_at=? WHERE id=?",
                      (db.iso(created), db.iso(due), t["id"]))
            c.execute("UPDATE events SET at=? WHERE ticket_id=?", (db.iso(created), t["id"]))
        tid = t["id"]
        if i % 3 == 0:
            service.add_reply(tid, "موظّف الشعبة", rnd.choice(REPLIES))
            service.set_status(tid, "موظّف الشعبة", config.STATUS_PROGRESS)
        if i % 5 == 0:
            service.add_reply(tid, "موظّف الشعبة", rnd.choice(REPLIES))
            service.set_status(tid, "موظّف الشعبة", config.STATUS_CLOSED)
            with db.tx() as c:
                c.execute("UPDATE tickets SET closed_at=? WHERE id=?",
                          (db.iso(created + dt.timedelta(hours=rnd.randrange(2, 40))), tid))
            service.rate(ref, token, rnd.choice([3, 4, 4, 5, 5]), None)
        if i % 7 == 3:
            service.set_status(tid, "موظّف الشعبة", config.STATUS_WAITING)
    raised = service.run_escalation()
    return made, raised


if __name__ == "__main__":
    args = sys.argv[1:]
    pw = None
    for a in args:
        if a.startswith("--password="):
            pw = a.split("=", 1)[1]
    created = ensure_users(reset_pw=pw)
    if created:
        print("الحسابات (تُحفَظ الآن — لا تُعرَض مرّةً أخرى):")
        for u, p, role, dept in created:
            print("  %-9s %-34s %-8s %s" % (u, p, role, dept or "—"))
    else:
        print("الحساباتُ موجودةٌ سلفًا. وتُعاد كلمةُ المرور بـ --password=...")
    if "--demo" in args:
        made, raised = demo()
        print("تذاكرُ العرض: %d | مُصعَّدة: %d" % (len(made), len(raised)))
