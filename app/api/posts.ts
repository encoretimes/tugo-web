import { Post } from '@/types/post';
import { apiClient } from '@/lib/api-client';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<{ content: Post[] }>('/api/v1/posts');
  return response.content;
};
