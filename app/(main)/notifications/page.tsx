'use client';

import { Fragment, useRef, useEffect } from 'react';
import {
  UserPlusIcon,
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/useNotifications';
import { Notification, NotificationType } from '@/types/notification';
import { formatRelativeTime } from '@/lib/date-utils';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'SUBSCRIPTION':
      return <UserPlusIcon className="h-8 w-8 text-blue-500" />;
    case 'LIKE':
      return <HeartIcon className="h-8 w-8 text-red-500" />;
    case 'COMMENT':
      return (
        <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-green-500" />
      );
    case 'MENTION':
      return <AtSymbolIcon className="h-8 w-8 text-purple-500" />;
    default:
      return null;
  }
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { type, message, postId, isRead, createdAt, id } = notification;
  const markAsReadMutation = useMarkAsRead();

  const handleClick = () => {
    if (!isRead) {
      markAsReadMutation.mutate(id);
    }
  };

  const getLink = () => {
    if (postId) return `/post/${postId}`;
    return '#';
  };

  return (
    <Link
      href={getLink()}
      onClick={handleClick}
      className={`flex gap-4 p-4 border-b border-gray-200 transition-colors ${
        !isRead ? 'bg-primary-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex-shrink-0 w-10">
        <NotificationIcon type={type} />
      </div>
      <div className="flex-grow">
        <div className="text-gray-800">{message}</div>
        <div className="text-sm text-gray-400 mt-1">
          {formatRelativeTime(createdAt)}
        </div>
      </div>
      {!isRead && (
        <div className="h-3 w-3 rounded-full bg-primary-500 self-center flex-shrink-0"></div>
      )}
    </Link>
  );
};

const NotificationsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useNotifications();
  const markAllAsReadMutation = useMarkAllAsRead();
  const observerTarget = useRef<HTMLDivElement>(null);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allNotifications = data?.pages.flatMap((page) => page.content) ?? [];

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-8 text-center">알림을 불러오는 중...</div>;
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-500">
          알림을 불러오는 중 오류가 발생했습니다.
        </div>
      );
    }

    if (allNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold">알림이 없습니다</h2>
          <p className="text-gray-500 mt-2">
            다른 사람들과 소통을 시작하면 여기에 알림이 표시됩니다.
          </p>
        </div>
      );
    }

    return (
      <>
        {allNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        {isFetchingNextPage && (
          <div className="p-4 text-center text-gray-500">더 불러오는 중...</div>
        )}
        <div ref={observerTarget} className="h-4" />
      </>
    );
  };

  return (
    <div className="text-black h-full">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">알림</h1>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="text-sm text-primary-500 hover:underline disabled:opacity-50"
          >
            모두 읽음으로 표시
          </button>
        </div>
      </header>
      <section>{renderContent()}</section>
    </div>
  );
};

export default NotificationsPage;
