#!/usr/bin/env bash
# اختبار شامل من الطرف إلى الطرف: يبني قاعدة مؤقتة، يشغّل الخادم،
# يحاكي 122 طالباً، ثم ينظّف كل شيء.
#   bash test/run.sh
set -euo pipefail

cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
PORT=${PORT:-8799}
trap 'kill "${SERVER_PID:-0}" 2>/dev/null || true; rm -rf "$TMP"' EXIT

# 122 اسماً تجريبياً
node -e '
const first=["أحمد","زينب","مصطفى","فاطمة","علي","نور","حسين","مريم","كرار","رقية","عمر","سجى","يوسف","هدى","حيدر","آية","محمد","دعاء","سيف","بتول"];
const mid=["علي","كريم","صباح","جواد","حسن","عباس","ماجد","سعد","رياض","فاضل"];
const last=["حسين","الجبوري","العبيدي","الخفاجي","الساعدي","التميمي","الزبيدي","الدليمي","الحسناوي","المالكي"];
let seed=7; const rnd=()=> (seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
const pick=a=>a[Math.floor(rnd()*a.length)];
const seen=new Set(); const out=[]; let no=12300;
while(out.length<122){const n=`${pick(first)} ${pick(mid)} ${pick(last)}`;if(seen.has(n))continue;seen.add(n);out.push(`${n},${++no}`);}
process.stdout.write("الاسم,الرقم الجامعي\n"+out.join("\n")+"\n");
' > "$TMP/students.csv"

export DATA_DIR="$TMP/data"
node --disable-warning=ExperimentalWarning scripts/seed-subjects.mjs > /dev/null
node --disable-warning=ExperimentalWarning scripts/import-students.mjs "$TMP/students.csv"

PORT="$PORT" HOST=127.0.0.1 SECURE_COOKIES=0 TRUST_PROXY=0 ADMIN_PASSWORD=test1234 \
  node --disable-warning=ExperimentalWarning server.js > "$TMP/server.log" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 0.25
done

BASE="http://127.0.0.1:$PORT" node test/e2e.mjs
