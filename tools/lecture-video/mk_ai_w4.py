# -*- coding: utf-8 -*-
"""نسخةُ عرضٍ بالقلم للأسبوع الرابع من «الذكاء الاصطناعي وتحليل البيانات» — المهارات في كلود.
لا يُمَسُّ محتوى المحاضرة: تُضاف معرّفاتٌ إلى نسخةٍ منها، ويُحقَن المحرّكُ قبل </body>."""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, '..', '..', 'ai', 'week1.html')
WORK = os.environ.get('LV_WORK', '/tmp/lecture-video')
OUT  = os.path.join(WORK, 'ai-week4-presenter.html')
os.makedirs(WORK, exist_ok=True)

s = open(SRC, encoding='utf-8').read()

# ───────────────────────── إضافةُ المعرّفات ─────────────────────────
def tag_id(anchor, idname, cls=None):
    """يضع id (وصنفًا اختياريًّا) على وسمٍ يبدأ بـ anchor — ويشترط أن يكون فريدًا."""
    global s
    assert s.count(anchor) == 1, 'anchor %r count=%d' % (anchor[:50], s.count(anchor))
    i = s.index(anchor)
    j = s.index('>', i)
    ins = ' id="%s"' % idname + (' class="%s"' % cls if cls and 'class=' not in s[i:j] else '')
    if cls and 'class="' in s[i:j]:
        s = s[:i] + s[i:j].replace('class="', 'class="%s ' % cls, 1) + s[j:]
        j = s.index('>', i)
        ins = ' id="%s"' % idname
    k = s.index(' ', i) if ' ' in s[i:j] else j
    s = s[:i + len(anchor.split('>')[0].split(' ')[0])] + ins + s[i + len(anchor.split('>')[0].split(' ')[0]):]

def put_id(anchor, idname, cls=None):
    """أبسطُ وأضمن: يستبدل الوسمَ المفتوحَ كاملًا بنسخةٍ تحمل المعرّف."""
    global s
    assert s.count(anchor) == 1, 'anchor %r count=%d' % (anchor[:60], s.count(anchor))
    name = re.match(r'<([a-zA-Z0-9]+)', anchor).group(1)
    extra = ' id="%s"' % idname
    if cls:
        if 'class="' in anchor:
            new = anchor.replace('class="', 'class="%s ' % cls, 1).replace('<' + name, '<' + name + extra, 1)
        else:
            new = anchor.replace('<' + name, '<' + name + extra + ' class="%s"' % cls, 1)
    else:
        new = anchor.replace('<' + name, '<' + name + extra, 1)
    s = s.replace(anchor, new, 1)

def id_after(after_text, open_tag, idname, cls=None):
    """يضع المعرّف على أوّل open_tag يقع بعد نصٍّ مرجعيٍّ فريد."""
    global s
    assert s.count(after_text) == 1, 'ref %r count=%d' % (after_text[:50], s.count(after_text))
    i = s.index(after_text) + len(after_text)
    j = s.index(open_tag, i)
    name = re.match(r'<([a-zA-Z0-9]+)', open_tag).group(1)
    extra = ' id="%s"' % idname
    if cls:
        rep = open_tag.replace('class="', 'class="%s ' % cls, 1).replace('<' + name, '<' + name + extra, 1) \
              if 'class="' in open_tag else open_tag.replace('<' + name, '<' + name + extra + ' class="%s"' % cls, 1)
    else:
        rep = open_tag.replace('<' + name, '<' + name + extra, 1)
    s = s[:j] + rep + s[j + len(open_tag):]

def nth_id(open_tag, n, idname):
    """المعرّفُ على الظهور رقم n (ابتداءً من ١) لوسمٍ متكرّر."""
    global s
    idx, pos = 0, 0
    while idx < n:
        pos = s.index(open_tag, pos) + (0 if idx + 1 == n else len(open_tag))
        idx += 1
    name = re.match(r'<([a-zA-Z0-9]+)', open_tag).group(1)
    s = s[:pos] + open_tag.replace('<' + name, '<' + name + ' id="%s"' % idname, 1) + s[pos + len(open_tag):]

