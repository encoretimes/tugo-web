'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import RoomList from '@/app/components/notes/RoomList';
import ChatRoom from '@/app/components/notes/ChatRoom';
import type { RoomResponse } from '@/types/notes';

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
    <div className="flex h-full text-black dark:text-neutral-100 bg-white dark:bg-neutral-950 -mx-0 lg:-mx-6 -mt-4">
      {/* 쪽지방 목록 */}
      <aside
        className={`${isChatOpen ? 'hidden' : 'w-full'} lg:block lg:w-80 xl:w-96 h-full border-r border-gray-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-950 flex-shrink-0`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
          <h1 className="text-xl font-bold dark:text-neutral-100">쪽지</h1>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <RoomList
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
        </div>
      </aside>

      {/* 채팅창 */}
      <main
        className={`${isChatOpen ? 'w-full' : 'hidden'} lg:block lg:flex-1 flex flex-col bg-white dark:bg-neutral-950 min-w-0`}
      >
        {selectedUserId ? (
          <ChatRoom
            otherUserId={selectedUserId}
            otherUserName={selectedUserName || undefined}
            otherUserProfileImage={selectedUserProfileImage || undefined}
            onBack={handleBack}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-neutral-400">
            <UserIcon className="h-20 w-20" />
            <h2 className="mt-4 text-xl font-bold dark:text-neutral-100">
              대화를 선택하세요
            </h2>
            <p className="mt-2 text-sm">
              왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
