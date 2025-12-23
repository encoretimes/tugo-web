import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import {
  getPosts,
  getPost,
  getPostsPage,
  createPost,
  updatePost,
  deletePost,
} from '@/services/posts';
import type { UpdatePostRequest } from '@/services/posts';
import { Post } from '@/types/post';
import { PageResponse } from '@/types/common';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';
import { useToastStore } from '@/store/toastStore';

export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: getPosts,
  });
};

/**
 * 단일 게시물 조회 Hook
 * - 캐시 우선 전략: 피드에서 이미 로드된 게시물은 API 호출 없이 즉시 사용
 * - 캐시에 없는 경우에만 API 호출 (직접 URL 접근 시)
 */
export const usePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...queryKeys.posts, postId],
    queryFn: () => {
      console.log('[usePost] Fetching post from API:', postId);
      return getPost(postId);
    },
    enabled: !!postId,
    // 캐시에 데이터가 있으면 staleTime 동안 재요청하지 않음
    staleTime: 5 * 60 * 1000, // 5분
    // placeholderData를 사용하여 즉시 렌더링 (loading 상태 없음)
    placeholderData: () => {
      // 먼저 infinite query 캐시에서 찾기 (subscriptionOnly=false인 기본 피드)
      const infiniteData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', false]);

      if (infiniteData) {
        for (const page of infiniteData.pages) {
          const post = page.content.find((p) => p.postId === postId);
          if (post) {
            console.log('[usePost] Found in cache (infinite, false):', postId);
            return post;
          }
        }
      }

      // subscriptionOnly=true 캐시에서도 찾기
      const infiniteDataSub = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', true]);

      if (infiniteDataSub) {
        for (const page of infiniteDataSub.pages) {
          const post = page.content.find((p) => p.postId === postId);
          if (post) {
            console.log('[usePost] Found in cache (infinite, true):', postId);
            return post;
          }
        }
      }

      console.log('[usePost] Not found in cache:', postId);
      return undefined;
    },
    // initialData를 사용하여 캐시가 있으면 즉시 확정 (refetch 없음)
    initialData: () => {
      // 먼저 infinite query 캐시에서 찾기 (subscriptionOnly=false인 기본 피드)
      const infiniteData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', false]);

      if (infiniteData) {
        for (const page of infiniteData.pages) {
          const post = page.content.find((p) => p.postId === postId);
          if (post) {
            return post;
          }
        }
      }

      // subscriptionOnly=true 캐시에서도 찾기
      const infiniteDataSub = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', true]);

      if (infiniteDataSub) {
        for (const page of infiniteDataSub.pages) {
          const post = page.content.find((p) => p.postId === postId);
          if (post) {
            return post;
          }
        }
      }

      return undefined;
    },
    // initialData가 있으면 fresh 상태로 유지
    initialDataUpdatedAt: () => {
      const infiniteData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', false]);

      if (infiniteData) {
        return queryClient.getQueryState([
          ...queryKeys.posts,
          'infinite',
          false,
        ])?.dataUpdatedAt;
      }

      const infiniteDataSub = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', true]);

      if (infiniteDataSub) {
        return queryClient.getQueryState([...queryKeys.posts, 'infinite', true])
          ?.dataUpdatedAt;
      }

      return 0;
    },
  });
};

/**
 * 게시물 생성 Mutation Hook
 *
 * 기능:
 * - 게시물 생성 후 ID만 반환 (백엔드 API Spec 변경 대응)
 * - 성공 시 posts, bookmarks 캐시 무효화
 * - 성공/실패 Toast 표시
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 관련 쿼리 캐시 무효화
      invalidationHelpers.onPostMutation().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      addToast('게시물이 작성되었습니다', 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to create post:', error);
      addToast(
        error.message || '게시물 작성에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: UpdatePostRequest;
    }) => updatePost(postId, data),
    onMutate: async ({ postId, data }) => {
      await queryClient.cancelQueries({
        queryKey: [...queryKeys.posts, 'infinite'],
      });

      const previousData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite']);

      queryClient.setQueryData<InfiniteData<PageResponse<Post>>>(
        [...queryKeys.posts, 'infinite'],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((post) =>
                post.postId === postId
                  ? {
                      ...post,
                      ...data,
                      updatedAt: new Date().toISOString(),
                    }
                  : post
              ),
            })),
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      addToast('게시물이 수정되었습니다', 'success');
    },
    onError: (error: Error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [...queryKeys.posts, 'infinite'],
          context.previousData
        );
      }
      console.error('Failed to update post:', error);
      addToast(
        error.message || '게시물 수정에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
    onSettled: (_, __, variables) => {
      invalidationHelpers.onPostMutation().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.post(variables.postId),
      });
    },
  });
};

/**
 * 게시물 삭제 Mutation Hook
 *
 * 기능:
 * - 게시물 삭제 (Soft Delete)
 * - 성공 시 posts, bookmarks 캐시 무효화
 * - 성공/실패 Toast 표시
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 관련 쿼리 캐시 무효화
      invalidationHelpers.onPostMutation().forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      addToast('게시물이 삭제되었습니다', 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to delete post:', error);
      addToast(
        error.message || '게시물 삭제에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });
};

/**
 * 무한 스크롤 게시물 조회 Hook
 * @param subscriptionOnly - true일 경우 구독한 크리에이터의 게시물만 조회
 * @param pageSize - 페이지당 게시물 수
 */
export const useInfinitePosts = (subscriptionOnly = false, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.posts, 'infinite', subscriptionOnly],
    queryFn: ({ pageParam = 0 }) =>
      getPostsPage(pageParam, pageSize, subscriptionOnly),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
