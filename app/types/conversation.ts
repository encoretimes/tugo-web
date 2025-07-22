export interface Conversation {
  id: number;
  user: {
    name: string;
    profileImageUrl: string;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
}
