'use client';

import { useRooms } from '@/app/hooks/useNotes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { RoomResponse } from '@/app/types/notes';

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
        <p className="text-gray-500">로딩 중...</p>
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
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="쪽지 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 쪽지방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectRoom(room)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                selectedRoomId === room.roomId
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1">
                    {room.otherUser.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {room.isMyLastMessage && '나: '}
                    {room.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                  <span className="text-xs text-gray-500 mb-1">
                    {new Date(room.lastMessageTimestamp).toLocaleTimeString(
                      'ko-KR',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </span>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">쪽지방이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
