import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'

export async function deleteTreatmentDb(db: PGliteWithLive | Transaction | undefined, id: string) {
  if (!db) return

  const query = `DELETE FROM treatments WHERE id = $1`
  await db.query(query, [id])
}
