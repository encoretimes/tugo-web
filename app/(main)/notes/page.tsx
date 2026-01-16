'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import RoomList from '@/app/components/notes/RoomList';
import ChatRoom from '@/app/components/notes/ChatRoom';
import type { RoomResponse } from '@/types/notes';

export default function NotesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const handleGoBack = () => {
    router.back();
  };

  const isChatOpen = selectedUserId !== null;

  return (
    <div className="flex h-full text-black dark:text-neutral-100 bg-white dark:bg-neutral-950 lg:-mx-6 lg:-mt-4">
      {/* 모바일 헤더 - 쪽지 목록용 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 pt-safe">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleGoBack}
            className="p-1 -ml-1 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-neutral-300" />
          </button>
          <h1 className="text-lg font-bold">쪽지</h1>
        </div>
      </div>

      {/* 쪽지방 목록 */}
      <aside
        className={`${
          isChatOpen ? 'hidden' : 'w-full pt-14'
        } lg:block lg:pt-0 lg:w-80 xl:w-96 h-full border-r border-gray-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-950 flex-shrink-0`}
      >
        {/* PC용 헤더 */}
        <div className="hidden lg:block p-4 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
          <h1 className="text-xl font-bold dark:text-neutral-100">쪽지</h1>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <RoomList
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
        </div>
      </aside>

      {/* 채팅창 - 모바일에서 슬라이드 애니메이션 */}
      <main
        className={`${
          isChatOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        } fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto lg:flex-1 flex flex-col bg-white dark:bg-neutral-950 min-w-0 transition-all duration-300 ease-out`}
      >
        {selectedUserId ? (
          <ChatRoom
            otherUserId={selectedUserId}
            otherUserName={selectedUserName || undefined}
            otherUserProfileImage={selectedUserProfileImage || undefined}
            onBack={handleBack}
          />
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500 dark:text-neutral-400">
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
