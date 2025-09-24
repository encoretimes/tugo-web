import Link from 'next/link';
import React from 'react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center space-x-2 rounded-full p-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
