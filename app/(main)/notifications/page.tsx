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
      className={`flex items-start gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800 ${
        !isRead ? 'bg-gray-50 dark:bg-neutral-900' : ''
      }`}
    >
      {/* 읽지 않음 표시 - 왼쪽 라인 */}
      <div
        className={`h-full min-h-[40px] w-0.5 flex-shrink-0 rounded-full ${!isRead ? 'bg-primary-600' : 'bg-transparent'}`}
      />

      <div className="min-w-0 flex-grow">
        {/* 알림 타입 라벨 */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
            {getNotificationLabel(type)}
          </span>
          <span className="text-xs text-gray-400 dark:text-neutral-500">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        {/* 알림 내용 */}
        <p
          className={`text-sm leading-relaxed ${!isRead ? 'font-medium text-gray-900 dark:text-neutral-100' : 'text-gray-600 dark:text-neutral-400'}`}
        >
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
      return (
        <div className="p-8 text-center dark:text-neutral-400">
          알림을 불러오는 중...
        </div>
      );
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
        <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            알림이 없습니다
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
          <div className="p-4 text-center text-gray-500 dark:text-neutral-400">
            더 불러오는 중...
          </div>
        )}
        <div ref={observerTarget} className="h-4" />
      </>
    );
  };

  return (
    <div className="h-full text-black dark:text-neutral-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800">
          <h1 className="text-xl font-bold dark:text-neutral-100">알림</h1>
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
