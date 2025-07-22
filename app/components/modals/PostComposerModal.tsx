'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  PhotoIcon,
  ChartBarIcon,
  FaceSmileIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostComposerModal({
  isOpen,
  onClose,
}: PostComposerModalProps) {
  const { user } = useUserStore();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    새 게시물 작성
                  </Dialog.Title>
                  <button onClick={onClose}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.name}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                          <UserIcon className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <textarea
                        className="w-full resize-none border-none p-2 focus:ring-0"
                        placeholder="무슨 생각을 하고 계신가요?"
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <PhotoIcon className="h-6 w-6" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <ChartBarIcon className="h-6 w-6" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaceSmileIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <button className="rounded-full bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-900">
                      투고하기
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
