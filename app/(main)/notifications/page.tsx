'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/useNotifications';
import { Notification, NotificationType } from '@/types/notification';
import { formatRelativeTime } from '@/lib/date-utils';

const getNotificationLabel = (type: NotificationType): string => {
  switch (type) {
    case 'SUBSCRIPTION':
      return '구독';
    case 'LIKE':
      return '좋아요';
    case 'COMMENT':
      return '댓글';
    case 'MENTION':
      return '멘션';
    default:
      return '알림';
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
      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
        !isRead ? 'bg-gray-50' : ''
      }`}
    >
      {/* 읽지 않음 표시 - 왼쪽 라인 */}
      <div className={`w-0.5 h-full min-h-[40px] rounded-full flex-shrink-0 ${!isRead ? 'bg-primary-600' : 'bg-transparent'}`} />

      <div className="flex-grow min-w-0">
        {/* 알림 타입 라벨 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500 font-medium">
            {getNotificationLabel(type)}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        {/* 알림 내용 */}
        <p className={`text-sm leading-relaxed ${!isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {message}
        </p>
      </div>
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
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <p className="text-gray-500 text-sm">알림이 없습니다</p>
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
