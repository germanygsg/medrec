import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as patientsSchema from './schema/patients';
import * as treatmentsSchema from './schema/treatments';
import * as appointmentsSchema from './schema/appointments';
import * as invoicesSchema from './schema/invoices';
import * as appointmentTreatmentsSchema from './schema/appointmentTreatments';
import { logger } from '@/lib/logger';

const schema = {
  ...patientsSchema,
  ...treatmentsSchema,
  ...appointmentsSchema,
  ...invoicesSchema,
  ...appointmentTreatmentsSchema,
};

// Connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established (increased for serverless)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Log pool errors
pool.on('error', (err) => {
  logger.error('Unexpected database pool error', err);
});

// Log successful connections in development
if (process.env.NODE_ENV === 'development') {
  pool.on('connect', () => {
    logger.debug('New database connection established');
  });
}

export const db = drizzle(pool, { schema });

export * from './schema/patients';
export * from './schema/treatments';
export * from './schema/appointments';
export * from './schema/invoices';
export * from './schema/appointmentTreatments';