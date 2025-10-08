'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import {
  PhotoIcon,
  ChartBarIcon,
  FaceSmileIcon,
  UserIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';

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
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'FREE' | 'SUBSCRIBER_ONLY' | 'PPV'>(
    'FREE'
  );
  const [ppvPrice, setPpvPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await apiClient.post('/api/v1/posts', {
        contentText: content,
        postType: postType,
        ppvPrice: postType === 'PPV' && ppvPrice ? Number(ppvPrice) : null,
      });

      setContent('');
      setPostType('FREE');
      setPpvPrice('');
      onClose();
      onPostCreated?.();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('게시물 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setPostType('FREE');
      setPpvPrice('');
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
                } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    새 게시물 작성
                  </Dialog.Title>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? (
                        <ArrowsPointingInIcon className="h-6 w-6" />
                      ) : (
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isSubmitting}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
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
                      <textarea
                        className="w-full resize-none border-none bg-transparent p-2 text-black focus:ring-0"
                        placeholder="무슨 생각을 하고 계신가요?"
                        rows={isExpanded ? 10 : 4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                  </div>

                  {/* PostType & PPV Price Selection */}
                  <div className="mt-4 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      게시물 타입
                    </label>
                    <select
                      value={postType}
                      onChange={(e) =>
                        setPostType(
                          e.target.value as 'FREE' | 'SUBSCRIBER_ONLY' | 'PPV'
                        )
                      }
                      disabled={isSubmitting}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="FREE">무료 (모두 공개)</option>
                      <option value="SUBSCRIBER_ONLY">구독자 전용</option>
                      <option value="PPV">PPV (개별 결제)</option>
                    </select>

                    {postType === 'PPV' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PPV 가격 (원)
                        </label>
                        <input
                          type="number"
                          value={ppvPrice}
                          onChange={(e) => setPpvPrice(e.target.value)}
                          placeholder="예: 1000"
                          min="0"
                          disabled={isSubmitting}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-primary-500 hover:text-primary-700" disabled={isSubmitting}>
                        <PhotoIcon className="h-6 w-6" />
                      </button>
                      <button className="text-primary-500 hover:text-primary-700" disabled={isSubmitting}>
                        <ChartBarIcon className="h-6 w-6" />
                      </button>
                      <button className="text-primary-500 hover:text-primary-700" disabled={isSubmitting}>
                        <FaceSmileIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={!content.trim() || isSubmitting}
                      className="rounded-full bg-primary-600 px-4 py-2 font-bold text-white hover:bg-primary-700 disabled:opacity-50"
                    >
                      {isSubmitting ? '작성 중...' : '투고하기'}
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
