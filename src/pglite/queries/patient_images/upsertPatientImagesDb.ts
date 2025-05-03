import type { Transaction } from '@electric-sql/pglite'
import type { PGliteWithLive } from '@electric-sql/pglite/live'

import type { PatientImage } from '@/models/models'

export async function upsertPatientImagesDb(
  db: PGliteWithLive | Transaction | undefined,
  images: PatientImage[]
) {
  if (!db || images.length === 0) return

  const placeholders = images
    .map((_, i) => {
      const offset = i * 4
      return `(
        COALESCE($${offset + 1}, gen_random_uuid()),
        $${offset + 2},
        $${offset + 3},
        $${offset + 4}
      )`
    })
    .join(',\n')

  const query = `
    INSERT INTO patient_images (id, patient_id, image_url, description)
    VALUES
    ${placeholders}
    ON CONFLICT(id) DO UPDATE SET
      patient_id = EXCLUDED.patient_id,
      image_url = EXCLUDED.image_url,
      description = EXCLUDED.description
  `

  const values = images.flatMap(image => [
    image.id ?? null,
    image.patient_id,
    image.image_url,
    image.description ?? null
  ])

  await db.query(query, values)
}
