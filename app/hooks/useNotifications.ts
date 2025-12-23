import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/services/notifications';

/**
 * 알림 목록 조회 (무한 스크롤)
 */
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 0 }) => getNotifications(pageParam, 20),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
    refetchInterval: 30000, // 30초 폴링
  });
};

/**
 * 읽지 않은 알림 개수 조회
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // 30초 폴링
  });
};

/**
 * 알림 읽음 처리 mutation
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 개수 업데이트
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });
};

/**
 * 모든 알림 읽음 처리 mutation
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 개수 업데이트
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });
};

/**
 * 알림 삭제 mutation
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // 알림 목록과 읽지 않은 개수 업데이트
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });
};
