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
import type { UpdatePostRequest, FeedType } from '@/services/posts';
export type { FeedType } from '@/services/posts';
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

  const findPostInCache = (): Post | undefined => {
    const feedTypes: FeedType[] = ['recommended', 'following'];

    for (const feedType of feedTypes) {
      const infiniteData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', feedType]);

      if (infiniteData) {
        for (const page of infiniteData.pages) {
          const post = page.content.find((p) => p.postId === postId);
          if (post) return post;
        }
      }
    }

    return undefined;
  };

  const getCacheUpdatedAt = (): number | undefined => {
    const feedTypes: FeedType[] = ['recommended', 'following'];

    for (const feedType of feedTypes) {
      const infiniteData = queryClient.getQueryData<
        InfiniteData<PageResponse<Post>>
      >([...queryKeys.posts, 'infinite', feedType]);

      if (infiniteData) {
        return queryClient.getQueryState([
          ...queryKeys.posts,
          'infinite',
          feedType,
        ])?.dataUpdatedAt;
      }
    }

    return 0;
  };

  return useQuery({
    queryKey: [...queryKeys.posts, postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
    placeholderData: findPostInCache,
    initialData: findPostInCache,
    initialDataUpdatedAt: getCacheUpdatedAt,
  });
};

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
      addToast(
        error.message || '게시물 삭제에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });
};

/**
 * 무한 스크롤 게시물 조회 Hook
 * @param feedType - 피드 타입 (following: 구독 피드, recommended: 추천 피드)
 * @param pageSize - 페이지당 게시물 수
 */
export const useInfinitePosts = (
  feedType: FeedType = 'recommended',
  pageSize = 20
) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.posts, 'infinite', feedType],
    queryFn: ({ pageParam = 0 }) => getPostsPage(pageParam, pageSize, feedType),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
