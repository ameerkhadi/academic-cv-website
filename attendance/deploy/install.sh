#!/usr/bin/env bash
# تنصيب سريع على خادم لينكس. شغّله بصلاحية root من داخل مجلد المشروع.
set -euo pipefail

APP_DIR=/opt/attendance
DATA_DIR=/var/lib/attendance
SERVICE_USER=attendance

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js غير منصّب. نصّب النسخة 22 أو أحدث ثم أعد التشغيل." >&2
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
NODE_MINOR=$(node -p "process.versions.node.split('.')[1]")
if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 5 ]; }; then
  echo "يلزم Node 22.5 أو أحدث (النسخة الحالية $(node -v))." >&2
  exit 1
fi

id -u "$SERVICE_USER" >/dev/null 2>&1 || useradd --system --home "$DATA_DIR" --shell /usr/sbin/nologin "$SERVICE_USER"

mkdir -p "$APP_DIR" "$DATA_DIR"
cp -r ./server.js ./package.json ./lib ./routes ./public ./scripts "$APP_DIR"/
chown -R "$SERVICE_USER":"$SERVICE_USER" "$APP_DIR" "$DATA_DIR"
chmod 750 "$DATA_DIR"

cp ./deploy/attendance.service /etc/systemd/system/attendance.service
systemctl daemon-reload
systemctl enable --now attendance

echo "تم التنصيب. الخدمة تعمل على 127.0.0.1:8787"
echo "كلمة مرور اللوحة: $(cat "$DATA_DIR/admin-password.txt" 2>/dev/null || echo 'مضبوطة عبر ADMIN_PASSWORD')"
echo "الخطوة التالية: اربط النفق بـ cloudflared حسب deploy/cloudflared-config.example.yml"
