import { Notification } from '@/types/notification';
import { PageResponse } from '@/types/common';
import { apiClient } from '@/lib/api-client';

/**
 * 알림 목록 조회 (페이지네이션)
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지당 항목 수
 * @returns 알림 페이지 응답
 */
export const getNotifications = async (
  page = 0,
  size = 20
): Promise<PageResponse<Notification>> => {
  return apiClient.get<PageResponse<Notification>>(
    `/api/v1/notifications?page=${page}&size=${size}`
  );
};

/**
 * 읽지 않은 알림 개수 조회
 * @returns 읽지 않은 알림 개수
 */
export const getUnreadCount = async (): Promise<number> => {
  return apiClient.get<number>('/api/v1/notifications/unread-count');
};

/**
 * 알림을 읽음으로 표시
 * @param notificationId - 알림 ID
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  return apiClient.put<void>(
    `/api/v1/notifications/${notificationId}/read`,
    {}
  );
};

/**
 * 모든 알림을 읽음으로 표시
 * @returns 업데이트된 알림 개수
 */
export const markAllAsRead = async (): Promise<number> => {
  return apiClient.put<number>('/api/v1/notifications/read-all', {});
};

/**
 * 알림 삭제
 * @param notificationId - 알림 ID
 */
export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/notifications/${notificationId}`);
};
