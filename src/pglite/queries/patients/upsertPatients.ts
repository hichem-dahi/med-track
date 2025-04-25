import type {  Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { Patient } from '@/models/models'

export async function upsertPatient(db: PGliteWithLive | Transaction | undefined, patientData: Patient) {
  if(!db) return
  const query = `
    INSERT INTO patients (id, name, birthday, gender, phone, medical_history)
    VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6)
    ON CONFLICT (id)
    DO UPDATE SET
      name = EXCLUDED.name,
      birthday = EXCLUDED.birthday,
      gender = EXCLUDED.gender,
      phone = EXCLUDED.phone,
      medical_history = EXCLUDED.medical_history
  `

  await db.query(query, [
    patientData.id ?? null,
    patientData.name,
    patientData.birthday,
    patientData.gender,
    patientData.phone,
    patientData.medical_history,
  ])
}
