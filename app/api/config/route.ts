import { NextResponse } from 'next/server';

/**
 * Runtime configuration API endpoint
 * Provides environment-specific config to the client
 * 
 * Note: We use RUNTIME_ENV instead of NODE_ENV because Next.js
 * replaces NODE_ENV at build time. RUNTIME_ENV can be set at
 * container runtime to toggle between development/production features.
 */
export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.API_URL || 'http://localhost:30000',
    runtimeEnv: process.env.RUNTIME_ENV || 'production',
  });
}
