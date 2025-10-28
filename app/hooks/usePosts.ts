import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import {
  getPosts,
  getPostsPage,
  createPost,
  updatePost,
  deletePost,
} from '@/api/posts';
import type { UpdatePostRequest } from '@/api/posts';
import { Post } from '@/types/post';
import { PageResponse } from '@/types/pagination';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';
import { useToastStore } from '@/store/toastStore';

export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: getPosts,
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

export const useInfinitePosts = (pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.posts, 'infinite'],
    queryFn: ({ pageParam = 0 }) => getPostsPage(pageParam, pageSize),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
