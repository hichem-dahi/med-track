import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'

export async function deletePatientImagesDb(
  db: PGliteWithLive | Transaction | undefined,
  ids: string[]
) {
  if (!db || ids.length === 0) return

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
  const query = `DELETE FROM patient_images WHERE id IN (${placeholders})`

  await db.query(query, ids)
}
