import { Comment, CreateCommentRequest } from '@/types/post';
import { apiClient } from '@/lib/api-client';

export interface CommentsPageResponse {
  content: Comment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

/**
 * 댓글 목록 조회 (페이지네이션)
 * @param postId 게시물 ID
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 */
export const getComments = async (
  postId: number,
  page: number = 0,
  size: number = 20
): Promise<CommentsPageResponse> => {
  return apiClient.get<CommentsPageResponse>(
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
