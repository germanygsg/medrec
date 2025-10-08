import type { Config } from 'drizzle-kit';

export default {
    out: './drizzle',
    schema: './db/schema/*',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/postgres',
    },
} satisfies Config;
