import { useQuery } from '@tanstack/react-query';
import { Conversation } from '@/types/conversation';

const getConversations = async (): Promise<Conversation[]> => {
    const res = await fetch('/api/conversations');
    if (!res.ok) {
        throw new Error('Failed to fetch conversations');
    }
    return res.json();
}

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
};
