import Link from 'next/link';
import React from 'react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, badge }) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center space-x-2 rounded-full p-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
      >
        <div className="relative">
          {icon}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
