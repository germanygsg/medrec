import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as patientsSchema from './schema/patients';
import * as treatmentsSchema from './schema/treatments';
import * as appointmentsSchema from './schema/appointments';
import * as invoicesSchema from './schema/invoices';
import * as appointmentTreatmentsSchema from './schema/appointmentTreatments';
import * as authSchema from './schema/auth';
import { logger } from '@/lib/logger';

const schema = {
  ...patientsSchema,
  ...treatmentsSchema,
  ...appointmentsSchema,
  ...invoicesSchema,
  ...appointmentTreatmentsSchema,
  ...authSchema,
};

// Connection pool configuration optimized for production
// Based on clinic usage: 22,764 invoices/10 years, 8-15 concurrent staff members
// Debug environment variables
console.log('Database connection setup:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_URL_HOST:', process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'N/A');
console.log('NODE_ENV:', process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 25 : 5, // Support 15 concurrent users × 2 connections each
  min: process.env.NODE_ENV === 'production' ? 2 : 0, // Keep minimum connections alive for faster response
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
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
export * from './schema/auth';