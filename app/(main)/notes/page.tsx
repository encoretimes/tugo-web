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
  const [selectedUserProfileImage, setSelectedUserProfileImage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (userIdParam) {
      setSelectedUserId(parseInt(userIdParam));
    }
  }, [userIdParam]);

  const handleSelectRoom = (room: RoomResponse) => {
    setSelectedRoomId(room.roomId);
    setSelectedUserId(room.otherUser.userId);
    setSelectedUserName(room.otherUser.username);
    setSelectedUserProfileImage(room.otherUser.profileImageUrl || null);
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setSelectedRoomId(null);
    setSelectedUserName(null);
    setSelectedUserProfileImage(null);
  };

  const isChatOpen = selectedUserId !== null;

  return (
    <div className="fixed inset-0 top-[50px] bottom-[70px] lg:top-0 lg:bottom-0 lg:left-16 xl:left-64 lg:right-0 flex text-black bg-white z-40">
      {/* 쪽지방 목록 */}
      <aside
        className={`${isChatOpen ? 'hidden' : 'w-full'} lg:block lg:w-1/3 border-r border-gray-200 flex flex-col bg-white`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">쪽지</h1>
        </div>
        <RoomList
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
        />
      </aside>

      {/* 채팅창 */}
      <main
        className={`${isChatOpen ? 'w-full' : 'hidden'} lg:block lg:flex-1 flex flex-col bg-white`}
      >
        {selectedUserId ? (
          <ChatRoom
            otherUserId={selectedUserId}
            otherUserName={selectedUserName || undefined}
            otherUserProfileImage={selectedUserProfileImage || undefined}
            onBack={handleBack}
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
