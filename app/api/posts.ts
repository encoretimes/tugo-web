import { Post, PostType } from '@/types/post';
import { PageResponse } from '@/types/pagination';
import { PollCreateData } from '@/types/poll';
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

  return apiClient.get<PageResponse<Post>>(`/api/v1/posts?${params.toString()}`);
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
