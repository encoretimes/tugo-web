'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  PencilIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface PostMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthor: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare: () => void;
}

export default function PostMenuModal({
  isOpen,
  onClose,
  isAuthor,
  onEdit,
  onDelete,
  onShare,
}: PostMenuModalProps) {
  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  const handleShare = () => {
    onShare();
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
              <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-700">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-medium leading-6 text-gray-900 dark:text-neutral-100"
                  >
                    게시물 옵션
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-2">
                  {isAuthor && onEdit && (
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <PencilIcon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                      <span>수정하기</span>
                    </button>
                  )}

                  {isAuthor && onDelete && (
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span>삭제하기</span>
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <ArrowUpOnSquareIcon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                    <span>공유하기</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
