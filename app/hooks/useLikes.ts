import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost, unlikePost } from '@/api/likes';
import { queryKeys } from '@/lib/query-keys';
import { useToastStore } from '@/store/toastStore';

/**
 * 좋아요 토글 Mutation Hook
 *
 * 기능:
 * - 게시물 좋아요/취소
 * - 성공 시 posts 캐시 무효화 (낙관적 업데이트는 컴포넌트에서 처리)
 * - 실패 시 Toast 표시
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
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
