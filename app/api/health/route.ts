import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      memory: 'unknown',
    },
    version: process.env.npm_package_version || '0.1.0',
  };

  try {
    // Database connectivity check
    const startDb = Date.now();
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - startDb;

    healthCheck.checks.database = dbLatency < 100 ? 'healthy' : 'slow';

    // Memory check
    const memUsage = process.memoryUsage();
    const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    healthCheck.checks.memory = memUsagePercent < 90 ? 'healthy' : 'high';

    // Overall status
    const allHealthy = Object.values(healthCheck.checks).every(
      (check) => check === 'healthy' || check === 'slow'
    );

    healthCheck.status = allHealthy ? 'healthy' : 'unhealthy';

    return NextResponse.json(healthCheck, {
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.checks.database = 'error';

    return NextResponse.json(
      {
        ...healthCheck,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
