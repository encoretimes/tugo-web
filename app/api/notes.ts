import { apiClient } from '@/app/lib/api-client';
import type { MessageResponse, RoomResponse, RoomWithMessageResponse } from '@/app/types/notes';

/**
 * 쪽지방 목록 조회
 * GET /api/v1/notes/rooms
 */
export async function getRooms(
  page: number = 0,
  size: number = 20
): Promise<RoomResponse[]> {
  return apiClient.get<RoomResponse[]>(
    `/api/v1/notes/rooms?page=${page}&size=${size}`
  );
}

/**
 * 특정 사용자와의 메시지 조회
 * GET /api/v1/notes/user/{otherUserId}/messages
 * 쪽지방이 없으면 자동으로 생성됨
 */
export async function getMessagesWithUser(
  otherUserId: number,
  cursor?: number,
  size: number = 30
): Promise<RoomWithMessageResponse> {
  const params = new URLSearchParams({ size: size.toString() });
  if (cursor !== undefined && cursor !== null) {
    params.append('cursor', cursor.toString());
  }

  return apiClient.get<RoomWithMessageResponse>(
    `/api/v1/notes/user/${otherUserId}/messages?${params.toString()}`
  );
}

/**
 * 메시지 전송 (REST API)
 * POST /api/v1/notes/rooms/{roomId}/messages
 */
export async function sendMessageRest(
  roomId: number,
  content: string
): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>(
    `/api/v1/notes/rooms/${roomId}/messages`,
    { content }
  );
}

/**
 * 메시지 읽음 처리
 * POST /api/v1/notes/rooms/{roomId}/read
 */
export async function markAsRead(roomId: number): Promise<void> {
  return apiClient.post<void>(`/api/v1/notes/rooms/${roomId}/read`);
}
