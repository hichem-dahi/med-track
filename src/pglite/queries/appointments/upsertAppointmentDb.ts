import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'
import type { Appointment } from '@/models/models'

export async function upsertAppointmentsDb(
  db: PGliteWithLive | Transaction | undefined,
  appointments: Appointment[],
) {
  if (!db || !appointments.length) return

  // Générer les blocs VALUES ($1, $2, ..., $n) dynamiquement
  const valuesPlaceholders = appointments
    .map((_, i) => {
      const offset = i * 7
      return `(
        COALESCE($${offset + 1}, gen_random_uuid()),
        $${offset + 2}, $${offset + 3}, $${offset + 4},
        $${offset + 5}, $${offset + 6}, $${offset + 7}
      )`
    })
    .join(',')

  const query = `
    INSERT INTO appointments (
      id, patient_id, description, start_time, end_time, checked, is_select_time
    )
    VALUES ${valuesPlaceholders}
    ON CONFLICT (id)
    DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      checked = EXCLUDED.checked,
      is_select_time = EXCLUDED.is_select_time
  `

  // Aplatir toutes les valeurs dans un seul tableau
  const values = appointments.flatMap((a) => [
    a.id || null,
    a.patient_id,
    a.description,
    a.start_time,
    a.end_time,
    a.checked,
    a.is_select_time,
  ])

  await db.query(query, values)
}
