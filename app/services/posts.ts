import { Post, PostType, PollCreateData } from '@/types/post';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<{ content: Post[] }>('/api/v1/posts');
  return response.content;
};

export const getPostsPage = async (
  page = 0,
  size = 20,
  subscriptionOnly = false
): Promise<PageResponse<Post>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: 'createdAt,desc',
  });

  if (subscriptionOnly) {
    params.append('subscriptionOnly', 'true');
  }

  return apiClient.get<PageResponse<Post>>(
    `/api/v1/posts?${params.toString()}`
  );
};

export const getPost = async (postId: number): Promise<Post> => {
  return apiClient.get<Post>(`/api/v1/posts/${postId}`);
};

export interface CreatePostRequest {
  contentText: string;
  postType: PostType;
  ppvPrice?: number;
  mediaUrls?: string[];
  pollData?: PollCreateData;
}

export interface UpdatePostRequest {
  contentText?: string;
  postType?: PostType;
  ppvPrice?: number;
  mediaUrls?: string[];
}

/**
 * 게시물 생성
 * @returns 생성된 게시물의 ID
 */
export const createPost = async (data: CreatePostRequest): Promise<number> => {
  return apiClient.post<number>('/api/v1/posts', data);
};

/**
 * 게시물 수정
 * @returns void (204 No Content)
 */
export const updatePost = async (
  postId: number,
  data: UpdatePostRequest
): Promise<void> => {
  return apiClient.put<void>(`/api/v1/posts/${postId}`, data);
};

/**
 * 게시물 삭제
 */
export const deletePost = async (postId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/posts/${postId}`);
};

export type DebateSortOption = 'popular' | 'latest' | 'ending';

/**
 * 투표 게시물 목록 조회 (투표 전용 API)
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @param sort 정렬 옵션 (popular: 참여자수, latest: 최신, ending: 마감임박)
 */
export const getDebatesPage = async (
  page = 0,
  size = 20,
  sort: DebateSortOption = 'popular'
): Promise<PageResponse<Post>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });

  return apiClient.get<PageResponse<Post>>(
    `/api/v1/posts/debates?${params.toString()}`
  );
};

/**
 * 추천 피드 조회 (인기도 기반)
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getRecommendedPostsPage = async (
  page = 0,
  size = 20
): Promise<PageResponse<Post>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiClient.get<PageResponse<Post>>(
    `/api/v1/posts/recommended?${params.toString()}`
  );
};

/**
 * 팔로잉 피드 조회 (구독한 크리에이터 게시물)
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getFollowingPostsPage = async (
  page = 0,
  size = 20
): Promise<PageResponse<Post>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiClient.get<PageResponse<Post>>(
    `/api/v1/posts/following?${params.toString()}`
  );
};