# عناوينُ الأقسام السبعة
for n, title in enumerate([
        '١ · تعريف المهارة وأمثلتها',
        '٢ · الاستدعاء: التلقائيّ واليدويّ',
        '٣ · طرق صناعة المهارة',
        '٤ · بناء المهارة — سبع خطوات بمثالٍ متّصل',
        '٥ · المخاطر الأمنيّة',
        '٦ · بناء استمارة — الطريقة اليدويّة',
        '٧ · الاستمارة بمهارةٍ تُولّد سكربت Apps Script'], 1):
    put_id('<span>%s</span>' % title, 'w4-s%d' % n)

put_id('<strong>المهارة (Skill)</strong>', 'w4-skill')
put_id('<span class="hl hl-green">دليلُ عملٍ مكتوبٌ مرّةً واحدة</span>', 'w4-once')
put_id('<span class="hl hl-yellow">معرفةً لا يملكها كلود</span>', 'w4-know')
put_id('<strong>من يقرّر</strong>', 'w4-who')
put_id('<td><b>نحو ٢٠ دقيقة</b></td>', 'w4-20min')
put_id('<p class="dt-cap">رسم (١): دورة الاستدعاء التلقائيّ</p>', 'w4-cap-fig1', cls='v-gap')
put_id('<p class="dt-cap">جدول المقارنة — الطرق الخمسة</p>', 'w4-cap-cmp', cls='v-gap')
put_id('<p class="dt-cap">رسم (٢): ما يجري من الطلب إلى الاستمارة العاملة</p>', 'w4-cap-fig2', cls='v-gap')
put_id('<p class="dt-cap">ما يجري فعليًّا</p>', 'w4-cap-manual', cls='v-gap')

# الجداولُ والصناديقُ بالمواضع
id_after('جدول المقارنة — الطرق الخمسة</p>', '<table class="dt">', 'w4-tbl-cmp')
id_after('متى يُستعمل كلٌّ منهما — مع مثالٍ لكلّ حالة</p>', '<table class="dt">', 'w4-tbl-when')
id_after('<b>الترتيب مقصود:</b>', '<b>٣</b>', 'w4-step3')
put_id('<p>المثال المتّصل الذي تمرّ به الخطوات جميعًا: مهارةٌ تُعِدّ <strong>الملخّص الأسبوعيّ لمدير الشعبة</strong> من تقارير الوحدات.</p>', 'w4-s4p')
id_after('<b>القاعدة الجامعة للعمل الحكوميّ:</b>', '<b>', 'w4-rule')   # أوّلُ <b> بعد العنوان
nth_id('<div class="codebox yml">', 2, 'w4-cb2')   # الثاني أوّلًا: وسمُ الأوّل يزيح العدّ
nth_id('<div class="codebox yml">', 1, 'w4-cb1')

# صندوقُ مهارة الاستمارات (آخرُ codebox في الأسبوع الرابع)
i7 = s.index('id="w4-s7"')
j7 = s.index('<div class="codebox yml">', i7)
s = s[:j7] + '<div id="w4-cb3" class="codebox yml">' + s[j7 + len('<div class="codebox yml">'):]

for need in ['w4-s1','w4-s7','w4-skill','w4-once','w4-know','w4-who','w4-20min',
             'w4-cap-fig1','w4-cap-cmp','w4-cap-fig2','w4-cap-manual',
             'w4-tbl-cmp','w4-tbl-when','w4-step3','w4-rule','w4-cb1','w4-cb2','w4-cb3','w4-s4p']:
    assert s.count('id="%s"' % need) == 1, 'missing or duplicated id: ' + need

