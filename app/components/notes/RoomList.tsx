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
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-neutral-400">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
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
    <div className="flex flex-col h-full">
      {/* 검색 */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="쪽지 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* 쪽지방 목록 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectRoom(room)}
              className={`p-4 border-b border-gray-200 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition ${
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
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 dark:text-neutral-300 text-lg font-medium">
                      {room.otherUser.username[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-900 dark:text-neutral-100">
                      {room.otherUser.username}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-neutral-400">
                      {formatRoomListTime(room.lastMessageTimestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-neutral-400 truncate">
                      {room.isMyLastMessage && '나: '}
                      {room.lastMessage}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center ml-2 flex-shrink-0">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 pt-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
            </div>
            <p className="text-gray-900 dark:text-neutral-100 font-medium mb-1">
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
