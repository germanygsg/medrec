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

// Connection pool configuration optimized for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 10 : 5, // Reduce connections in production for better resource management
  min: 2, // Keep minimum connections alive
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  // Enable statement timeout to prevent long-running queries
  statement_timeout: 10000, // 10 seconds timeout for queries
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