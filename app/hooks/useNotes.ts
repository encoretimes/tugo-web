'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, getMessagesWithUser, markAsRead } from '@/app/api/notes';

/**
 * 쪽지방 목록 조회 훅
 */
export function useRooms(page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ['notes', 'rooms', page, size],
    queryFn: () => getRooms(page, size),
  });
}

/**
 * 특정 사용자와의 메시지 조회 훅
 */
export function useMessages(
  otherUserId: number | null,
  cursor?: number,
  size: number = 30
) {
  return useQuery({
    queryKey: ['notes', 'messages', otherUserId, cursor, size],
    queryFn: () => getMessagesWithUser(otherUserId!, cursor, size),
    enabled: otherUserId !== null,
  });
}

/**
 * 메시지 읽음 처리 mutation 훅
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => markAsRead(roomId),
    onSuccess: () => {
      // 쪽지방 목록 다시 불러오기 (안읽은 메시지 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ['notes', 'rooms'] });
    },
  });
}
