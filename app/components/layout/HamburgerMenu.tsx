'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { useUserStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';
import {
  CloseIcon,
  BookmarkIcon,
  DocumentIcon,
  CommentIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
  LogoutIcon,
} from '@/components/icons/NavIcons';
import { apiClient, clearAuthData } from '@/lib/api-client';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { resolvedTheme, setMode } = useThemeStore();

  const isDarkMode = resolvedTheme === 'dark';

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {}

    clearAuthData();

    logout();
    onClose();
    router.push('/');
  };

  const handleThemeToggle = () => {
    setMode(isDarkMode ? 'light' : 'dark');
  };

  const menuItems = [
    {
      href: '/bookmarks',
      icon: BookmarkIcon,
      label: '북마크',
    },
    {
      href: user?.username ? `/@${user.username}/posts` : '/login',
      icon: DocumentIcon,
      label: '내 게시글',
    },
    {
      href: user?.username ? `/@${user.username}/comments` : '/login',
      icon: CommentIcon,
      label: '내 댓글',
    },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* 배경 오버레이 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* 메뉴 패널 */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[280px]">
                  <div className="flex h-full flex-col bg-white shadow-xl dark:bg-neutral-950">
                    {/* 헤더 */}
                    <div className="pt-safe flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
                      <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
                        메뉴
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="p-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        aria-label="메뉴 닫기"
                      >
                        <CloseIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* 메뉴 아이템 */}
                    <div className="flex-1 overflow-y-auto py-2">
                      {/* 네비게이션 링크 */}
                      <nav className="px-2">
                        {menuItems.map(({ href, icon: Icon, label }) => (
                          <Link
                            key={label}
                            href={href}
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-[var(--text-primary)] transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
                          >
                            <Icon className="h-5 w-5 text-[var(--text-secondary)]" />
                            <span className="font-medium">{label}</span>
                          </Link>
                        ))}
                      </nav>

                      {/* 구분선 */}
                      <div className="mx-4 my-2 border-t border-gray-100 dark:border-neutral-800" />

                      {/* 설정 및 테마 */}
                      <nav className="px-2">
                        <Link
                          href="/settings"
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-[var(--text-primary)] transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                          <SettingsIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                          <span className="font-medium">설정</span>
                        </Link>

                        <button
                          onClick={handleThemeToggle}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-[var(--text-primary)] transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
                        >
                          <div className="flex items-center gap-3">
                            {isDarkMode ? (
                              <SunIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                            ) : (
                              <MoonIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                            )}
                            <span className="font-medium">
                              {isDarkMode ? '라이트 모드' : '다크 모드'}
                            </span>
                          </div>
                          <div
                            className={`h-6 w-10 rounded-full transition-colors ${
                              isDarkMode
                                ? 'bg-[var(--brand-primary)]'
                                : 'bg-gray-300 dark:bg-neutral-600'
                            }`}
                          >
                            <div
                              className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                isDarkMode
                                  ? 'translate-x-[18px]'
                                  : 'translate-x-0.5'
                              }`}
                            />
                          </div>
                        </button>
                      </nav>

                      {/* 구분선 */}
                      <div className="mx-4 my-2 border-t border-gray-100 dark:border-neutral-800" />

                      {/* 로그아웃 */}
                      {user && (
                        <nav className="px-2">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogoutIcon className="h-5 w-5" />
                            <span className="font-medium">로그아웃</span>
                          </button>
                        </nav>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HamburgerMenu;
