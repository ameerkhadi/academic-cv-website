#!/usr/bin/env node
/**
 * استيراد أسماء الطلبة من ملف نصي أو CSV.
 *   node scripts/import-students.mjs students.csv
 * كل سطر: الاسم الكامل[,الرقم الجامعي[,رمز تأكيد]]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from '../lib/db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) {
  console.error('الاستعمال: node scripts/import-students.mjs <ملف الأسماء>');
  process.exit(1);
}

const dataDir = process.env.DATA_DIR || path.join(here, '..', 'data');
const db = await initDb(dataDir);

const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const insert = db.prepare('INSERT INTO students(student_no, name, code, active, created_at) VALUES(?,?,?,1,?)');
const update = db.prepare('UPDATE students SET name = ?, code = ? WHERE id = ?');
const byNo = db.prepare("SELECT id FROM students WHERE student_no = ? AND student_no <> ''");
const byName = db.prepare('SELECT id FROM students WHERE name = ?');

const HEADERS = new Set(['name', 'الاسم', 'اسم الطالب', 'الاسم الكامل']);

let added = 0, updated = 0, skipped = 0, index = 0;
db.exec('BEGIN');
for (const line of lines) {
  const raw = line.trim();
  if (!raw) continue;
  const [name, studentNo = '', code = ''] = raw.split(/[,;\t]/).map((c) => c.trim());
  // سطر العناوين يُتخطّى إن كان أول سطر فعلي
  if (index++ === 0 && HEADERS.has(name.toLowerCase())) { skipped++; continue; }
  if (!name) { skipped++; continue; }
  const found = (studentNo && byNo.get(studentNo)) || byName.get(name);
  if (found) { update.run(name, code || null, found.id); updated++; }
  else { insert.run(studentNo || null, name, code || null, Date.now()); added++; }
}
db.exec('COMMIT');

const total = db.prepare('SELECT COUNT(*) AS n FROM students WHERE active = 1').get().n;
console.log(`أُضيف ${added}، وحُدّث ${updated}، وتُخطّي ${skipped}. مجموع الطلبة الفعّالين: ${total}`);
db.close();
