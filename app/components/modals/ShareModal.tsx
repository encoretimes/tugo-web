'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useToastStore } from '@/store/toastStore';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  url: string;
}

export default function ShareModal({ isOpen, onClose, url }: ShareModalProps) {
  const { addToast } = useToastStore();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      addToast('링크가 클립보드에 복사되었습니다', 'success');
      onClose();
    } catch (error) {
      console.error('Failed to copy link:', error);
      addToast('링크 복사에 실패했습니다', 'error');
    }
  };

  const handleShareKakao = () => {
    // Kakao SDK 사용 (향후 구현 필요)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '투고 게시물 공유',
          description: '투고에서 공유된 게시물입니다.',
          imageUrl: 'https://via.placeholder.com/800x600', // 실제 이미지 URL로 대체
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      });
      onClose();
    } else {
      addToast('카카오톡 공유 기능을 사용할 수 없습니다', 'error');
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent('투고에서 공유된 게시물입니다.');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
      url
    )}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    onClose();
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-lg border border-gray-200 dark:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-100"
                  >
                    게시물 공유
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* 링크 URL 표시 및 복사 */}
                  <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-md border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mb-1">
                          게시물 링크
                        </p>
                        <p className="text-sm text-gray-900 dark:text-neutral-100 truncate">
                          {url}
                        </p>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4" />
                        복사
                      </button>
                    </div>
                  </div>

                  {/* 공유 옵션 버튼들 */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleShareKakao}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-yellow-400 hover:bg-yellow-500 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-yellow-500 rounded-full">
                        <span className="text-2xl">💬</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        카카오톡
                      </span>
                    </button>

                    <button
                      onClick={handleShareTwitter}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-sky-400 hover:bg-sky-500 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-sky-500 rounded-full">
                        <span className="text-2xl text-white">𝕏</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        트위터
                      </span>
                    </button>

                    <button
                      onClick={handleShareFacebook}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-700 rounded-full">
                        <span className="text-2xl text-white">f</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        페이스북
                      </span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-300 dark:bg-neutral-700 rounded-full">
                        <LinkIcon className="h-6 w-6 text-gray-700 dark:text-neutral-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                        링크 복사
                      </span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
