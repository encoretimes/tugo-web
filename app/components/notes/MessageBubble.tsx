'use client';

import type { MessageResponse } from '@/app/types/notes';

interface MessageBubbleProps {
  message: MessageResponse;
  isMyMessage: boolean;
}

export default function MessageBubble({
  message,
  isMyMessage,
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
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isMyMessage
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isMyMessage
              ? 'text-blue-100'
              : 'text-gray-500'
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
