'use client';

import { useRooms } from '@/hooks/useNotes';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';
import type { RoomResponse } from '@/types/notes';
import { formatRoomListTime } from '@/lib/date-utils';

interface RoomListProps {
  selectedRoomId: number | null;
  onSelectRoom: (room: RoomResponse) => void;
}

export default function RoomList({
  selectedRoomId,
  onSelectRoom,
}: RoomListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rooms, isLoading, error } = useRooms();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-neutral-400">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">쪽지방 목록을 불러오지 못했습니다</p>
      </div>
    );
  }

  const filteredRooms = rooms?.filter((room) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      room.lastMessage.toLowerCase().includes(query) ||
      room.otherUser.username.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-full flex-col">
      {/* 검색 */}
      <div className="border-b border-gray-200 p-4 dark:border-neutral-800">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="쪽지 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-500"
          />
        </div>
      </div>

      {/* 쪽지방 목록 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectRoom(room)}
              className={`cursor-pointer border-b border-gray-200 p-4 transition hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800 ${
                selectedRoomId === room.roomId
                  ? 'bg-gray-100 dark:bg-neutral-800'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 프로필 이미지 */}
                {room.otherUser.profileImageUrl ? (
                  <Image
                    src={room.otherUser.profileImageUrl}
                    alt={room.otherUser.username}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-700">
                    <span className="text-lg font-medium text-gray-500 dark:text-neutral-300">
                      {room.otherUser.username[0]}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {room.otherUser.username}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-neutral-500">
                      {formatRoomListTime(room.lastMessageTimestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-gray-600 dark:text-neutral-400">
                      {room.isMyLastMessage && '나: '}
                      {room.lastMessage}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="ml-2 min-w-[20px] flex-shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-center text-xs text-white">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 pt-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
            </div>
            <p className="mb-1 font-medium text-gray-900 dark:text-neutral-100">
              {searchQuery ? '검색 결과가 없습니다' : '쪽지방이 없습니다'}
            </p>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {searchQuery
                ? '다른 검색어로 시도해보세요'
                : '크리에이터 프로필에서 쪽지를 보내보세요'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
