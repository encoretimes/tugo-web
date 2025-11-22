'use client';

import { useEffect, useState, useRef } from 'react';
import { useMessages, useMarkAsRead } from '@/app/hooks/useNotes';
import { useNotesWebSocket } from '@/app/hooks/useNotesWebSocket';
import { useUserStore } from '@/app/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import type { MessageResponse } from '@/app/types/notes';

interface ChatRoomProps {
  otherUserId: number;
  otherUserName?: string;
}

export default function ChatRoom({
  otherUserId,
  otherUserName,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [roomId, setRoomId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const { connected, subscribe, unsubscribe, sendMessage } =
    useNotesWebSocket();
  const {
    data: messagesData,
    isLoading,
    error,
  } = useMessages(otherUserId);
  const markAsReadMutation = useMarkAsRead();

  // 초기 메시지 로드
  useEffect(() => {
    if (messagesData) {
      setRoomId(messagesData.roomId);
      // 메시지를 오래된 순서로 정렬 (reverse)
      setMessages([...messagesData.messages].reverse());

      // 읽음 처리
      if (messagesData.roomId) {
        markAsReadMutation.mutate(messagesData.roomId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesData]);

  // WebSocket 구독
  useEffect(() => {
    if (!connected || !roomId) return;

    subscribe(roomId, (newMessage) => {
      setMessages((prev) => {
        // 중복 메시지 방지: messageId가 이미 존재하면 무시
        const exists = prev.some((msg) => msg.messageId === newMessage.messageId);
        if (exists) return prev;

        return [...prev, newMessage];
      });

      // 쪽지방 목록 업데이트 (마지막 메시지 갱신)
      queryClient.invalidateQueries({ queryKey: ['notes', 'rooms'] });

      // 상대방 메시지인 경우 읽음 처리
      if (currentUser && newMessage.senderId !== currentUser.id) {
        markAsReadMutation.mutate(roomId);
      }
    });

    return () => {
      if (roomId) {
        unsubscribe(roomId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, roomId, currentUser?.id]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !roomId) return;

    sendMessage(roomId, inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">메시지를 불러오지 못했습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">
              {otherUserName || `사용자 #${otherUserId}`}
            </h2>
            {connected ? (
              <p className="text-xs text-green-500">온라인</p>
            ) : (
              <p className="text-xs text-gray-500">연결 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.messageId}
              message={message}
              isMyMessage={currentUser?.id === message.senderId}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">메시지가 없습니다. 대화를 시작해보세요!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!connected || !roomId}
          />
          <button
            onClick={handleSend}
            disabled={!connected || !inputValue.trim() || !roomId}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition flex items-center gap-2"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </div>
        {!connected && (
          <p className="text-sm text-red-500 mt-2">
            WebSocket 연결 중... 메시지를 전송할 수 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
