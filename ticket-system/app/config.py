# -*- coding: utf-8 -*-
"""ثوابتُ النظام: الفئاتُ وقواعدُ الإحالة ودرجاتُ الإلحاح ومُددُ الاستجابة والتصعيد.

القواعدُ منقولةٌ كما هي من مادّة المحاضرة، فلا يختلف ما يُشرَح عمّا يُنفَّذ.
"""
import os

APP_NAME = "نظامُ التذاكر"
ORG_NAME = "المعهد العالي لإعداد وتأهيل القادة"

DB_PATH     = os.environ.get("TK_DB", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "tickets.db"))
SECRET_KEY  = os.environ.get("TK_SECRET", "")          # يُولَّد عند أوّل تشغيلٍ إن تُرِك فارغًا
BASE_URL    = os.environ.get("TK_BASE_URL", "")

# ── الفئاتُ الخمس ──
CATEGORIES = ["تأخير", "خطأ بيانات", "رفض غير مبرَّر", "سوء تعامل", "أخرى"]

# ── الشُّعَبُ وجهاتُ الإحالة ──
DEPARTMENTS = ["شعبة التسجيل", "القسم القانوني", "الموارد البشرية", "شعبة المتابعة"]

ROUTING = {
    "تأخير":          "شعبة التسجيل",
    "خطأ بيانات":     "شعبة التسجيل",
    "رفض غير مبرَّر": "القسم القانوني",
    "سوء تعامل":      "الموارد البشرية",
    "أخرى":           "شعبة المتابعة",
}

# ── درجاتُ الإلحاح ومُدَدُ الاستجابة (بالساعات) ──
PRIORITIES = ["عالية", "متوسطة", "دنيا"]
SLA_HOURS  = {"عالية": 24, "متوسطة": 72, "دنيا": 120}

# ── التصعيد: مستوًى أوّلُ عند تجاوز المدّة، وثانٍ عند تجاوزها بالنصف ──
ESCALATION = [
    (1.0, 1, "رئيس القسم"),
    (1.5, 2, "المدير العام"),
]

# ── الحالات ──
STATUS_NEW      = "جديدة"
STATUS_PROGRESS = "قيد المعالجة"
STATUS_WAITING  = "بانتظار المواطن"
STATUS_CLOSED   = "مغلقة"
STATUSES = [STATUS_NEW, STATUS_PROGRESS, STATUS_WAITING, STATUS_CLOSED]
OPEN_STATUSES = [STATUS_NEW, STATUS_PROGRESS, STATUS_WAITING]

ROLES = ["agent", "manager"]
