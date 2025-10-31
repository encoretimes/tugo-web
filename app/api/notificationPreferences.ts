import { NotificationPreference, NotificationType } from '@/types/notification';
import { apiClient } from '@/lib/api-client';

/**
 * 알림 설정 조회
 * @returns 사용자의 모든 알림 설정
 */
export const getNotificationPreferences = async (): Promise<
  NotificationPreference[]
> => {
  return apiClient.get<NotificationPreference[]>(
    '/api/v1/notifications/preferences'
  );
};

/**
 * 알림 설정 업데이트
 * @param notificationType - 알림 타입
 * @param enabled - 활성화 여부
 * @returns 업데이트된 알림 설정
 */
export const updateNotificationPreference = async (
  notificationType: NotificationType,
  enabled: boolean
): Promise<NotificationPreference> => {
  return apiClient.put<NotificationPreference>(
    '/api/v1/notifications/preferences',
    { notificationType, enabled }
  );
};

/**
 * 기본 알림 설정 초기화
 * @returns 초기화된 알림 설정 목록
 */
export const initializeNotificationPreferences = async (): Promise<
  NotificationPreference[]
> => {
  return apiClient.post<NotificationPreference[]>(
    '/api/v1/notifications/preferences/initialize',
    {}
  );
};
