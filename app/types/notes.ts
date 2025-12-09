// Notes API 타입 정의

export interface MessageResponse {
  roomId: number;
  messageId: number;
  senderId: number;
  content: string;
  timestamp: string;
}

export interface RoomResponse {
  roomId: number;
  otherUser: NotesUser;
  lastMessage: string;
  isMyLastMessage: boolean;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface RoomWithMessageResponse {
  roomId: number;
  messages: MessageResponse[];
  nextCursor: number | null;
}

export interface SendMessageRequest {
  content: string;
}

export interface NotesUser {
  userId: number;
  username: string;
  profileImageUrl?: string;
}
