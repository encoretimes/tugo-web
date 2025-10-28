import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, deleteComment } from '@/api/comments';
import type { Comment } from '@/types/comment';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';

/**
 * 댓글 목록 조회 Hook
 */
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: createComment,
    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments(newCommentData.postId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        queryKeys.comments(newCommentData.postId)
      );

      if (user) {
        const optimisticComment: Comment = {
          id: Date.now(),
          author: {
            name: user.name,
            username: user.username || 'unknown',
            profileImageUrl: user.profileImageUrl || null,
          },
          content: newCommentData.content,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Comment[]>(
          queryKeys.comments(newCommentData.postId),
          (old) => [...(old || []), optimisticComment]
        );
      }

      return { previousComments };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          queryKeys.comments(variables.postId),
          context.previousComments
        );
      }
      console.error('Failed to create comment:', error);
      addToast(
        error.message || '댓글 작성에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
    onSettled: (_, __, variables) => {
      invalidationHelpers
        .onCommentMutation(variables.postId)
        .forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
    },
  });
};

/**
 * 댓글 삭제 Mutation Hook
 *
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (params: { commentId: number; postId: number }) =>
      deleteComment(params.commentId),
    onSuccess: (_, variables) => {
      // 관련 쿼리 캐시 무효화
      invalidationHelpers
        .onCommentMutation(variables.postId)
        .forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      addToast('댓글이 삭제되었습니다', 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to delete comment:', error);
      addToast(
        error.message || '댓글 삭제에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });
};
