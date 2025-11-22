'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import RoomList from '@/app/components/notes/RoomList';
import ChatRoom from '@/app/components/notes/ChatRoom';
import type { RoomResponse } from '@/app/types/notes';

export default function NotesPage() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    userIdParam ? parseInt(userIdParam) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  // URL 파라미터로 userId가 전달된 경우 자동으로 채팅창 열기
  useEffect(() => {
    if (userIdParam) {
      setSelectedUserId(parseInt(userIdParam));
    }
  }, [userIdParam]);

  const handleSelectRoom = (room: RoomResponse) => {
    setSelectedRoomId(room.roomId);
    setSelectedUserId(room.otherUser.id);
    setSelectedUserName(room.otherUser.name);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] lg:h-screen text-black">
      {/* 쪽지방 목록 */}
      <aside className="w-1/3 h-full border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">쪽지</h1>
        </div>
        <RoomList
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
        />
      </aside>

      {/* 채팅창 */}
      <main className="w-2/3 h-full flex flex-col bg-white">
        {selectedUserId ? (
          <ChatRoom
            otherUserId={selectedUserId}
            otherUserName={selectedUserName || undefined}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserIcon className="h-24 w-24" />
            <h2 className="mt-4 text-2xl font-bold">대화를 선택하세요</h2>
            <p className="mt-2">
              왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
