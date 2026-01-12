'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProtectedRoute?: boolean;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  isProtectedRoute = false,
}: LoginPromptModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const getContent = () => {
    if (isProtectedRoute) {
      return {
        icon: (
          <svg
            className="h-10 w-10 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ),
        title: '로그인이 필요한 기능입니다',
        description:
          '이 기능을 사용하려면 로그인이 필요합니다.\n로그인하고 Tugo의 다양한 기능을 경험해보세요!',
        features: [
          '크리에이터 구독 및 후원',
          '메시지 및 알림 확인',
          '포인트 적립 및 관리',
        ],
        closeText: '돌아가기',
      };
    }

    return {
      icon: (
        <svg
          className="h-10 w-10 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: '더 많은 기능을 이용해보세요',
      description:
        '로그인하면 Tugo의 모든 기능을 제한 없이 이용하실 수 있습니다.',
      features: [
        '댓글 작성 및 좋아요',
        '정치인과 소통하기',
        '맞춤 콘텐츠 추천',
      ],
      closeText: '나중에 하기',
    };
  };

  const content = getContent();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {}} // 외부 클릭으로 닫히지 않도록
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-neutral-900 p-8 text-left align-middle shadow-lg border border-gray-200 dark:border-neutral-700 transition-all">
                <div className="relative text-center">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute right-0 top-0 rounded-lg p-2 text-neutral-400 dark:text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    aria-label="닫기"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Icon */}
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
                    {content.icon}
                  </div>

                  {/* Title */}
                  <Dialog.Title
                    as="h3"
                    className="mb-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100"
                  >
                    {content.title}
                  </Dialog.Title>

                  {/* Description */}
                  <p className="mb-6 whitespace-pre-line text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {content.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8 space-y-3 rounded-md bg-neutral-50 dark:bg-neutral-800 p-4 border border-gray-100 dark:border-neutral-700">
                    {content.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleLogin}
                      className="w-full rounded-md bg-primary-600 px-6 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      지금 로그인하기
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
