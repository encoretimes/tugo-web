'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useMessages, useMarkAsRead, useSendMessage } from '@/hooks/useNotes';
import { useNotesWebSocket } from '@/hooks/useNotesWebSocket';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import type { MessageResponse } from '@/types/notes';

interface ChatRoomProps {
  otherUserId: number;
  otherUserName?: string;
  otherUserProfileImage?: string;
  onBack?: () => void;
}

export default function ChatRoom({
  otherUserId,
  otherUserName,
  otherUserProfileImage,
  onBack,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roomIdRef = useRef<number | null>(null);
  const currentUser = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  // roomId를 ref로 동기화
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  // WebSocket 연결 (실시간 메시지 수신용)
  const { connected, subscribe, unsubscribe } = useNotesWebSocket();

  // REST API로 메시지 초기 로드
  const { data: messagesData, isLoading, error } = useMessages(otherUserId);

  const markAsReadMutation = useMarkAsRead();
  const sendMessageMutation = useSendMessage();

  // otherUserId가 변경되면 상태 리셋
  useEffect(() => {
    setMessages([]);
    setRoomId(null);
    setInputValue('');
  }, [otherUserId]);

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

  // WebSocket 메시지 수신 핸들러
  const handleWebSocketMessage = useCallback(
    (newMessage: MessageResponse) => {
      setMessages((prev) => {
        // 중복 메시지 방지
        const exists = prev.some(
          (msg) => msg.messageId === newMessage.messageId
        );
        if (exists) return prev;

        return [...prev, newMessage];
      });

      queryClient.invalidateQueries({ queryKey: ['notes', 'rooms'] });

      if (
        currentUser &&
        newMessage.senderId !== currentUser.id &&
        roomIdRef.current
      ) {
        markAsReadMutation.mutate(roomIdRef.current);
      }
    },
    [currentUser, queryClient, markAsReadMutation]
  );

  useEffect(() => {
    if (!connected || !roomId) return;

    subscribe(roomId, handleWebSocketMessage);

    return () => {
      if (roomId) {
        unsubscribe(roomId);
      }
    };
  }, [connected, roomId, subscribe, unsubscribe, handleWebSocketMessage]);

  // 자동 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // REST API로 메시지 전송
  const handleSend = async () => {
    if (!inputValue.trim() || !roomId || isSending) return;

    const content = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    // Optimistic UI: 임시 메시지 추가
    const tempId = Date.now();
    const optimisticMessage: MessageResponse = {
      roomId,
      messageId: tempId,
      senderId: currentUser?.id || 0,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const sentMessage = await sendMessageMutation.mutateAsync({
        roomId,
        content,
      });

      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg.messageId !== tempId);
        const alreadyExists = withoutTemp.some(
          (msg) => msg.messageId === sentMessage.messageId
        );
        if (alreadyExists) {
          return withoutTemp;
        }
        return [...withoutTemp, sentMessage];
      });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 실패 시 임시 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.messageId !== tempId));
      // 입력 복원
      setInputValue(content);
    } finally {
      setIsSending(false);
    }
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
        <div className="flex items-center gap-3">
          {/* 모바일 뒤로가기 버튼 */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-1 -ml-1 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
          )}
          {/* 프로필 이미지 */}
          {otherUserProfileImage ? (
            <Image
              src={otherUserProfileImage}
              alt={otherUserName || '프로필'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-medium">
                {(otherUserName || '?')[0]}
              </span>
            </div>
          )}
          <h2 className="font-bold text-gray-900">
            {otherUserName || `사용자 #${otherUserId}`}
          </h2>
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
              otherUserProfileImage={otherUserProfileImage}
              otherUserName={otherUserName}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              메시지가 없습니다. 대화를 시작해보세요!
            </p>
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
            disabled={!roomId || isSending}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !roomId || isSending}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition flex items-center gap-2"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </div>
      </div>
    </div>
  );
}
