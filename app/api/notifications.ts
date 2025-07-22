import { Notification } from '@/types/notification';

const API_URL = '/api/notifications';

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
};
