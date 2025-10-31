'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { uploadImage } from '@/api/media';
import { useToastStore } from '@/store/toastStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentIntroduction?: string;
  currentProfileUrl?: string;
  currentBannerImageUrl?: string;
  onSuccess: () => void;
}

interface ProfileUpdateRequest {
  name: string;
  introduction?: string;
  profileUrl?: string;
  bannerImageUrl?: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentIntroduction,
  currentProfileUrl,
  currentBannerImageUrl,
  onSuccess,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [introduction, setIntroduction] = useState(currentIntroduction || '');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToastStore();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      let finalProfileUrl = currentProfileUrl;
      let finalBannerUrl = currentBannerImageUrl;

      // Upload profile image if selected
      if (profileFile) {
        try {
          finalProfileUrl = await uploadImage(profileFile);
        } catch {
          setError('프로필 이미지 업로드에 실패했습니다.');
          setIsLoading(false);
          return;
        }
      }

      // Upload banner image if selected
      if (bannerFile) {
        try {
          finalBannerUrl = await uploadImage(bannerFile);
        } catch {
          setError('배너 이미지 업로드에 실패했습니다.');
          setIsLoading(false);
          return;
        }
      }

      const requestData: ProfileUpdateRequest = {
        name: name.trim(),
        introduction: introduction.trim() || undefined,
        profileUrl: finalProfileUrl || undefined,
        bannerImageUrl: finalBannerUrl || undefined,
      };

      await apiClient.put(`/api/v1/profiles/me`, requestData);

      // 성공 알림
      addToast('프로필이 성공적으로 수정되었습니다!', 'success');

      onSuccess();
      onClose();
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      const error = err as Error;
      setError(
        error.message || '프로필 수정에 실패했습니다. 다시 시도해주세요.'
      );
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
                        htmlFor="name"
                        className="block text-sm font-semibold text-neutral-700 mb-2"
                      >
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        disabled={isLoading}
                        maxLength={50}
                      />
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
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        프로필 이미지
                      </label>
                      <div className="flex items-center gap-4">
                        {(profilePreview || currentProfileUrl) && (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                            <Image
                              src={
                                (profilePreview || currentProfileUrl) as string
                              }
                              alt="프로필 미리보기"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {profileFile ? profileFile.name : '이미지 선택'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            disabled={isLoading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        배너 이미지
                      </label>
                      <div className="space-y-2">
                        {(bannerPreview || currentBannerImageUrl) && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={
                                (bannerPreview ||
                                  currentBannerImageUrl) as string
                              }
                              alt="배너 미리보기"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <label className="cursor-pointer block">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {bannerFile ? bannerFile.name : '이미지 선택'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerImageChange}
                            disabled={isLoading}
                            className="hidden"
                          />
                        </label>
                      </div>
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
