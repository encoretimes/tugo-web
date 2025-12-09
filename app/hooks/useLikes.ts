import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost, unlikePost } from '@/api/likes';
import { queryKeys } from '@/lib/query-keys';
import { useToastStore } from '@/store/toastStore';

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.post(variables.postId),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to like post:', error);
      addToast(
        error.message || '좋아요 처리에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
    onError: (error: Error) => {
      console.error('Failed to unlike post:', error);
      addToast(
        error.message || '좋아요 취소에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });

  return {
    likeMutation,
    unlikeMutation,
  };
};
