import { Comment, CreateCommentRequest } from '@/types/post';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

export const getComments = async (
  postId: number,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Comment>> => {
  return apiClient.get<PageResponse<Comment>>(
    `/api/v1/comments?postId=${postId}&page=${page}&size=${size}&sort=createdAt,asc`
  );
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
