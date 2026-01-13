import { NextResponse } from 'next/server';
import { getClientApiUrl } from '@/app/config/env';

export async function GET() {
  return NextResponse.json({
    // CSR용 API URL 반환 (브라우저에서 접근 가능한 URL)
    apiUrl: getClientApiUrl(),
    runtimeEnv: process.env.RUNTIME_ENV || 'production',
  });
}
