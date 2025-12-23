'use client';

import { useCallback } from 'react';
import { useNotesStore } from '@/store/notesStore';
import type { MessageResponse } from '@/types/notes';

export const useNotesWebSocket = () => {
  const connected = useNotesStore((state) => state.connected);
  const subscribeRoom = useNotesStore((state) => state.subscribeRoom);
  const unsubscribeRoom = useNotesStore((state) => state.unsubscribeRoom);
  const client = useNotesStore((state) => state.client);

  const subscribe = useCallback(
    (roomId: number, onMessage: (message: MessageResponse) => void) => {
      subscribeRoom(roomId, onMessage);
    },
    [subscribeRoom]
  );

  const unsubscribe = useCallback(
    (roomId: number) => {
      unsubscribeRoom(roomId);
    },
    [unsubscribeRoom]
  );

  const sendMessage = useCallback(
    (roomId: number, content: string) => {
      if (!client || !connected) {
        console.warn('⚠️ WebSocket이 연결되지 않았습니다');
        return;
      }

      if (!content.trim()) {
        console.warn('⚠️ 빈 메시지는 전송할 수 없습니다');
        return;
      }

      try {
        client.publish({
          destination: `/pub/rooms/${roomId}/messages`,
          body: JSON.stringify({ content: content.trim() }),
        });
        console.log('✅ 메시지 전송:', content);
      } catch (error) {
        console.error('❌ 메시지 전송 실패:', error);
      }
    },
    [client, connected]
  );

  return {
    connected,
    subscribe,
    unsubscribe,
    sendMessage,
  };
};
