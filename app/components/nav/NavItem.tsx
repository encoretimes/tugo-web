'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center justify-center xl:justify-start space-x-2 rounded-full p-2 hover:bg-primary-50 hover:text-primary-700 transition-colors ${
          isActive ? 'font-bold text-primary-700' : ''
        }`}
      >
        <div className="relative">
          {React.cloneElement(
            icon as React.ReactElement<{ strokeWidth?: number }>,
            {
              strokeWidth: isActive ? 2 : 1.3,
            }
          )}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <span className="hidden xl:inline">{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
