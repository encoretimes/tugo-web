'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUnreadCount } from '@/hooks/useNotifications';

const MainHeader = () => {
  const { data: unreadCount } = useUnreadCount();
  const showBadge = unreadCount !== undefined && unreadCount > 0;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 lg:hidden">
      {/* 모바일 헤더만 표시 */}
      <div className="flex items-center justify-between px-8 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="TUGO"
            width={64}
            height={26}
            className="h-6 w-auto dark:invert"
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="p-1 relative">
            <Image
              src="/system_ico/notification_black.svg"
              alt="알림"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            {showBadge && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
