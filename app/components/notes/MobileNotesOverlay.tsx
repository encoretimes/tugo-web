'use client';

import { useMobileNotesStore } from '@/store/mobileNotesStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import RoomList from './RoomList';
import ChatRoom from './ChatRoom';
import type { RoomResponse } from '@/types/notes';

export default function MobileNotesOverlay() {
  const {
    isOpen,
    currentView,
    isListExiting,
    isChatExiting,
    selectedChat,
    openChat,
    goBackFromChat,
    goBackFromList,
    finishChatExit,
    finishListExit,
  } = useMobileNotesStore();

  if (!isOpen) return null;

  const handleSelectRoom = (room: RoomResponse) => {
    openChat({
      userId: room.otherUser.userId,
      userName: room.otherUser.username,
      profileImage: room.otherUser.profileImageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* 목록 패널 */}
      <div
        className={`absolute inset-0 flex flex-col bg-white dark:bg-neutral-950 ${
          isListExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
        onAnimationEnd={() => isListExiting && finishListExit()}
      >
        {/* 헤더 */}
        <div className="pt-safe flex-shrink-0 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex h-14 items-center px-4">
            <button
              onClick={goBackFromList}
              className="-ml-1 mr-2 rounded-full p-1 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="뒤로가기"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-neutral-300" />
            </button>
            <h1 className="text-lg font-bold text-black dark:text-white">
              쪽지
            </h1>
          </div>
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-hidden">
          <RoomList selectedRoomId={null} onSelectRoom={handleSelectRoom} />
        </div>
      </div>

      {/* 채팅 패널 (목록 위에 오버레이) */}
      {(currentView === 'chat' || isChatExiting) && selectedChat && (
        <div
          className={`absolute inset-0 bg-white dark:bg-neutral-950 ${
            isChatExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}
          onAnimationEnd={() => isChatExiting && finishChatExit()}
        >
          <ChatRoom
            otherUserId={selectedChat.userId}
            otherUserName={selectedChat.userName}
            otherUserProfileImage={selectedChat.profileImage}
            onBack={goBackFromChat}
          />
        </div>
      )}
    </div>
  );
}
