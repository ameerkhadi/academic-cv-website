#!/usr/bin/env node
/**
 * تعبئة المواد الخمس مع جدول اليومين (يوم مادتان ويوم ثلاث مواد).
 * عدّل القائمة أدناه ثم شغّل: node scripts/seed-subjects.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from '../lib/db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const db = await initDb(process.env.DATA_DIR || path.join(here, '..', 'data'));

// dayOfWeek: 0=الأحد 1=الاثنين 2=الثلاثاء 3=الأربعاء 4=الخميس 5=الجمعة 6=السبت
const SUBJECTS = [
  { name: 'المادة الأولى',  day: 0, start: '09:00', end: '10:30' },
  { name: 'المادة الثانية', day: 0, start: '10:45', end: '12:15' },
  { name: 'المادة الثالثة', day: 2, start: '09:00', end: '10:30' },
  { name: 'المادة الرابعة', day: 2, start: '10:45', end: '12:15' },
  { name: 'المادة الخامسة', day: 2, start: '12:30', end: '14:00' }
];

const toMin = (t) => Number(t.split(':')[0]) * 60 + Number(t.split(':')[1]);
const exists = db.prepare('SELECT id FROM subjects WHERE name = ?');
const insert = db.prepare(
  'INSERT INTO subjects(name, code, day_of_week, start_min, end_min, sort, active) VALUES(?,?,?,?,?,?,1)'
);
const update = db.prepare('UPDATE subjects SET day_of_week = ?, start_min = ?, end_min = ? WHERE id = ?');

SUBJECTS.forEach((s, i) => {
  const found = exists.get(s.name);
  if (found) update.run(s.day, toMin(s.start), toMin(s.end), found.id);
  else insert.run(s.name, null, s.day, toMin(s.start), toMin(s.end), i);
});

console.log('المواد المسجّلة:');
for (const row of db.prepare('SELECT name, day_of_week, start_min, end_min FROM subjects ORDER BY day_of_week, start_min').all()) {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  console.log(` - ${row.name}: ${days[row.day_of_week]} ${hhmm(row.start_min)}–${hhmm(row.end_min)}`);
}
db.close();
