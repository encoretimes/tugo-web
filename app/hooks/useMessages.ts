import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@/api/messages';

export const useMessages = (conversationId: number | null) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => {
      if (conversationId === null) {
        return Promise.resolve([]);
      }
      return getMessages(conversationId);
    },
    enabled: conversationId !== null, // Only run query if conversationId is not null
  });
};
