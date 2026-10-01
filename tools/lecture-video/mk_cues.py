# -*- coding: utf-8 -*-
"""ورقةُ التتبّع: لكلّ مشهدٍ توقيتُه ونصُّه، ولكلّ علامةِ قلمٍ توقيتُها والجملةُ المنطوقةُ عندها.
    python3 mk_cues.py <ملفّ البناء> <ملفّ المخرَج.md> <عنوان>"""
import json, os, sys

HERE  = os.path.dirname(os.path.abspath(__file__))
SC    = os.environ.get('LV_WORK', '/tmp/lecture-video')
BUILD = sys.argv[1] if len(sys.argv) > 1 else 'mk_ai_w4.py'
OUT   = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'ورقة-التتبّع.md')
TITLE = sys.argv[3] if len(sys.argv) > 3 else 'الأسبوع الرابع — المهارات في كلود'

src = open(os.path.join(HERE, BUILD), encoding='utf-8').read()
ns  = {'__file__': os.path.join(HERE, BUILD)}
exec(compile(src[:src.index('CHROME =')], BUILD, 'exec'), ns)
LABELS = ns.get('LABELS', {})

times = json.load(open(os.path.join(SC, 'times.json')))
cues  = json.load(open(os.path.join(SC, 'cues.json')))
audit = json.load(open(os.path.join(SC, 'audit.json')))
OFF   = float(os.environ.get('LV_OFF', '0.6'))        # مقدّمةُ الفيديو بعد القصّ

AR_D = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')
def mmss(sec):
    m, s = divmod(max(0, sec), 60)
    return ('%d:%02d' % (m, s)).translate(AR_D)
def kind(t):
    return {'underline':'خطٌّ تحت', 'circle':'دائرة حول', 'box':'مربّع حول',
            'highlight':'تظليل أصفر على', 'note':'خطُّ يد', 'arrow':'سهم',
            'strike':'شطب', 'check':'علامة صحّ'}.get(t, t)
def said_at(ms):
    """الكلماتُ التي تكون على اللسان في تلك اللحظة بعينها، والكلمةُ المقصودةُ بينها غليظة."""
    c = next((x for x in cues if x['start'] <= ms < x['end']), cues[-1] if cues else None)
    if not c: return ''
    w = c['text'].split()
    f = (ms - c['start']) / max(1, c['end'] - c['start'])
    i = min(len(w) - 1, max(0, int(f * len(w))))
    a, b = max(0, i - 3), min(len(w), i + 4)
    out = w[a:i] + ['**%s**' % w[i]] + w[i+1:b]
    return ('… ' if a else '') + ' '.join(out) + (' …' if b < len(w) else '')

L = ['# ورقةُ التتبّع — %s' % TITLE, '',
     'التوقيتاتُ من الفيديو نفسِه. والترجمةُ تظهر على الشاشة أثناء العرض،',
     'فهي الملقِّنُ: يُقرأ السطرُ الظاهرُ ساعةَ ظهوره، ولا حاجة إلى حفظٍ ولا إلى عدّ.', '',
     '**عند نزول القلم لا يُقال شيءٌ زائد.** القلمُ موقَّتٌ ليقع على الكلمة المنطوقة في تلك اللحظة،',
     'فالعبارةُ المذكورة في عمود «ما يُقال» هي ما يكون على اللسان حين يبدأ الرسم.', '']

for n, t in enumerate(times, 1):
    st = t['start'] / 1000.0 + OFF
    L += ['---', '', '## %s · المشهد %s — %s'
          % (mmss(st), str(n).translate(AR_D), t.get('title', t['id'])), '']
    L += ['> ' + t['text'].replace('. ', '.\n> '), '', '| التوقيت | القلم | ما يُقال عندها |', '|---|---|---|']
    for a in [x for x in audit if x['scene'] == t['id']]:
        at = t['start'] + a['sched']
        tgt = LABELS.get(a['target'].lstrip('#'), a['target'].lstrip('#'))
        L.append('| **%s** | %s «%s» | %s |' % (mmss(at/1000.0 + OFF), kind(a['type']), tgt, said_at(at)))
    L.append('')

L += ['---', '', '## الطريقة', '',
 '**١ ·** يُشغَّل الفيديو على الشاشة، ويُفتح مسجّلُ الصوت في الهاتف.',
 '**٢ ·** يُقرأ السطرُ الظاهرُ في شريط الترجمة ساعةَ ظهوره. والشريطُ يتغيّر وحده مع الإيقاع المطلوب.',
 '**٣ ·** عند نزول القلم لا يُزاد شيء — الكلمةُ المنطوقةُ حينها هي المؤشَّرُ عليها.',
 '**٤ ·** الوقفةُ القصيرة عند كلّ نقطةٍ تكفي؛ الإيقاعُ إيقاعُ محاضرةٍ لا إيقاعُ خبر.',
 '**٥ ·** يُرسَل الملفُّ الصوتيُّ واحدًا، ويُركَّب على الفيديو كما هو.', '',
 'والغلطُ أثناء التسجيل لا يقتضي إعادةً من أوّله: يُكمَل إلى آخره، ويُذكَر توقيتُ الموضع المعاد، فيُقَصّ.', '']

open(OUT, 'w', encoding='utf-8').write('\n'.join(L))
print('cue sheet:', os.path.basename(OUT), '| scenes:', len(times), '| marks:', len(audit))
