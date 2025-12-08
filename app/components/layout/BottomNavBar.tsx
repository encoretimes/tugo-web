'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useNotesStore } from '@/store/notesStore';

const BottomNavBar = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const notesUnreadCount = useNotesStore((state) => state.totalUnreadCount);

  const profileHref = user?.username
    ? `/profile/${user.username}`
    : '/login';

  const navItems = [
    {
      href: '/',
      icon: '/system_ico/home.svg',
      activeIcon: '/system_ico/home_active.svg',
      label: '홈',
    },
    {
      href: '/explore',
      icon: '/system_ico/explore.svg',
      activeIcon: '/system_ico/explore_active.svg',
      label: '탐색',
    },
    {
      href: '/shortform',
      icon: '/system_ico/shortform.svg',
      activeIcon: '/system_ico/shortform_active.svg',
      label: '숏폼',
    },
    {
      href: '/notes',
      icon: '/system_ico/notes.svg',
      activeIcon: '/system_ico/note_active.svg',
      label: '쪽지',
      badge: notesUnreadCount,
    },
    {
      href: profileHref,
      icon: '/system_ico/profile.svg',
      activeIcon: '/system_ico/profile_active.svg',
      label: '프로필',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/profile/')) return pathname.startsWith('/profile/');
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 w-full bg-white lg:hidden z-50 py-3 border-t border-gray-100 rounded-t-2xl">
      <ul className="flex justify-center gap-8">
        {navItems.map(({ href, icon, activeIcon, label, badge }) => {
          const active = isActive(href);

          return (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center justify-center p-2 relative"
              >
                <Image
                  src={active ? activeIcon : icon}
                  alt={label}
                  width={32}
                  height={32}
                  className="w-8 h-8 transition-all duration-200"
                />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
