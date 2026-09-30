# -*- coding: utf-8 -*-
import json, pathlib, glob, os, shutil, subprocess, sys, time
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

SC  = os.environ.get('LV_WORK', '/tmp/lecture-video')
shutil.copyfile(os.path.join(SC, 'week3-presenter.html'),
                '/home/user/academic-cv-website/digital/week3-presenter.html')
URL = 'http://127.0.0.1:8777/digital/week3-presenter.html?autoplay=1'
REC = os.path.join(SC, 'rec')
os.makedirs(REC, exist_ok=True)
for f in glob.glob(os.path.join(REC, '*')):
    os.remove(f)

errs = []
with sync_playwright() as p:
    b = p.chromium.launch(
        executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        args=['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'])
    t_rec = time.time()                # لحظةُ بدء التسجيل — مرجعُ توقيت الترجمة
    c = b.new_context(viewport={'width': 1920, 'height': 1080},
                      device_scale_factor=1,
                      record_video_dir=REC,
                      record_video_size={'width': 1920, 'height': 1080})
    pg = c.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERROR: ' + str(e)))
    pg.goto(URL, wait_until='load')
    pg.wait_for_function('window.__presenterDone===true', timeout=0)
    times = pg.evaluate('window.__sceneTimes')
    cues  = pg.evaluate('window.__cues')
    audit = pg.evaluate('window.__audit')
    t0abs = pg.evaluate('window.__t0abs')
    pg.wait_for_timeout(1200)          # ذيلٌ قصيرٌ بعد آخر مشهد
    c.close(); b.close()

OFF = t0abs / 1000.0 - t_rec           # الفرقُ بين بدء التسجيل وبدء أوّل مشهد
TRIM = max(0.0, OFF - 0.6)             # قصُّ الشاشةِ الفارغة في المقدّمة
OFF -= TRIM
print('video lead-in: %.2fs | trimmed: %.2fs' % (OFF + TRIM, TRIM))

for name, data in (('times.json', times), ('cues.json', cues), ('audit.json', audit)):
    json.dump(data, open(os.path.join(SC, name), 'w'), ensure_ascii=False, indent=1)

print('scenes:', [(t['id'], round(t['start'] / 1000, 1)) for t in times])
print('page errors:', errs or 'none')
bad = [a for a in audit if not a['ok']]
print('marks: %d | outside safe area: %d' % (len(audit), len(bad)))
for a in bad:
    print('   ✗', a['scene'], a['type'], a['target'], 'top=%s bottom=%s lim=%s' % (a['top'], a['bottom'], a['lim']))

def ts(sec, sep=','):
    if sec < 0: sec = 0
    h, r = divmod(sec, 3600); m, s = divmod(r, 60)
    return '%02d:%02d:%02d%s%03d' % (h, m, int(s), sep, round((s - int(s)) * 1000))

with open(os.path.join(SC, 'captions.srt'), 'w', encoding='utf-8') as f:
    for n, c in enumerate(cues, 1):
        f.write('%d\n%s --> %s\n%s\n\n'
                % (n, ts(OFF + c['start'] / 1000), ts(OFF + c['end'] / 1000), c['text']))

TITLES = {'s01': 'لماذا لا تكفي الرقمنة', 's02': 'ثلاثُ آليّات لا رابعَ لها',
          's03': 'طلبُ الإجازة — قبل وبعد'}
with open(os.path.join(SC, 'chapters.txt'), 'w', encoding='utf-8') as f:
    for t in times:
        f.write('%s  %s\n' % (ts(OFF + t['start'] / 1000, '.')[3:8], TITLES.get(t['id'], t['id'])))
print('captions: %d cues | chapters: %d' % (len(cues), len(times)))

webm = glob.glob(os.path.join(REC, '*.webm'))
assert webm, 'no video recorded'
FF = imageio_ffmpeg.get_ffmpeg_exe()
out = os.path.join(SC, 'lecture.mp4')
subprocess.run([FF, '-y', '-ss', '%.3f' % TRIM, '-i', webm[0], '-c:v', 'libx264', '-crf', '20',
                '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '25', out],
               check=True, capture_output=True)
print('mp4:', out, format(os.path.getsize(out), ','), 'bytes')

dur = subprocess.run([FF, '-i', out], capture_output=True, text=True).stderr
for line in dur.splitlines():
    if 'Duration' in line or 'Stream #0:0' in line:
        print(' ', line.strip()[:110])
