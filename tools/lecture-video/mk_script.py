# -*- coding: utf-8 -*-
"""يولّد نصَّ التسجيل الصوتيّ من مشاهد ملفّ البناء — فلا يقع اختلافٌ بين المنطوق والمكتوب.
    python3 mk_script.py <ملفّ البناء> <ملفّ المخرَج.md> <عنوان>"""
import importlib.util, os, sys, json, re

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = sys.argv[1] if len(sys.argv) > 1 else 'mk_ai_w4.py'
OUT   = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'نص-التسجيل-الذكاء-٤.md')
TITLE = sys.argv[3] if len(sys.argv) > 3 else 'الذكاء الاصطناعي — الأسبوع الرابع: المهارات في كلود'

src = open(os.path.join(HERE, BUILD), encoding='utf-8').read()
ns = {'__file__': os.path.join(HERE, BUILD)}
exec(compile(src[:src.index('CHROME =')], BUILD, 'exec'), ns)   # حتّى المشاهد فقط
SC = ns['SCENES']

AR = {'underline':'خطٌّ تحت', 'circle':'دائرةٌ حول', 'box':'مربّعٌ حول',
      'highlight':'تظليلٌ أصفرُ على', 'note':'خطُّ يدٍ', 'arrow':'سهمٌ إلى',
      'strike':'شطبٌ على', 'check':'علامةُ صحٍّ عند'}

AR_D = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')
def ar(n): return str(n).translate(AR_D)
LABELS = ns.get('LABELS', {})
def label(m):
    if m['type'] == 'note': return '«%s»' % m['text']
    t = m['target'].lstrip('#')
    return '«%s»' % LABELS.get(t, t)

lines = ['# نصُّ التسجيل الصوتيّ — %s' % TITLE, '',
         'اثنا عشر تسجيلًا منفصلًا، واحدٌ لكلّ مشهد. الأرقامُ بين القوسين مواضعُ القلم:',
         'لا تُقرأ ولا يُوقَف عندها — هي لضبط رسم القلم على الكلام.', '']
for n, s in enumerate(SC, 1):
    body = s['text']
    # ادراجُ أرقام العلامات عند أقربِ نهاية جملةٍ لنسبة توقيتها
    pos, taken = [], set()
    ends = [i + 1 for i, ch in enumerate(body) if ch in '.؟!']
    for k, m in enumerate(s['marks'], 1):
        want = int(len(body) * m['at'] / s['minMs'])
        free = [e for e in ends if e not in taken] or ends
        at = min(free, key=lambda i: abs(i - want)) if free else want
        taken.add(at); pos.append((at, k))
    for at, k in sorted(pos, reverse=True):
        body = body[:at] + ' **(%s)**' % ar(k) + body[at:]
    lines += ['---', '',
              '## المشهد %s — %s' % (ar(n), s.get('title', s['id'])),
              '**الطول المرجوّ: %s ثانية**' % ar(round(s['minMs']/1000)), '',
              '> ' + body.replace('. ', '.\n> '), '']
    for k, m in enumerate(s['marks'], 1):
        lines.append('- (%s) %s %s' % (ar(k), AR.get(m['type'], m['type']), label(m)))
    lines.append('')

lines += ['---', '', '## كيف تسجّل', '',
 '- **ملفٌّ لكلّ مشهد** باسم `s01` … `s%02d`. الغلطُ في واحدٍ يُعاد وحده.' % len(SC),
 '- مسجّلُ الصوت في الهاتف يكفي. الصيغةُ لا تهمّ (m4a أو mp3 أو wav).',
 '- غرفةٌ هادئة، والهاتفُ على بُعد شبرٍ من الفم، بلا مروحةٍ ولا مكيّف.',
 '- ثانيةُ صمتٍ في أوّل التسجيل وثانيةٌ في آخره — تُقَصّان عند التركيب.',
 '- الإيقاعُ إيقاعُ محاضرةٍ لا إيقاعُ خبر: وقفةٌ قصيرةٌ عند كلّ نقطة.', '',
 '## ماذا يجري بعدها', '',
 'يُقاس طولُ كلّ ملفّ، ويُمَدُّ المشهدُ ليطابقه، وتُعاد قسمةُ مواضع القلم على الكلام',
 'فينزل الخطُّ مع الكلمة، ثمّ يُعاد التسجيلُ ويُركَّب الصوت. المخرَجُ فيديو واحدٌ بصوت الأستاذ مع الترجمة.', '']
open(OUT, 'w', encoding='utf-8').write('\n'.join(lines))
print('script:', os.path.basename(OUT), '| scenes:', len(SC), '| chars:', format(sum(len(x['text']) for x in SC), ','))
