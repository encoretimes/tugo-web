'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  initialContent: string;
  initialPostType: 'FREE' | 'SUBSCRIBER_ONLY' | 'PPV';
  initialPpvPrice: number | null;
  onPostUpdated?: () => void;
}

export default function EditPostModal({
  isOpen,
  onClose,
  postId,
  initialContent,
  initialPostType,
  initialPpvPrice,
  onPostUpdated,
}: EditPostModalProps) {
  const [content, setContent] = useState(initialContent);
  const [postType, setPostType] = useState<'FREE' | 'SUBSCRIBER_ONLY' | 'PPV'>(
    initialPostType
  );
  const [ppvPrice, setPpvPrice] = useState<string>(
    initialPpvPrice ? String(initialPpvPrice) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.put(`/api/v1/posts/${postId}`, {
        contentText: content,
        postType: postType,
        ppvPrice: postType === 'PPV' && ppvPrice ? Number(ppvPrice) : null,
      });

      if (onPostUpdated) {
        onPostUpdated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to update post:', err);
      setError('게시물 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent(initialContent);
      setPostType(initialPostType);
      setPpvPrice(initialPpvPrice ? String(initialPpvPrice) : '');
      setError('');
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-gray-900"
                  >
                    게시물 수정
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="무슨 일이 일어나고 있나요?"
                      className="w-full resize-none rounded-lg border border-neutral-300 p-3 text-base focus:border-primary-600 focus:outline-none min-h-[150px]"
                      disabled={isSubmitting}
                      maxLength={1000}
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-neutral-500">
                        {content.length}/1000
                      </span>
                      {error && (
                        <span className="text-sm text-red-600">{error}</span>
                      )}
                    </div>
                  </div>

                  {/* PostType & PPV Price Selection */}
                  <div className="mb-4 border-t pt-4">
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

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="rounded-full px-6 py-2 font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={!content.trim() || isSubmitting}
                      className="rounded-full bg-primary-600 px-6 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? '수정 중...' : '수정하기'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
