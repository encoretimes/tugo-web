'use client';

import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import type { MessageResponse } from '@/app/types/notes';

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30000';

export const useNotesWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<number, StompSubscription>>(new Map());

  useEffect(() => {
    const wsUrl = `${WS_BASE_URL}/ws-stomp`;
    const socket = new SockJS(wsUrl);

    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[STOMP]', str);
        }
      },

      onConnect: () => {
        console.log('✅ WebSocket 연결 성공');
        setConnected(true);
      },

      onDisconnect: () => {
        console.log('❌ WebSocket 연결 해제');
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame.headers['message']);
        console.error('상세:', frame.body);
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      // 모든 구독 해제
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();

      // WebSocket 연결 해제
      client.deactivate();
    };
  }, []);

  const subscribe = (
    roomId: number,
    onMessage: (message: MessageResponse) => void
  ) => {
    if (!clientRef.current || !connected) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return null;
    }

    // 이미 구독 중이면 기존 구독 반환
    if (subscriptionsRef.current.has(roomId)) {
      console.log(`이미 방 ${roomId}를 구독 중입니다`);
      return subscriptionsRef.current.get(roomId)!;
    }

    const subscription = clientRef.current.subscribe(
      `/sub/notes/rooms/${roomId}`,
      (message: IMessage) => {
        try {
          const data: MessageResponse = JSON.parse(message.body);
          console.log('📨 새 메시지 수신:', data);
          onMessage(data);
        } catch (error) {
          console.error('메시지 파싱 실패:', error);
        }
      }
    );

    subscriptionsRef.current.set(roomId, subscription);
    console.log(`✅ 방 ${roomId} 구독 시작`);

    return subscription;
  };

  const unsubscribe = (roomId: number) => {
    const subscription = subscriptionsRef.current.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(roomId);
      console.log(`❌ 방 ${roomId} 구독 해제`);
    }
  };

  const sendMessage = (roomId: number, content: string) => {
    if (!clientRef.current || !connected) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return;
    }

    if (!content.trim()) {
      console.warn('⚠️ 빈 메시지는 전송할 수 없습니다');
      return;
    }

    try {
      clientRef.current.publish({
        destination: `/pub/rooms/${roomId}/messages`,
        body: JSON.stringify({ content: content.trim() }),
      });
      console.log('✅ 메시지 전송:', content);
    } catch (error) {
      console.error('❌ 메시지 전송 실패:', error);
    }
  };

  return {
    connected,
    subscribe,
    unsubscribe,
    sendMessage,
  };
};
