import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { Assessment } from '@/models/models'

export async function upsertAssessmentDb(
  db: PGliteWithLive | Transaction | undefined,
  assessmentData: Assessment,
) {
  if (!db) return

  const query = `
    INSERT INTO assessments (id, patient_id, description, date)
    VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4)
    ON CONFLICT (id)
    DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      description = EXCLUDED.description,
      date = EXCLUDED.date
  `

  await db.query(query, [
    assessmentData.id || null,
    assessmentData.patient_id,
    assessmentData.description,
    assessmentData.date,
  ])
}
