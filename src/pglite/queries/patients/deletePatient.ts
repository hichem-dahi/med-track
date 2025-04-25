import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'

export async function deletePatient(
  db: PGliteWithLive | Transaction | undefined,
  id: string
) {
  if (!db) return

  const query = `DELETE FROM patients WHERE id = $1`
  await db.query(query, [id])
}
