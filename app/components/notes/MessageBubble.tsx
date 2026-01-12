'use client';

import Image from 'next/image';
import type { MessageResponse } from '@/types/notes';

interface MessageBubbleProps {
  message: MessageResponse;
  isMyMessage: boolean;
  otherUserProfileImage?: string;
  otherUserName?: string;
}

export default function MessageBubble({
  message,
  isMyMessage,
  otherUserProfileImage,
  otherUserName,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
    >
      {/* 상대방 메시지일 때 프로필 이미지 */}
      {!isMyMessage && (
        <div className="flex-shrink-0 mr-2">
          {otherUserProfileImage ? (
            <Image
              src={otherUserProfileImage}
              alt={otherUserName || '프로필'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-neutral-300 text-xs font-medium">
                {(otherUserName || '?')[0]}
              </span>
            </div>
          )}
        </div>
      )}
      <div
        className={`max-w-[70%] rounded-md px-4 py-2 ${
          isMyMessage
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isMyMessage
              ? 'text-primary-200'
              : 'text-gray-500 dark:text-neutral-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
