import json, os, subprocess, imageio_ffmpeg
SC=os.environ.get('LV_WORK', '/tmp/lecture-video')
FF=imageio_ffmpeg.get_ffmpeg_exe()
times={t['id']:t['start'] for t in json.load(open(SC+'/times.json'))}
MARKS={'s01':[(6000,'mark1'),(11000,'mark2'),(16000,'note')],
       's02':[(3000,'u'),(9000,'box1'),(16000,'box2'),(22000,'note')],
       's03':[(4000,'u'),(13000,'circ'),(20000,'hl')]}
for sc,ms in MARKS.items():
    for at,name in ms:
        t=(times[sc]+at+3800)/1000.0
        out='%s/g_%s_%s.png'%(SC,sc,name)
        subprocess.run([FF,'-y','-ss','%.2f'%t,'-i',SC+'/lecture.mp4','-frames:v','1',out],
                       check=True,capture_output=True)
        print(name,sc,'%.1fs'%t,os.path.getsize(out))
