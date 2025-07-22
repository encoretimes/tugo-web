import { NextResponse } from 'next/server';
import parties from '@/data/parties.json';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(parties);
}
