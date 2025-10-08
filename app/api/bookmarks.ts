import { Post } from '@/types/post';
import { apiClient } from '@/lib/api-client';

export interface ArchiveResponse {
  id: number;
  post: Post;
  createdAt: string;
}

export const getBookmarks = async (
  page = 0,
  size = 10
): Promise<{ content: Post[]; totalPages: number; totalElements: number }> => {
  const response = await apiClient.get<{
    content: ArchiveResponse[];
    totalPages: number;
    totalElements: number;
  }>(`/api/v1/archives?page=${page}&size=${size}`);

  return {
    content: response.content.map((archive) => archive.post),
    totalPages: response.totalPages,
    totalElements: response.totalElements,
  };
};

export const addBookmark = async (postId: number): Promise<void> => {
  await apiClient.post('/api/v1/archives', { postId });
};

export const removeBookmark = async (postId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/archives/${postId}`);
};
