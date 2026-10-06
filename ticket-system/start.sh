#!/usr/bin/env bash
# تشغيلٌ محلّيّ على لينكس أو ماك:  ./start.sh
set -euo pipefail
cd "$(dirname "$0")"

PY=$(command -v python3 || command -v python || true)
[ -n "$PY" ] || { echo "بايثون غير مثبّت."; exit 1; }

[ -d .venv ] || { echo "── تهيئةُ البيئة …"; "$PY" -m venv .venv; }
echo "── تثبيتُ المتطلّبات …"
.venv/bin/python -m pip install --quiet --upgrade pip
.venv/bin/python -m pip install --quiet -r requirements.txt

[ -f data/tickets.db ] || { echo "── بياناتُ العرض …"; .venv/bin/python -m app.seed --demo --password='Demo!2026'; }

cat <<'MSG'

  ─────────────────────────────────────────
    العنوان:  http://127.0.0.1:8000
    مدير:     manager     موظّف: tasjeel
    المرور:   Demo!2026
    للإيقاف:  Ctrl+C
  ─────────────────────────────────────────

MSG
exec .venv/bin/python run.py
