import { Conversation } from '@/types/conversation';
import { apiClient } from '@/lib/api-client';

export const getConversations = async (): Promise<Conversation[]> => {
  return apiClient.get<Conversation[]>('/api/v1/conversations');
};
