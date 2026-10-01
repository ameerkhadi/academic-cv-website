# -*- coding: utf-8 -*-
"""لقطاتُ تحقّقٍ: إطارٌ بعد اكتمال كلّ علامةٍ لفحص موضعها.
    python3 frames.py <اسم mp4> [معرّفات مشاهد مفصولة بفواصل]"""
import json, os, subprocess, sys, imageio_ffmpeg
SC   = os.environ.get('LV_WORK', '/tmp/lecture-video')
MP4  = os.path.join(SC, sys.argv[1] if len(sys.argv) > 1 else 'lecture.mp4')
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
LAG  = float(os.environ.get('LV_LAG', '3.6'))   # مقدّمةُ الفيديو + زمنُ رسم العلامة
FF   = imageio_ffmpeg.get_ffmpeg_exe()
times = {t['id']: t['start'] for t in json.load(open(os.path.join(SC, 'times.json')))}
seen = {}
for a in json.load(open(os.path.join(SC, 'audit.json'))):
    if ONLY and a['scene'] not in ONLY: continue
    k = seen[a['scene']] = seen.get(a['scene'], 0) + 1
    t = (times[a['scene']] + a['sched']) / 1000.0 + LAG
    out = '%s/f_%s_%d_%s.png' % (SC, a['scene'], k, a['type'])
    subprocess.run([FF, '-y', '-ss', '%.2f' % t, '-i', MP4, '-frames:v', '1', out],
                   check=True, capture_output=True)
    print('%-4s %-9s %-14s %6.1fs  %s' % (a['scene'], a['type'], a['target'], t, os.path.basename(out)))
