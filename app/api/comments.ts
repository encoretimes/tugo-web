import { Comment, CreateCommentRequest } from '@/types/comment';
import { apiClient } from '@/lib/api-client';

/**
 * 댓글 목록 조회
 * @param postId 게시물 ID
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await apiClient.get<{ content: Comment[] }>(
    `/api/v1/comments?postId=${postId}`
  );
  return response.content;
};

/**
 * 댓글 생성
 */
export const createComment = async (
  data: CreateCommentRequest
): Promise<Comment> => {
  return apiClient.post<Comment>('/api/v1/comments', data);
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/comments/${commentId}`);
};