# ───────────────────────── المشاهد ─────────────────────────
SCENES = [
 dict(id='s01', title='ما المهارة', target='#w4-s1', zoom=1.35,
      click='.tab[data-target="slide-4"]',
      text='موظّفٌ يشرح لكلود في كلّ محادثةٍ قالبَ الكتاب الرسميّ في دائرته، ثمّ يعيد الشرحَ من أوّله في المحادثة التالية. '
           'والمهارةُ تُنهي هذا التكرار: حزمةُ تعليماتٍ تُكتب مرّةً واحدة، فيرجع إليها كلود من تلقاء نفسه كلّما اقتضت الحاجة. '
           'وهي ليست أداةً تنفّذ، بل تهيئةٌ تجعل التنفيذ يقع على الوجه المطلوب.',
      minMs=30000,
      marks=[dict(at=5000, type='circle', target='#w4-skill'),
             dict(at=13000, type='underline', target='#w4-once'),
             dict(at=21000, type='highlight', target='#w4-once')]),

 dict(id='s02', title='المهارة النصّية', target='#w4-cb1', zoom=1.2,
      text='وأبسطُ صورةٍ لها نصٌّ خالصٌ بلا ملفّاتٍ ولا برامج. هذه مهارةُ صياغة الكتاب الرسميّ: '
           'سطرُ الاسم، ثمّ سطرُ الوصف الذي يقول ماذا تفعل ومتى تُستعمل، ثمّ المتنُ وفيه التركيبُ الثابت وقواعدُ الصياغة والخاتمةُ المعتمدة. '
           'وهذا وحده أكثرُ ما يحتاجه الموظّفُ الإداريّ.',
      minMs=30000,
      marks=[dict(at=6000, type='box', target='#w4-cb1'),
             dict(at=18000, type='underline', target='#w4-cb1', width=2.6)]),

 dict(id='s03', title='قيمة المهارة', target='#w4-know', zoom=1.15,
      text='والمهارةُ الثانية تصنّف الشكاوى إلى خمس فئاتٍ بدرجة إلحاحٍ وجهةِ إحالة. '
           'وموضعُ قيمتها أنّها تحمل معرفةً لا يملكها كلود: فئاتُكم أنتم، وقواعدُ إحالتكم أنتم. '
           'فالمهارةُ لا تضيف ذكاءً، إنّما تضيف ما تعرفه الدائرةُ وحدها.',
      minMs=28000,
      marks=[dict(at=6000, type='box', target='#w4-cb2'),
             dict(at=16000, type='highlight', target='#w4-know'),
             dict(at=22000, type='underline', target='#w4-know')]),

 dict(id='s04', title='الاستدعاء التلقائيّ', target='#w4-cap-fig1', zoom=1.1,
      text='ثمّ يأتي سؤالُ من يقرّر فتحَ المهارة. في الطريق التلقائيّ يقارن كلود الطلبَ بأوصاف المهارات المتاحة كلِّها، '
           'فإن طابق الوصفُ فُتِح المتنُ ونُفِّذ به، وإن لم يطابق خرجت إجابةٌ عامّةٌ بلا استدعاء. '
           'ومعنى ذلك أنّ الوصفَ هو البوّابة، لا المتن.',
      minMs=30000,
      marks=[dict(at=5000, type='underline', target='#w4-who'),
             dict(at=14000, type='note', target='#w4-cap-fig1', text='الوصفُ هو البوّابة', side='above')]),

 dict(id='s05', title='اليدويّ والتلقائيّ', target='#w4-tbl-when', zoom=1.1,
      text='ويبقى الطريقُ اليدويّ: ذكرُ اسم المهارة داخل الجملة. '
           'ويُستعمل حين لا يلتقط الوصفُ الطلب، وحين تتقارب مهارتان فتُراد إحداهما بعينها، وعند اختبار مهارةٍ جديدة. '
           'ومن هنا قاعدةٌ تشخيصيّة: ما عمل باليد ولم يعمل تلقائيًّا، فعلّتُه في الوصف لا في المتن.',
      minMs=32000,
      marks=[dict(at=6000, type='box', target='#w4-tbl-when'),
             dict(at=20000, type='highlight', target='#w4-tbl-when')]),

 dict(id='s06', title='طرق الصناعة', target='#w4-s3', zoom=1.3,
      text='والمهارةُ في جوهرها مجلَّدٌ فيه ملفُّ سكِل دوت إم دي، مهما اختُلف في طريق الوصول إليه. '
           'والطرقُ خمسٌ: مهارةُ التوليد، والتسجيلُ بالشاشة، والتحريرُ في المحادثة، والكتابةُ اليدويّة، ومستودعُ الدائرة. '
           'وليس بينها طريقٌ أصحُّ من غيره؛ الفارقُ في مَن يملك المادّة وكم من الوقت يُبذَل.',
      minMs=32000,
      marks=[dict(at=5000, type='underline', target='#w4-s3'),
             dict(at=18000, type='circle', target='#w4-s3')]),

 dict(id='s07', title='جدول الطرق الخمس', target='#w4-tbl-cmp', zoom=1.05,
      text='والجدولُ يضع الطرقَ الخمسَ في ثلاثة أعمدة: مَن يكتب المتن، والزمنُ التقديريّ، ونطاقُ الانتفاع. '
           'والعمودُ الأخيرُ هو الفاصل: الطرقُ الأربعُ الأولى تُنتج مهارةً في حسابٍ واحد، والخامسُ وحده يُنتج مهارةً في جهة. '
           'ولذلك يُبدأ بالأوّل للتجريب، فإذا ثبتت المهارةُ نُقلت إلى الخامس.',
      minMs=32000,
      marks=[dict(at=6000, type='box', target='#w4-tbl-cmp'),
             dict(at=18000, type='note', target='#w4-cap-cmp', text='الخامسُ وحده للجهة', side='above')]),

 dict(id='s08', title='سبع خطوات', target='#w4-s4', zoom=1.3,
      text='ثمّ بناءُ المهارة في سبع خطواتٍ بمثالٍ متّصل: ملخّصٌ أسبوعيٌّ لمدير شعبة. '
           'يُتحقَّق أوّلًا من شرطَي التكرار وثبات الإجراء، ثمّ يُصاغ الاسم، ثمّ الوصف، ثمّ المتن، '
           'ثمّ يُرفَق مثالٌ محلول، ثمّ تُختبر على حالةٍ حقيقيّة، ثمّ تُنقَّح على ما شُوهد لا على ما يُظَنّ.',
      minMs=32000,
      marks=[dict(at=5000, type='underline', target='#w4-s4'),
             dict(at=20000, type='box', target='#w4-s4p')]),

 dict(id='s09', title='موضع الفشل', target='#w4-step3', zoom=1.35,
      text='وترتيبُ الخطوات مقصود. فالخطوتان الثالثةُ والسادسةُ — الوصفُ والاختبار — هما موضعُ الفشل الغالب، '
           'والخطوةُ الرابعةُ وهي المتنُ موضعُ الإسراف الغالب: يُكتب فيها ما يعرفه كلود أصلًا فيطول بلا فائدة. '
           'والمتنُ إنّما يحمل ما لا يعرفه: أسماءَ الوحدات، والترتيبَ المعتمد، والحدودَ الرقميّة.',
      minMs=32000,
      marks=[dict(at=5000, type='box', target='#w4-step3'),
             dict(at=19000, type='underline', target='#w4-step3')]),

 dict(id='s10', title='المخاطر الأمنيّة', target='#w4-s5', zoom=1.3,
      text='ثمّ المخاطر. فتثبيتُ مهارةٍ من مصدرٍ مجهول أقربُ إلى تثبيت برنامجٍ مجهولٍ على حاسوب الدائرة. '
           'وصورُ الخطر ثلاث: مهارةٌ تفعل غير ما تصف، ومهارةٌ تستورد تعليماتها من رابطٍ يتغيّر بعد الفحص، '
           'وبياناتٌ حسّاسةٌ تُكتب في المتن فتتسرّب مع المهارة. والقاعدةُ: المهارةُ تحمل القاعدة لا الحالة.',
      minMs=34000,
      marks=[dict(at=6000, type='underline', target='#w4-s5'),
             dict(at=22000, type='note', target='#w4-s5', text='القاعدة لا الحالة', side='above')]),

 dict(id='s11', title='الاستمارة يدويًّا', target='#w4-cap-manual', zoom=1.15,
      text='ومثالٌ أخير: استمارةُ شكوى من عشرة حقول. بناؤها باليد نحو عشرين دقيقة. '
           'والإرهاقُ ليس في العشرين، بل في أنّها تتكرّر كاملةً مع كلّ استمارةٍ جديدة، '
           'وأنّ التكرارَ اليدويّ يُنتج اختلافًا في التسميات فيتعذّر جمعُ البيانات لاحقًا في تقريرٍ واحد.',
      minMs=32000,
      marks=[dict(at=7000, type='circle', target='#w4-20min'),
             dict(at=20000, type='note', target='#w4-cap-manual', text='تتكرّر كلَّ مرّة', side='above')]),

 dict(id='s12', title='الاستمارة بمهارة', target='#w4-cb3', zoom=1.15,
      text='والمهارةُ هنا لا تبني الاستمارة، بل تُعلّم كلود كيف يولّد السكربتَ الذي يبنيها وفق معايير الدائرة: '
           'الحقولُ الثابتة، والتسمياتُ المعتمدةُ حرفيًّا، والشعبُ الأربع. '
           'فيصير الطلبُ بلغةٍ عاديّةٍ أوّلَه، والاستمارةُ العاملةُ آخرَه — وما بينهما مكتوبٌ مرّةً واحدة.',
      minMs=32000,
      marks=[dict(at=6000, type='box', target='#w4-cb3'),
             dict(at=20000, type='note', target='#w4-cap-fig2', text='مرّةً واحدة', side='above')]),
]

