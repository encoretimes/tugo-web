import { NextResponse } from 'next/server';
import points from '@/data/points.json';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(points);
}
