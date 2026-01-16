'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useNotesStore } from '@/store/notesStore';
import { useMobileNotesStore } from '@/store/mobileNotesStore';
import { MailIcon, MenuIcon } from '@/components/icons/NavIcons';
import HamburgerMenu from '@/components/layout/HamburgerMenu';

const MainHeader = () => {
  const pathname = usePathname();
  const notesUnreadCount = useNotesStore((state) => state.totalUnreadCount);
  const openNotes = useMobileNotesStore((state) => state.openNotes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isProfilePage = pathname.startsWith('/@');
  const showNotesBadge = notesUnreadCount > 0;

  return (
    <>
      <header className="pt-safe relative z-50 flex-shrink-0 border-b border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
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
                className="flex h-11 w-11 items-center justify-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                aria-label="메뉴 열기"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={openNotes}
                className="relative flex h-11 w-11 items-center justify-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                aria-label="쪽지"
              >
                <MailIcon className="h-6 w-6" />
                {showNotesBadge && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notesUnreadCount > 99 ? '99+' : notesUnreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MainHeader;
