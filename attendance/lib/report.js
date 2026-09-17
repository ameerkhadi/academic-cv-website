/** حساب حالة الحضور لكل جلسة وتقارير النِسَب. */

export const STATUS = { PRESENT: 'present', PARTIAL: 'partial', ABSENT: 'absent', EXCUSED: 'excused' };

export const STATUS_AR = {
  present: 'حاضر',
  partial: 'حاضر جزئياً',
  absent: 'غائب',
  excused: 'غياب بعذر'
};

/** يحوّل عدد التدقيقات المحضورة إلى حالة، حسب قاعدة الاحتساب المعتمدة. */
export function statusFromCounts(attended, totalChecks, rule) {
  if (!totalChecks) return STATUS.ABSENT;
  if (attended === 0) return STATUS.ABSENT;
  if (rule === 'any') return STATUS.PRESENT;
  return attended >= totalChecks ? STATUS.PRESENT : STATUS.PARTIAL;
}

export function sessionChecksCount(db, sessionId) {
  return db.prepare('SELECT COUNT(*) AS n FROM checks WHERE session_id = ?').get(sessionId).n;
}

/** صف لكل طالب في جلسة واحدة: عدد التدقيقات، الحالة، الرايات، التجاوز اليدوي. */
export function sessionRoster(db, sessionId, rule) {
  const total = sessionChecksCount(db, sessionId);
  const rows = db
    .prepare(
      `SELECT s.id, s.name, s.student_no,
              COUNT(m.id)                AS attended,
              MIN(m.ts)                  AS first_ts,
              GROUP_CONCAT(m.flags, ',') AS flags,
              MAX(m.late)                AS late,
              o.status                   AS override_status,
              o.note                     AS override_note,
              (SELECT COUNT(*) FROM devices d WHERE d.student_id = s.id AND d.revoked = 0) AS bound
         FROM students s
         LEFT JOIN marks m     ON m.student_id = s.id AND m.session_id = ?
         LEFT JOIN overrides o ON o.student_id = s.id AND o.session_id = ?
        WHERE s.active = 1
        GROUP BY s.id
        ORDER BY s.name COLLATE NOCASE`
    )
    .all(sessionId, sessionId);

  return rows.map((r) => {
    const computed = statusFromCounts(r.attended, total, rule);
    const flags = [...new Set(String(r.flags || '').split(',').filter(Boolean))];
    return {
      id: r.id,
      name: r.name,
      studentNo: r.student_no || '',
      attended: r.attended,
      totalChecks: total,
      firstAt: r.first_ts || null,
      flags,
      late: !!r.late,
      bound: !!r.bound,
      computed,
      status: r.override_status || computed,
      overridden: !!r.override_status,
      note: r.override_note || ''
    };
  });
}

/** نسبة الحضور لكل طالب في مادة واحدة (أو كل المواد عند تمرير null). */
export function subjectReport(db, subjectId, rule) {
  const sessions = subjectId
    ? db.prepare('SELECT id FROM sessions WHERE subject_id = ? ORDER BY date').all(subjectId)
    : db.prepare('SELECT id FROM sessions ORDER BY date').all();

  const students = db
    .prepare('SELECT id, name, student_no FROM students WHERE active = 1 ORDER BY name COLLATE NOCASE')
    .all();

  const tally = new Map(students.map((s) => [s.id, { ...s, present: 0, partial: 0, absent: 0, excused: 0 }]));

  for (const { id: sessionId } of sessions) {
    for (const row of sessionRoster(db, sessionId, rule)) {
      const t = tally.get(row.id);
      if (t) t[row.status] += 1;
    }
  }

  return {
    sessionCount: sessions.length,
    rows: [...tally.values()].map((t) => {
      const counted = t.present + t.partial + t.absent; // العذر لا يُحتسب ضمن المقام
      const credit = t.present + t.partial * 0.5;
      return { ...t, percent: counted ? Math.round((credit / counted) * 1000) / 10 : 0 };
    })
  };
}
