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

const BottomNavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: HomeIcon, label: '홈' },
    { href: '/search', icon: MagnifyingGlassIcon, label: '검색' },
    { href: '/compose/post', icon: PlusCircleIcon, label: '투고하기' },
    { href: '/notifications', icon: BellIcon, label: '알림' },
    { href: '/account', icon: UserCircleIcon, label: '내 계정' },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t bg-white lg:hidden">
      <ul className="flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <Link href={href} className="flex flex-col items-center p-2">
              <Icon
                className={`h-7 w-7 ${
                  pathname === href ? 'text-primary-600' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs ${pathname === href ? 'font-bold text-primary-600' : ''}`}
              >
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
