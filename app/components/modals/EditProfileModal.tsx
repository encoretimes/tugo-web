'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: number;
  currentPublicName: string;
  currentIntroduction?: string;
  currentProfileUrl?: string;
  currentBannerImageUrl?: string;
  onSuccess: () => void;
}

interface CreatorUpdateRequest {
  publicName: string;
  introduction?: string;
  profileUrl?: string;
  bannerImageUrl?: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  creatorId,
  currentPublicName,
  currentIntroduction,
  currentProfileUrl,
  currentBannerImageUrl,
  onSuccess,
}: EditProfileModalProps) {
  const [publicName, setPublicName] = useState(currentPublicName);
  const [introduction, setIntroduction] = useState(currentIntroduction || '');
  const [profileUrl, setProfileUrl] = useState(currentProfileUrl || '');
  const [bannerImageUrl, setBannerImageUrl] = useState(
    currentBannerImageUrl || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!publicName.trim()) {
      setError('공개 이름을 입력해주세요.');
      return;
    }

    // 공개 이름 유효성 검사
    if (!/^[a-zA-Z0-9_]+$/.test(publicName)) {
      setError('공개 이름은 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.');
      return;
    }

    if (publicName.length < 3 || publicName.length > 20) {
      setError('공개 이름은 3자 이상 20자 이하로 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const requestData: CreatorUpdateRequest = {
        publicName,
        introduction: introduction || undefined,
        profileUrl: profileUrl || undefined,
        bannerImageUrl: bannerImageUrl || undefined,
      };

      await apiClient.put(`/api/v1/creators/${creatorId}`, requestData);

      onSuccess();
      onClose();
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      const error = err as Error;
      if (error.message?.includes('이미 존재')) {
        setError('이미 사용 중인 공개 이름입니다. 다른 이름을 입력해주세요.');
      } else {
        setError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <Dialog.Title className="text-xl font-bold text-neutral-800">
                    프로필 수정
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="publicName"
                        className="block text-sm font-semibold text-neutral-700 mb-2"
                      >
                        공개 이름 (username){' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="publicName"
                        value={publicName}
                        onChange={(e) => setPublicName(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        disabled={isLoading}
                        maxLength={20}
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        3-20자, 영문, 숫자, 밑줄(_)만 사용 가능
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="introduction"
                        className="block text-sm font-semibold text-neutral-700 mb-2"
                      >
                        자기소개
                      </label>
                      <textarea
                        id="introduction"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                        disabled={isLoading}
                        maxLength={200}
                      />
                      <p className="mt-1 text-xs text-neutral-500 text-right">
                        {introduction.length}/200
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="profileUrl"
                        className="block text-sm font-semibold text-neutral-700 mb-2"
                      >
                        프로필 이미지 URL
                      </label>
                      <input
                        type="url"
                        id="profileUrl"
                        value={profileUrl}
                        onChange={(e) => setProfileUrl(e.target.value)}
                        placeholder="https://example.com/profile.jpg"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bannerImageUrl"
                        className="block text-sm font-semibold text-neutral-700 mb-2"
                      >
                        배너 이미지 URL
                      </label>
                      <input
                        type="url"
                        id="bannerImageUrl"
                        value={bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
                      disabled={isLoading}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '저장 중...' : '저장'}
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
