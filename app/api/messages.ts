import { Message } from '@/types/message';

export const getMessages = async (
  conversationId: number
): Promise<Message[]> => {
  const res = await fetch(`/api/messages?conversationId=${conversationId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch messages');
  }
  return res.json();
};
