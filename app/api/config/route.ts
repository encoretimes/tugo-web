import { NextResponse } from 'next/server';

/**
 * Runtime configuration API endpoint
 * Provides environment-specific config to the client
 */
export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.API_URL || 'http://localhost:30000',
  });
}
