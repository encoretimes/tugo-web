'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useNotesStore } from '@/store/notesStore';
import { MailIcon, MenuIcon } from '@/components/icons/NavIcons';
import HamburgerMenu from '@/components/layout/HamburgerMenu';

const MainHeader = () => {
  const pathname = usePathname();
  const notesUnreadCount = useNotesStore((state) => state.totalUnreadCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isProfilePage = pathname.startsWith('/@');
  const showNotesBadge = notesUnreadCount > 0;

  return (
    <>
      <header className="relative flex-shrink-0 z-50 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 lg:hidden pt-safe">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Tugo"
              width={120}
              height={44}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-1">
            {isProfilePage ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center justify-center w-11 h-11 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="메뉴 열기"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            ) : (
              <Link
                href="/notes"
                className="flex items-center justify-center w-11 h-11 relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="쪽지"
              >
                <MailIcon className="w-6 h-6" />
                {showNotesBadge && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notesUnreadCount > 99 ? '99+' : notesUnreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MainHeader;
