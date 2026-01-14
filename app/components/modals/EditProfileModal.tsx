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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    프로필 수정
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6">
                  <div className="space-y-8">
                    {/* 프로필 이미지 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        프로필 사진
                      </label>
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          {profilePreview || currentProfileUrl ? (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                              <Image
                                src={
                                  (profilePreview ||
                                    currentProfileUrl) as string
                                }
                                alt="프로필"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 border border-gray-200">
                              <UserIcon className="h-10 w-10 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {profilePreview || currentProfileUrl ? (
                            <>
                              <label htmlFor="profile-image-upload">
                                <span className="inline-block px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 cursor-pointer transition-colors">
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
                                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-red-400 hover:text-red-600 text-gray-700 transition-colors"
                                disabled={isLoading}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <label htmlFor="profile-image-upload">
                              <span className="inline-block px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 cursor-pointer transition-colors">
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
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        배너 이미지
                      </label>
                      <div className="relative w-full aspect-[21/9] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden group">
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
                            <PhotoIcon className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                        {/* 버튼을 우측 하단에 배치 */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          {bannerPreview || currentBannerImageUrl ? (
                            <>
                              <label htmlFor="banner-image-upload">
                                <span className="inline-block px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 cursor-pointer transition-colors shadow-sm">
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
                                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-red-400 hover:text-red-600 text-gray-700 transition-colors shadow-sm"
                                disabled={isLoading}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <label htmlFor="banner-image-upload">
                              <span className="inline-block px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 cursor-pointer transition-colors shadow-sm">
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
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors bg-white"
                        disabled={isLoading}
                        maxLength={50}
                      />
                    </div>

                    {/* 자기소개 */}
                    <div>
                      <label
                        htmlFor="introduction"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        자기소개
                      </label>
                      <textarea
                        id="introduction"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors resize-none bg-white"
                        disabled={isLoading}
                        maxLength={200}
                      />
                      <p className="mt-2 text-sm text-gray-500 text-right">
                        {introduction.length}/200
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      disabled={isLoading}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
