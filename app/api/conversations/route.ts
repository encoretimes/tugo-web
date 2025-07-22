import { NextResponse } from 'next/server';
import conversations from '@/data/conversations.json';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  return NextResponse.json(conversations);
}
