'use client';

import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import type { MessageResponse } from '@/app/types/notes';

const WS_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30000';

interface NotesState {
  connected: boolean;
  totalUnreadCount: number;
  client: Client | null;
  subscriptions: Map<number, StompSubscription>;
  userSubscription: StompSubscription | null;
  roomMessageCallbacks: Map<number, (message: MessageResponse) => void>;
  globalMessageCallback: ((message: MessageResponse) => void) | null;
}

interface NotesActions {
  connect: (userId: number) => void;
  disconnect: () => void;
  subscribeRoom: (
    roomId: number,
    callback: (message: MessageResponse) => void
  ) => void;
  unsubscribeRoom: (roomId: number) => void;
  setTotalUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (amount: number) => void;
  setGlobalMessageCallback: (
    callback: ((message: MessageResponse) => void) | null
  ) => void;
}

type NotesStore = NotesState & NotesActions;

export const useNotesStore = create<NotesStore>((set, get) => ({
  connected: false,
  totalUnreadCount: 0,
  client: null,
  subscriptions: new Map(),
  userSubscription: null,
  roomMessageCallbacks: new Map(),
  globalMessageCallback: null,

  connect: (userId: number) => {
    const state = get();
    if (state.client && state.connected) {
      return;
    }

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
        set({ connected: true });

        const userSub = client.subscribe(
          `/sub/notes/user/${userId}`,
          (message) => {
            try {
              const data: MessageResponse = JSON.parse(message.body);
              console.log('📨 새 메시지 알림:', data);

              const currentState = get();
              currentState.incrementUnreadCount();

              if (currentState.globalMessageCallback) {
                currentState.globalMessageCallback(data);
              }
            } catch (error) {
              console.error('메시지 파싱 실패:', error);
            }
          }
        );
        set({ userSubscription: userSub });
        console.log(`✅ 사용자 ${userId} 알림 채널 구독`);
      },

      onDisconnect: () => {
        console.log('❌ WebSocket 연결 해제');
        set({ connected: false, userSubscription: null });
      },

      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame.headers['message']);
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const state = get();

    state.subscriptions.forEach((sub) => sub.unsubscribe());
    state.userSubscription?.unsubscribe();
    state.client?.deactivate();

    set({
      client: null,
      connected: false,
      subscriptions: new Map(),
      userSubscription: null,
      roomMessageCallbacks: new Map(),
    });
    console.log('✅ WebSocket 연결 종료');
  },

  subscribeRoom: (
    roomId: number,
    callback: (message: MessageResponse) => void
  ) => {
    const state = get();

    if (!state.client || !state.connected) {
      console.warn('⚠️ WebSocket이 연결되지 않았습니다');
      return;
    }

    if (state.subscriptions.has(roomId)) {
      const existingSub = state.subscriptions.get(roomId);
      existingSub?.unsubscribe();
      state.subscriptions.delete(roomId);
    }

    const subscription = state.client.subscribe(
      `/sub/notes/rooms/${roomId}`,
      (message) => {
        try {
          const data: MessageResponse = JSON.parse(message.body);
          console.log('📨 새 메시지 수신:', data);
          callback(data);
        } catch (error) {
          console.error('메시지 파싱 실패:', error);
        }
      }
    );

    const newSubscriptions = new Map(state.subscriptions);
    newSubscriptions.set(roomId, subscription);

    const newCallbacks = new Map(state.roomMessageCallbacks);
    newCallbacks.set(roomId, callback);

    set({
      subscriptions: newSubscriptions,
      roomMessageCallbacks: newCallbacks,
    });
    console.log(`✅ 방 ${roomId} 구독 시작`);
  },

  unsubscribeRoom: (roomId: number) => {
    const state = get();
    const subscription = state.subscriptions.get(roomId);

    if (subscription) {
      subscription.unsubscribe();

      const newSubscriptions = new Map(state.subscriptions);
      newSubscriptions.delete(roomId);

      const newCallbacks = new Map(state.roomMessageCallbacks);
      newCallbacks.delete(roomId);

      set({
        subscriptions: newSubscriptions,
        roomMessageCallbacks: newCallbacks,
      });
      console.log(`❌ 방 ${roomId} 구독 해제`);
    }
  },

  setTotalUnreadCount: (count: number) => {
    set({ totalUnreadCount: count });
  },

  incrementUnreadCount: () => {
    set((state) => ({ totalUnreadCount: state.totalUnreadCount + 1 }));
  },

  decrementUnreadCount: (amount: number) => {
    set((state) => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount - amount),
    }));
  },

  setGlobalMessageCallback: (callback) => {
    set({ globalMessageCallback: callback });
  },
}));
