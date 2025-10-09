import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      DATABASE_URL_HOST: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'N/A',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'NOT SET',
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    };

    return NextResponse.json({
      message: 'Environment variables debug',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      variables: envVars,
      fullDatabaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...' || 'NOT SET'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}