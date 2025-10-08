import { Message } from '@/types/message';
import { apiClient } from '@/lib/api-client';

export const getMessages = async (
  conversationId: number
): Promise<Message[]> => {
  return apiClient.get<Message[]>(
    `/api/v1/messages?conversationId=${conversationId}`
  );
};
