import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationPreferences,
  updateNotificationPreference,
  initializeNotificationPreferences,
} from '@/api/notificationPreferences';
import { NotificationType } from '@/types/notification';

/**
 * 알림 설정 조회 훅
 */
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: getNotificationPreferences,
  });
};

/**
 * 알림 설정 업데이트 훅
 */
export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notificationType,
      enabled,
    }: {
      notificationType: NotificationType;
      enabled: boolean;
    }) => updateNotificationPreference(notificationType, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
};

/**
 * 알림 설정 초기화 훅
 */
export const useInitializeNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
};
