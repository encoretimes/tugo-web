'use client';

import { useState } from 'react';
import {
  UserPlusIcon,
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

import notifications from '@/data/notifications.json';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'follow':
      return <UserPlusIcon className="h-8 w-8 text-blue-500" />;
    case 'like':
      return <HeartIcon className="h-8 w-8 text-red-500" />;
    case 'reply':
      return <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-green-500" />;
    case 'mention':
        return <AtSymbolIcon className="h-8 w-8 text-purple-500" />
    default:
      return null;
  }
};

const NotificationItem = ({ notification }: { notification: any }) => {
  const { type, user, postContent, time, read } = notification;

  const renderContent = () => {
    switch (type) {
      case 'follow':
        return (
          <p>
            <span className="font-bold">{user.name}</span>님이 회원님을 팔로우하기 시작했습니다.
          </p>
        );
      case 'like':
        return (
          <p>
            <span className="font-bold">{user.name}</span>님이 회원님의 게시물을 좋아합니다:
            <span className="text-gray-500 dark:text-gray-400 ml-2">"{postContent}"</span>
          </p>
        );
      case 'reply':
        return (
          <p>
            <span className="font-bold">{user.name}</span>님이 회원님의 게시물에 답글을 남겼습니다:
            <span className="text-gray-500 dark:text-gray-400 ml-2">"{postContent}"</span>
          </p>
        );
      case 'mention':
        return (
          <p>
            <span className="font-bold">{user.name}</span>님이 회원님을 멘션했습니다:
            <span className="text-gray-500 dark:text-gray-400 ml-2">"{postContent}"</span>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex gap-4 p-4 border-b border-gray-200 dark:border-gray-800 transition-colors ${
        !read ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50'
      }`}
    >
      <div className="flex-shrink-0 w-10">
        <NotificationIcon type={type} />
      </div>
      <div className="flex-grow">
        <Image
          src={user.profileImageUrl}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full mb-2"
        />
        <div className="text-gray-800 dark:text-gray-200">{renderContent()}</div>
        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">{time}</div>
      </div>
       {!read && <div className="h-3 w-3 rounded-full bg-blue-500 self-center flex-shrink-0"></div>}
    </div>
  );
};


const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
      if (activeTab === 'mentions') {
          return notification.type === 'mention';
      }
      return true;
  })

  return (
    <div className="text-black dark:text-white h-full">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold">알림</h1>
            <button className="text-sm text-blue-500 hover:underline">모두 읽음으로 표시</button>
        </div>
        <nav className="flex">
            <button onClick={() => setActiveTab('all')} className={`flex-1 p-4 font-bold text-center transition-colors ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900'}`}>
                전체
            </button>
            <button onClick={() => setActiveTab('mentions')} className={`flex-1 p-4 font-bold text-center transition-colors ${activeTab === 'mentions' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900'}`}>
                멘션
            </button>
        </nav>
      </header>
      <section>
        {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))
        ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-2xl font-bold">알림이 없습니다</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">다른 사람들과 소통을 시작하면 여기에 알림이 표시됩니다.</p>
            </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
