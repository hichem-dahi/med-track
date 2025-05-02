import type { PGlite } from '@electric-sql/pglite'

import m1 from './migrations/init_db_schema.sql?raw'
import m2 from './migrations/add_appointments_table.sql?raw'
import m3 from './migrations/add_treatments_table.sql?raw'

const migrations = [
  { name: '01-create_tables', sql: m1 },
  { name: '02-add_appointements_table', sql: m2 },
  { name: '03-add_treatments_table', sql: m3 },
]

export async function migrate(pg: PGlite) {
  // Create migrations table in the new schema
  await pg.exec(`
    CREATE SCHEMA IF NOT EXISTS migrations_schema;
    CREATE TABLE IF NOT EXISTS migrations_schema.migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Get list of applied migrations from the new schema
  const result = await pg.exec(`
    SELECT name FROM migrations_schema.migrations ORDER BY id;
  `)
  const appliedMigrations = result[0].rows.map((row) => row.name)

  // Apply new migrations
  for (const migration of migrations) {
    if (!appliedMigrations.includes(migration.name)) {
      await pg.exec(migration.sql)
      await pg.query(
        `
        INSERT INTO migrations_schema.migrations (name)
        VALUES ($1);
        `,
        [migration.name],
      )
      console.log(`Applied migration: ${migration.name}`)
    }
  }
}