# أسماءٌ مقروءةٌ للمراسي — تُستعمل في نصّ التسجيل لا في الصفحة
LABELS = {
 'w4-skill':'تعريف المهارة', 'w4-once':'دليلُ عملٍ مكتوبٌ مرّةً واحدة',
 'w4-know':'معرفةٌ لا يملكها كلود', 'w4-who':'مَن يقرّر',
 'w4-cb1':'صندوقُ مهارة الكتاب الرسميّ', 'w4-cb2':'صندوقُ مهارة تصنيف الشكاوى',
 'w4-cb3':'صندوقُ مهارة بناء الاستمارات', 'w4-tbl-when':'جدولُ متى يُستعمل كلٌّ منهما',
 'w4-tbl-cmp':'جدولُ المقارنة بين الطرق الخمس', 'w4-20min':'خانةُ «نحو ٢٠ دقيقة»',
 'w4-step3':'سطرُ «الترتيب مقصود»', 'w4-s2':'عنوانُ الاستدعاء', 'w4-s3':'عنوانُ طرق الصناعة',
 'w4-s4':'عنوانُ سبع خطوات', 'w4-s4p':'فقرةُ المثال المتّصل', 'w4-s5':'عنوانُ المخاطر الأمنيّة',
}

CHROME = '''
<link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
<style id="presenter-chrome">
  body.presenting .reader-btn, body.presenting .reader-panel,
  body.presenting .print-btn, body.presenting .ann-bar,
  body.presenting .timer, body.presenting .sheet,
  body.presenting .print-foot, body.presenting .pin-badge { display:none !important; }
  body.presenting .tabs, body.presenting .tab { visibility:hidden; }
  body.presenting .paper-wrapper{ zoom:var(--pz,1.35); }
  /* فُسحةٌ بيضاءُ فوق كلّ عنصرٍ تُكتب فوقه ملاحظةٌ بخطّ اليد */
  body.presenting .v-gap{ margin-top:112px; }
</style>
<script>
window.LECTURE_TIMELINE = { pen: { color: "#ff1f3d", width: 3.6 }, scenes: __SCENES__ };
</script>
'''

engine = open(os.path.join(HERE, 'engine.js'), encoding='utf-8').read()
inject = CHROME.replace('__SCENES__', json.dumps(SCENES, ensure_ascii=False, indent=1)) \
       + '\n<script>\n' + engine + '\n</script>\n'

k = s.rfind('</body>')
assert k > 0
s = s[:k] + inject + s[k:]
open(OUT, 'w', encoding='utf-8').write(s)
print('presenter: %s (%s chars, %d scenes, %d marks)'
      % (os.path.basename(OUT), format(len(s), ','), len(SCENES), sum(len(x['marks']) for x in SCENES)))
