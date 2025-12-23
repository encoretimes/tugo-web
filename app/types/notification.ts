// Notification Types
export type NotificationType = 'LIKE' | 'COMMENT' | 'MENTION' | 'SUBSCRIPTION';

export type NotificationMethod = 'WEB' | 'EMAIL';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  actorId: number | null;
  postId: number | null;
  commentId: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  id: number;
  notificationType: NotificationType;
  enabled: boolean;
  method: NotificationMethod;
}

// Point Types
export interface Point {
  id: number;
  type: 'earn' | 'spend';
  description: string;
  amount: number;
  date: string;
}
