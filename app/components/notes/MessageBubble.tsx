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
        <div className="flex-shrink-0 mr-2 w-8">
          {isFirstInGroup ? (
            otherUserProfileImage ? (
              <Image
                src={otherUserProfileImage}
                alt={otherUserName || '프로필'}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-neutral-900"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-600 dark:to-neutral-700 flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                <span className="text-gray-600 dark:text-neutral-200 text-xs font-medium">
                  {(otherUserName || '?')[0]}
                </span>
              </div>
            )
          ) : null}
        </div>
      )}
      <div className="flex flex-col max-w-[70%]">
        {/* 상대방 이름 (그룹 첫 메시지에만 표시) */}
        {!isMyMessage && isFirstInGroup && otherUserName && (
          <span className="text-xs text-gray-500 dark:text-neutral-400 mb-1 ml-1 font-medium">
            {otherUserName}
          </span>
        )}
        <div
          className={`${getBubbleRounding()} px-3 py-2 ${
            isMyMessage
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20'
              : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 shadow-sm'
          } ${isPending ? 'opacity-70' : ''}`}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>
        {/* 시간 및 전송 상태 (그룹 마지막 메시지에만 표시) */}
        {isLastInGroup && (
          <div
            className={`flex items-center gap-1 mt-1 ${
              isMyMessage ? 'justify-end mr-1' : 'ml-1'
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
