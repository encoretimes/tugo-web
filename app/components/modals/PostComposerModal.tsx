'use client';

import { Dialog, Transition, Menu } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import {
  UserIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  LockOpenIcon,
  LockClosedIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { usePostComposer } from '@/hooks/usePostComposer';
import ImageEditor from './ImageEditor';
import MultiImageEditor from './MultiImageEditor';
import PollCreatorModal from './PollCreatorModal';
import MentionInput from '../feed/MentionInput';
import {
  ImagePreviewGrid,
  PollPreview,
  ComposerToolbar,
} from '@/components/composer';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function PostComposerModal({
  isOpen,
  onClose,
  onPostCreated,
}: PostComposerModalProps) {
  const { user } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const composer = usePostComposer({
    onSuccess: () => {
      setIsExpanded(false);
      onClose();
      onPostCreated?.();
    },
  });

  const handleClose = () => {
    if (!composer.isPending) {
      composer.resetForm();
      setIsExpanded(false);
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel
                className={`w-full ${
                  isExpanded ? 'max-w-3xl' : 'max-w-md'
                } transform overflow-visible rounded-lg bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-lg border border-gray-200 dark:border-neutral-700 transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    새 게시물 작성
                  </Dialog.Title>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {isExpanded ? (
                        <ArrowsPointingInIcon className="h-6 w-6" />
                      ) : (
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      disabled={composer.isPending}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      {user?.profileImageUrl ? (
                        <Image
                          src={user.profileImageUrl}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                          <UserIcon className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <MentionInput
                        value={composer.content}
                        onChange={composer.setContent}
                        placeholder="무슨 생각을 하고 계신가요?"
                        rows={isExpanded ? 10 : 4}
                        disabled={composer.isPending}
                        className="w-full resize-none border-none bg-transparent p-2 text-black dark:text-neutral-100 focus:ring-0"
                      />
                      <div className="flex justify-end px-2">
                        <span
                          className={`text-xs ${
                            composer.isOverLimit
                              ? 'text-red-500 font-semibold'
                              : composer.contentByteLength >
                                  composer.maxByteLength * 0.9
                                ? 'text-orange-500'
                                : 'text-gray-400'
                          }`}
                        >
                          {composer.contentByteLength.toLocaleString()} /{' '}
                          {composer.maxByteLength.toLocaleString()} 바이트
                          <span className="ml-2 text-gray-400">
                            ({composer.content.length.toLocaleString()}자)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Poll Preview */}
                  {composer.pollData && (
                    <PollPreview
                      pollData={composer.pollData}
                      onRemove={() => composer.handlePollButtonClick()}
                      variant="full"
                    />
                  )}

                  {/* Image Preview Grid */}
                  {composer.selectedImages.length > 0 && (
                    <div className="mt-4">
                      <ImagePreviewGrid
                        images={composer.selectedImages}
                        onEdit={composer.handleEditImage}
                        onRemove={composer.handleRemoveImage}
                        disabled={composer.isPending}
                        size="medium"
                      />
                    </div>
                  )}

                  {/* Bottom Toolbar */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-neutral-700 pt-4">
                    <ComposerToolbar
                      onImageSelect={composer.handleImageSelect}
                      onPollClick={composer.handlePollButtonClick}
                      onEmojiSelect={composer.handleEmojiSelect}
                      hasPoll={!!composer.pollData}
                      disabled={composer.isPending}
                    />

                    <div className="flex items-center gap-2">
                      {/* Post Type Dropdown Menu */}
                      <Menu as="div" className="relative">
                        <Menu.Button
                          disabled={composer.isPending}
                          className="flex items-center gap-2 rounded-md bg-white dark:bg-neutral-800 px-4 py-2.5 font-semibold text-gray-500 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {composer.postType === 'FREE' ? (
                            <>
                              <LockOpenIcon className="h-5 w-5" />
                              <span>모두 공개</span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon className="h-5 w-5" />
                              <span>구독자 전용</span>
                            </>
                          )}
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute bottom-full mb-2 left-0 w-48 origin-bottom-left rounded-lg bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-neutral-700 focus:outline-none z-10">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => composer.setPostType('FREE')}
                                    className={`${
                                      active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                                    } group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-900 dark:text-neutral-100`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LockOpenIcon className="h-5 w-5 text-gray-500" />
                                      <span>모두 공개</span>
                                    </div>
                                    {composer.postType === 'FREE' && (
                                      <CheckIcon className="h-5 w-5 text-primary-600" />
                                    )}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      composer.setPostType('SUBSCRIBER_ONLY')
                                    }
                                    className={`${
                                      active ? 'bg-gray-100 dark:bg-neutral-700' : ''
                                    } group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-900 dark:text-neutral-100`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                                      <span>구독자 전용</span>
                                    </div>
                                    {composer.postType === 'SUBSCRIBER_ONLY' && (
                                      <CheckIcon className="h-5 w-5 text-primary-600" />
                                    )}
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <button
                        onClick={composer.handleSubmit}
                        disabled={!composer.canSubmit}
                        className="rounded-md bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        {composer.isPending ? '작성 중...' : '투고하기'}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Image Editor Modal */}
        {composer.editingImageIndex !== null &&
          composer.selectedImages[composer.editingImageIndex] && (
            <ImageEditor
              isOpen={composer.editingImageIndex !== null}
              onClose={composer.handleImageEditorClose}
              imageFile={composer.selectedImages[composer.editingImageIndex]}
              onSave={composer.handleImageEditorSave}
            />
          )}

        <MultiImageEditor
          isOpen={composer.showMultiImageEditor}
          onClose={composer.handleImageEditCancel}
          imageFiles={composer.pendingImages}
          onSave={composer.handleImageEditComplete}
        />

        <PollCreatorModal
          isOpen={composer.showPollModal}
          onClose={composer.handlePollCancel}
          onPollCreate={composer.handlePollCreate}
          initialData={composer.pollData}
        />
      </Dialog>
    </Transition>
  );
}
