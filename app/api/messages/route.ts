import { NextResponse } from 'next/server';
import messages from '@/data/messages.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const conversationMessages = messages[conversationId as keyof typeof messages] || [];
  
  return NextResponse.json(conversationMessages);
}
