'use client';

import Image from 'next/image';
import type { MessageResponse } from '@/types/notes';

interface MessageBubbleProps {
  message: MessageResponse;
  isMyMessage: boolean;
  otherUserProfileImage?: string;
  otherUserName?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  isPending?: boolean;
}

export default function MessageBubble({
  message,
  isMyMessage,
  otherUserProfileImage,
  otherUserName,
  isFirstInGroup = true,
  isLastInGroup = true,
  isPending = false,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 그룹 내 간격 조정
  const marginBottom = isLastInGroup ? 'mb-2' : 'mb-0.5';

  // 말풍선 모서리 동적 설정 (그룹 위치에 따라)
  const getBubbleRounding = () => {
    if (isMyMessage) {
      // 내 메시지: 오른쪽 하단 모서리 조정
      if (isFirstInGroup && isLastInGroup) return 'rounded-2xl rounded-br-md';
      if (isFirstInGroup) return 'rounded-2xl rounded-br-md';
      if (isLastInGroup) return 'rounded-2xl rounded-tr-md rounded-br-md';
      return 'rounded-2xl rounded-tr-md rounded-br-md';
    } else {
      // 상대방 메시지: 왼쪽 하단 모서리 조정
      if (isFirstInGroup && isLastInGroup) return 'rounded-2xl rounded-bl-md';
      if (isFirstInGroup) return 'rounded-2xl rounded-bl-md';
      if (isLastInGroup) return 'rounded-2xl rounded-tl-md rounded-bl-md';
      return 'rounded-2xl rounded-tl-md rounded-bl-md';
    }
  };

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${marginBottom}`}
    >
      {/* 상대방 메시지일 때 프로필 이미지 (그룹 첫 메시지에만 표시) */}
      {!isMyMessage && (
        <div className="mr-2 w-8 flex-shrink-0">
          {isFirstInGroup ? (
            otherUserProfileImage ? (
              <Image
                src={otherUserProfileImage}
                alt={otherUserName || '프로필'}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-neutral-700">
                <span className="text-xs font-medium text-gray-600 dark:text-white">
                  {(otherUserName || '?')[0]}
                </span>
              </div>
            )
          ) : null}
        </div>
      )}
      <div className="flex max-w-[70%] flex-col">
        {/* 상대방 이름 (그룹 첫 메시지에만 표시) */}
        {!isMyMessage && isFirstInGroup && otherUserName && (
          <span className="mb-1 ml-1 text-xs font-medium text-gray-500 dark:text-neutral-400">
            {otherUserName}
          </span>
        )}
        <div
          className={`${getBubbleRounding()} px-3 py-2 ${
            isMyMessage
              ? 'bg-primary-600 text-white dark:bg-neutral-700'
              : 'bg-white text-gray-900 dark:bg-neutral-800 dark:text-white'
          } ${isPending ? 'opacity-70' : ''}`}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>
        {/* 시간 및 전송 상태 (그룹 마지막 메시지에만 표시) */}
        {isLastInGroup && (
          <div
            className={`mt-1 flex items-center gap-1 ${
              isMyMessage ? 'mr-1 justify-end' : 'ml-1'
            }`}
          >
            <span
              className={`text-[10px] ${
                isMyMessage
                  ? 'text-gray-400 dark:text-neutral-500'
                  : 'text-gray-400 dark:text-neutral-500'
              }`}
            >
              {formatTime(message.timestamp)}
            </span>
            {isMyMessage && (
              <span className="text-[10px] text-gray-400 dark:text-neutral-500">
                {isPending ? '전송 중...' : '✓'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
