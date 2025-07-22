import { Conversation } from '@/types/conversation';

export const getConversations = async (): Promise<Conversation[]> => {
    const res = await fetch('/api/conversations');
    if (!res.ok) {
        throw new Error('Failed to fetch conversations');
    }
    return res.json();
}