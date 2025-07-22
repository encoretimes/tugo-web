import { NextResponse } from 'next/server';
import notifications from '@/data/notifications.json';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(notifications);
}
