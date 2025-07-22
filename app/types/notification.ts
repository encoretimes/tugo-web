export interface Notification {
  id: number;
  type: 'follow' | 'like' | 'reply' | 'mention';
  user: {
    name: string;
    handle: string;
    profileImageUrl: string;
  };
  postContent?: string;
  time: string;
  read: boolean;
}
