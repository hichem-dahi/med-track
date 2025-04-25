import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { Appointment } from '@/models/models'

export async function upsertAppointment(
  db: PGliteWithLive | Transaction | undefined,
  appointmentData: Appointment,
) {
  if (!db) return

  const query = `
    INSERT INTO appointments (id, patient_id, description, start_time, end_time)
    VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5)
    ON CONFLICT (id)
    DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time
  `

  await db.query(query, [
    appointmentData.id || null,
    appointmentData.patient_id,
    appointmentData.description,
    appointmentData.start_time,
    appointmentData.end_time,
  ])
}
