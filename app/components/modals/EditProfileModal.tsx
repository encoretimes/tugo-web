'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { uploadImage } from '@/services/media';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import ProfileImageEditor from './ProfileImageEditor';

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
  displayName: string;
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
  const updateProfile = useUserStore((state) => state.updateProfile);

  // Image editor state
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showBannerEditor, setShowBannerEditor] = useState(false);
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(
    null
  );
  const [pendingBannerImage, setPendingBannerImage] = useState<File | null>(
    null
  );

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('이미지 파일만 업로드 가능합니다', 'error');
        return;
      }
      setPendingProfileImage(file);
      setShowProfileEditor(true);
    }
    e.target.value = '';
  };

  const handleBannerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('이미지 파일만 업로드 가능합니다', 'error');
        return;
      }
      setPendingBannerImage(file);
      setShowBannerEditor(true);
    }
    e.target.value = '';
  };

  const handleProfileImageSave = (editedFile: File) => {
    setProfileFile(editedFile);
    setProfilePreview(URL.createObjectURL(editedFile));
  };

  const handleBannerImageSave = (editedFile: File) => {
    setBannerFile(editedFile);
    setBannerPreview(URL.createObjectURL(editedFile));
  };

  const handleRemoveProfileImage = () => {
    setProfileFile(null);
    setProfilePreview(null);
  };

  const handleRemoveBannerImage = () => {
    setBannerFile(null);
    setBannerPreview(null);
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
        displayName: name.trim(),
        introduction: introduction.trim() || undefined,
        profileUrl: finalProfileUrl || undefined,
        bannerImageUrl: finalBannerUrl || undefined,
      };

      await apiClient.put(`/api/v1/profiles/me`, requestData);

      // Update user store with new profile data
      updateProfile({
        displayName: name.trim(),
        introduction: introduction.trim() || undefined,
        profileImageUrl: finalProfileUrl || undefined,
        bannerImageUrl: finalBannerUrl || undefined,
      });

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5 dark:border-neutral-700">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                    프로필 수정
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6">
                  <div className="space-y-8">
                    {/* 프로필 이미지 */}
                    <div>
                      <label className="mb-4 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        프로필 사진
                      </label>
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          {profilePreview || currentProfileUrl ? (
                            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-neutral-700">
                              <Image
                                src={
                                  (profilePreview ||
                                    currentProfileUrl) as string
                                }
                                alt="프로필"
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
                              <UserIcon className="h-10 w-10 text-gray-300 dark:text-neutral-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {profilePreview || currentProfileUrl ? (
                            <>
                              <label htmlFor="profile-image-upload">
                                <span className="inline-block cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500">
                                  변경
                                </span>
                                <input
                                  id="profile-image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfileImageSelect}
                                  disabled={isLoading}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={handleRemoveProfileImage}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-red-400 hover:text-red-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-red-500 dark:hover:text-red-400"
                                disabled={isLoading}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <label htmlFor="profile-image-upload">
                              <span className="inline-block cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500">
                                추가하기
                              </span>
                              <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageSelect}
                                disabled={isLoading}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 배너 이미지 */}
                    <div>
                      <label className="mb-4 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        배너 이미지
                      </label>
                      <div className="group relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
                        {bannerPreview || currentBannerImageUrl ? (
                          <Image
                            src={
                              (bannerPreview || currentBannerImageUrl) as string
                            }
                            alt="배너"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <PhotoIcon className="h-8 w-8 text-gray-300 dark:text-neutral-500" />
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          {bannerPreview || currentBannerImageUrl ? (
                            <>
                              <label htmlFor="banner-image-upload">
                                <span className="inline-block cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500">
                                  변경
                                </span>
                                <input
                                  id="banner-image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerImageSelect}
                                  disabled={isLoading}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={handleRemoveBannerImage}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-red-400 hover:text-red-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-red-500 dark:hover:text-red-400"
                                disabled={isLoading}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <label htmlFor="banner-image-upload">
                              <span className="inline-block cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500">
                                추가하기
                              </span>
                              <input
                                id="banner-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleBannerImageSelect}
                                disabled={isLoading}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 이름 */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                      >
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
                        disabled={isLoading}
                        maxLength={50}
                      />
                    </div>

                    {/* 자기소개 */}
                    <div>
                      <label
                        htmlFor="introduction"
                        className="mb-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                      >
                        자기소개
                      </label>
                      <textarea
                        id="introduction"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400"
                        disabled={isLoading}
                        maxLength={200}
                      />
                      <p className="mt-2 text-right text-sm text-gray-500 dark:text-neutral-400">
                        {introduction.length}/200
                      </p>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-neutral-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      disabled={isLoading}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                    >
                      {isLoading ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </form>

                {/* Profile Image Editor */}
                <ProfileImageEditor
                  isOpen={showProfileEditor}
                  onClose={() => {
                    setShowProfileEditor(false);
                    setPendingProfileImage(null);
                  }}
                  imageFile={pendingProfileImage}
                  onSave={handleProfileImageSave}
                  imageType="profile"
                />

                {/* Banner Image Editor */}
                <ProfileImageEditor
                  isOpen={showBannerEditor}
                  onClose={() => {
                    setShowBannerEditor(false);
                    setPendingBannerImage(null);
                  }}
                  imageFile={pendingBannerImage}
                  onSave={handleBannerImageSave}
                  imageType="banner"
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
