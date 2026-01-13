import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.API_URL || 'http://localhost:30000',
    runtimeEnv: process.env.RUNTIME_ENV || 'production',
  });
}
