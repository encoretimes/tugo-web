import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  usePosts,
  usePost,
  useCreatePost,
  useDeletePost,
  useInfinitePosts,
} from '../usePosts';

// Mock the posts service
jest.mock('@/services/posts', () => ({
  getPosts: jest.fn(),
  getPost: jest.fn(),
  getPostsPage: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}));

// Mock toast store
const mockAddToast = jest.fn();
jest.mock('@/store/toastStore', () => ({
  useToastStore: (
    selector: (state: { addToast: typeof mockAddToast }) => unknown
  ) =>
    selector
      ? selector({ addToast: mockAddToast })
      : { addToast: mockAddToast },
}));

import * as postsService from '@/services/posts';

// Mock data
const mockPost = {
  postId: 1,
  author: {
    name: '테스트 유저',
    username: 'testuser',
    profileImageUrl: null,
  },
  contentText: '테스트 게시물입니다.',
  postType: 'FREE' as const,
  ppvPrice: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  stats: {
    comments: 5,
    likes: 10,
  },
  mediaUrls: [],
  poll: undefined,
  isLiked: false,
  isSaved: false,
};

const mockPageResponse = {
  content: [mockPost],
  number: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

// QueryClient wrapper 생성
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe('usePosts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePosts (게시물 목록 조회)', () => {
    it('게시물 목록을 성공적으로 조회해야 함', async () => {
      (postsService.getPosts as jest.Mock).mockResolvedValue(mockPageResponse);

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      // 초기 상태: 로딩 중
      expect(result.current.isLoading).toBe(true);

      // 데이터 로드 완료 대기
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // 데이터 확인
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.content).toEqual([mockPost]);
    });

    it('에러 발생 시 에러 상태가 되어야 함', async () => {
      (postsService.getPosts as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('usePost (단일 게시물 조회)', () => {
    it('단일 게시물을 성공적으로 조회해야 함', async () => {
      (postsService.getPost as jest.Mock).mockResolvedValue(mockPost);

      const { result } = renderHook(() => usePost(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPost);
      expect(postsService.getPost).toHaveBeenCalledWith(1);
    });

    it('postId가 0이면 쿼리가 실행되지 않아야 함', () => {
      const { result } = renderHook(() => usePost(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(postsService.getPost).not.toHaveBeenCalled();
    });
  });

  describe('useCreatePost (게시물 생성)', () => {
    it('게시물 생성이 성공해야 함', async () => {
      const newPostId = { postId: 2 };
      (postsService.createPost as jest.Mock).mockResolvedValue(newPostId);

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          contentText: '새 게시물입니다',
          postType: 'FREE',
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsService.createPost).toHaveBeenCalledWith({
        contentText: '새 게시물입니다',
        postType: 'FREE',
      });
    });

    it('게시물 생성 실패 시 에러 상태가 되어야 함', async () => {
      (postsService.createPost as jest.Mock).mockRejectedValue(
        new Error('Creation failed')
      );

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          contentText: '새 게시물입니다',
          postType: 'FREE',
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeletePost (게시물 삭제)', () => {
    it('게시물 삭제가 성공해야 함', async () => {
      (postsService.deletePost as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeletePost(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsService.deletePost).toHaveBeenCalledWith(1);
    });
  });

  describe('useInfinitePosts (무한 스크롤)', () => {
    it('첫 페이지를 성공적으로 로드해야 함', async () => {
      (postsService.getPostsPage as jest.Mock).mockResolvedValue(
        mockPageResponse
      );

      const { result } = renderHook(() => useInfinitePosts(false, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0].content).toEqual([mockPost]);
    });

    it('hasNextPage가 올바르게 계산되어야 함', async () => {
      (postsService.getPostsPage as jest.Mock).mockResolvedValue({
        ...mockPageResponse,
        last: false,
      });

      const { result } = renderHook(() => useInfinitePosts(false, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('subscriptionOnly 파라미터가 올바르게 전달되어야 함', async () => {
      (postsService.getPostsPage as jest.Mock).mockResolvedValue(
        mockPageResponse
      );

      renderHook(() => useInfinitePosts(true, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(postsService.getPostsPage).toHaveBeenCalledWith(0, 10, true);
      });
    });
  });
});
