import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from '@/services/bookmarks';
import { useToastStore } from '@/store/toastStore';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';

export const useBookmarks = (page = 0, size = 10) => {
  return useQuery({
    queryKey: queryKeys.bookmarks(page, size),
    queryFn: () => getBookmarks(page, size),
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const invalidateBookmarkQueries = (postId: number) => {
    invalidationHelpers.onBookmarkToggle().forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
  };

  const addMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (_data, postId) => {
      invalidateBookmarkQueries(postId);
      addToast('보관함에 저장되었습니다', 'success');
    },
    onError: () => {
      addToast('보관함 저장에 실패했습니다', 'error');
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: (_data, postId) => {
      invalidateBookmarkQueries(postId);
      addToast('보관함에서 제거되었습니다', 'info');
    },
    onError: () => {
      addToast('보관함 제거에 실패했습니다', 'error');
    },
  });

  const toggleBookmark = (postId: number, isSaved: boolean) => {
    if (isSaved) {
      removeMutation.mutate(postId);
    } else {
      addMutation.mutate(postId);
    }
  };

  return {
    toggleBookmark,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
};
