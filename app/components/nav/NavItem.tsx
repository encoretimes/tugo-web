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
        className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100"
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
