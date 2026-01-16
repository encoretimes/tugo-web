'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useComposerStore } from '@/store/composerStore';
import { useUnreadCount } from '@/hooks/useNotifications';
import {
  HomeIcon,
  CompassIcon,
  PlusIcon,
  BellIcon,
  UserIcon,
} from '@/components/icons/NavIcons';
import { FC, ComponentType } from 'react';

interface IconProps {
  className?: string;
  filled?: boolean;
}

interface NavItemConfig {
  href: string;
  Icon: ComponentType<IconProps>;
  label: string;
  badge?: number;
  isWriteButton?: boolean;
}

const BottomNavBar: FC = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const { openComposer } = useComposerStore();
  const { data: unreadCount } = useUnreadCount();

  // 쪽지 페이지에서는 하단 네비게이션 숨김 (채팅 UI 공간 확보)
  if (pathname === '/notes') {
    return null;
  }

  const profileHref = user?.username ? `/@${user.username}` : '/login';
  const notificationBadge =
    unreadCount !== undefined && unreadCount > 0 ? unreadCount : undefined;

  const navItems: NavItemConfig[] = [
    {
      href: '/',
      Icon: HomeIcon,
      label: '홈',
    },
    {
      href: '/explore',
      Icon: CompassIcon,
      label: '탐색',
    },
    {
      href: '/compose',
      Icon: PlusIcon,
      label: '글쓰기',
      isWriteButton: true,
    },
    {
      href: '/notifications',
      Icon: BellIcon,
      label: '알림',
      badge: notificationBadge,
    },
    {
      href: profileHref,
      Icon: UserIcon,
      label: '프로필',
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/@')) return pathname.startsWith('/@');
    return pathname.startsWith(href);
  };

  const handleWriteClick = () => {
    if (!user) {
      openComposer();
      return;
    }
    openComposer();
  };

  return (
    <nav className="pb-safe relative z-50 flex-shrink-0 border-t border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
      <ul className="flex h-14 items-center justify-around">
        {navItems.map(({ href, Icon, label, badge, isWriteButton }) => {
          const active = isActive(href);

          if (isWriteButton) {
            return (
              <li key={label}>
                <button
                  onClick={handleWriteClick}
                  className="flex min-w-[56px] flex-col items-center justify-center py-2"
                  aria-label={label}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </button>
              </li>
            );
          }

          return (
            <li key={label}>
              <Link
                href={href}
                className={`flex min-w-[56px] flex-col items-center justify-center py-2 transition-colors ${
                  active
                    ? 'text-[var(--brand-primary)]'
                    : 'text-[var(--nav-icon-default)] hover:text-[var(--nav-icon-hover)]'
                }`}
                aria-label={label}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" filled={active} />
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
