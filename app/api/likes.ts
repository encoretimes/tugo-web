import { apiClient } from '@/lib/api-client';

export interface LikePostRequest {
  postId: number;
}

/**
 * 게시물 좋아요
 */
export const likePost = async (data: LikePostRequest): Promise<void> => {
  return apiClient.post<void>('/api/v1/likes', data);
};

/**
 * 게시물 좋아요 취소
 */
export const unlikePost = async (postId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/likes/${postId}`);
};
