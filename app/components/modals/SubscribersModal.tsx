'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMemberSubscribers } from '@/hooks/useSubscription';
import Image from 'next/image';
import Link from 'next/link';

interface SubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  memberName: string;
}

export default function SubscribersModal({
  isOpen,
  onClose,
  memberId,
  memberName,
}: SubscribersModalProps) {
  const { data, isLoading } = useMemberSubscribers(memberId, 0);

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <Dialog.Title className="text-lg font-semibold">
                    {memberName}의 구독자
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md p-1 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      로딩 중...
                    </div>
                  ) : data?.content && data.content.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {data.content.map((subscription) => (
                        <Link
                          key={subscription.id}
                          href={`/@${subscription.memberUsername || subscription.memberId}`}
                          className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                          onClick={onClose}
                        >
                          <div className="relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                            {subscription.memberProfileImageUrl ? (
                              <Image
                                src={subscription.memberProfileImageUrl}
                                alt={subscription.memberName || '프로필'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary-600 text-white font-bold text-lg">
                                {subscription.memberName?.[0] || '?'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">
                              {subscription.memberName ||
                                `구독자 #${subscription.memberId}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subscription.memberUsername &&
                                `@${subscription.memberUsername} · `}
                              {new Date(
                                subscription.createdAt
                              ).toLocaleDateString('ko-KR')}
                              에 구독
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      아직 구독자가 없습니다.
                    </div>
                  )}
                </div>

                {/* Footer */}
                {data && data.totalElements > 0 && (
                  <div className="border-t border-gray-200 px-6 py-3 text-center text-sm text-gray-500">
                    총 {data.totalElements.toLocaleString()}명의 구독자
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
