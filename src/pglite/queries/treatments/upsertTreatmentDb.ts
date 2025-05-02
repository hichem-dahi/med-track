import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { Treatment } from '@/models/models'

export async function upsertTreatmentDb(
  db: PGliteWithLive | Transaction | undefined,
  treatmentData: Treatment,
) {
  if (!db) return
  //REFACTOR
  treatmentData.date.setHours(12)

  const query = `
    INSERT INTO treatments (id, patient_id, description, date)
    VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4)
    ON CONFLICT (id)
    DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      description = EXCLUDED.description,
      date = EXCLUDED.date
  `

  await db.query(query, [
    treatmentData.id || null,
    treatmentData.patient_id,
    treatmentData.description,
    treatmentData.date,
  ])
}
