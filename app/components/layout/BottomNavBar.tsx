'use client';

import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useUnreadCount } from '@/hooks/useNotifications';

const BottomNavBar = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const { data: unreadCount } = useUnreadCount();

  const profileHref = user?.username
    ? `/profile/${user.username}`
    : '/settings';

  const navItems = [
    { href: '/', icon: HomeIcon, label: '홈' },
    { href: '/search', icon: MagnifyingGlassIcon, label: '검색' },
    { href: '/compose/post', icon: PlusCircleIcon, label: '투고하기' },
    { href: '/notifications', icon: BellIcon, label: '알림' },
    { href: profileHref, icon: UserCircleIcon, label: '프로필' },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t bg-white lg:hidden">
      <ul className="flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isNotifications = href === '/notifications';
          const showBadge =
            isNotifications && unreadCount !== undefined && unreadCount > 0;

          return (
            <li key={href}>
              <Link href={href} className="flex flex-col items-center p-2">
                <div className="relative">
                  <Icon
                    className={`h-7 w-7 ${
                      pathname === href ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs ${pathname === href ? 'font-bold text-primary-600' : ''}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
