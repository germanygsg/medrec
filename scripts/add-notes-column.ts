import 'dotenv/config';
import { Pool } from 'pg';

async function addNotesColumn() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding notes column to appointment_treatments table...');
    await client.query('ALTER TABLE "appointment_treatments" ADD COLUMN IF NOT EXISTS "notes" text;');

    console.log('✅ Successfully added notes column!');
    client.release();
  } catch (error) {
    console.error('❌ Error adding notes column:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addNotesColumn();
