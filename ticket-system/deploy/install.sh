#!/usr/bin/env bash
# تنصيبُ النظام على خادم لينكس (Ubuntu/Debian). يُشغَّل بصلاحيّة الجذر.
set -euo pipefail

APP_DIR=/opt/ticket-system
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "── تثبيتُ ما يلزم"
apt-get update -qq
apt-get install -y -qq python3 python3-venv python3-pip nginx

echo "── المستخدمُ والمجلّدات"
id -u ticket >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin ticket
mkdir -p "$APP_DIR"
rsync -a --exclude data --exclude .venv --exclude __pycache__ "$SRC_DIR"/ "$APP_DIR"/
mkdir -p "$APP_DIR/data"

echo "── البيئةُ الافتراضيّة"
python3 -m venv "$APP_DIR/.venv"
"$APP_DIR/.venv/bin/pip" install --quiet --upgrade pip
"$APP_DIR/.venv/bin/pip" install --quiet -r "$APP_DIR/requirements.txt"

echo "── مفتاحُ التوقيع"
if [ ! -f "$APP_DIR/.env" ]; then
  printf 'TK_SECRET=%s\n' "$(python3 -c 'import secrets;print(secrets.token_hex(32))')" > "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
fi

chown -R ticket:ticket "$APP_DIR"
chmod 750 "$APP_DIR/data"

echo "── الحسابات"
sudo -u ticket TK_DB="$APP_DIR/data/tickets.db" "$APP_DIR/.venv/bin/python" -m app.seed \
  --password="${TK_ADMIN_PW:-}" 2>/dev/null || \
  sudo -u ticket TK_DB="$APP_DIR/data/tickets.db" sh -c "cd $APP_DIR && .venv/bin/python -m app.seed"

echo "── الخدمة"
cp "$APP_DIR/deploy/ticket-system.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now ticket-system
sleep 2
systemctl --no-pager --lines=5 status ticket-system || true

cat <<'MSG'

تمّ. يبقى:
  ١ · نسخُ deploy/nginx.conf إلى /etc/nginx/sites-available وتعديلُ النطاق
  ٢ · شهادةُ TLS:  certbot --nginx -d النطاق
  ٣ · الجدارُ الناريّ: ufw allow 'Nginx Full' && ufw enable
  ٤ · تغييرُ كلمات المرور:  .venv/bin/python -m app.seed --password=...
MSG
