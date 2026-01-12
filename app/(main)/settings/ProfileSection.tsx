'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { UserIcon, PhotoIcon, CameraIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import ProfileImageEditor from '@/components/modals/ProfileImageEditor';
import { uploadImage } from '@/services/media';
import { updateMyProfile } from '@/services/profiles';

const ProfileSection = () => {
  const { user, updateProfile } = useUserStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.introduction || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showBannerEditor, setShowBannerEditor] = useState(false);
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(null);
  const [pendingBannerImage, setPendingBannerImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.introduction || '');
    }
  }, [user]);

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

  const handleProfileImageSave = async (editedFile: File) => {
    try {
      const preview = URL.createObjectURL(editedFile);
      setProfileImagePreview(preview);
      const imageUrl = await uploadImage(editedFile);
      await updateMyProfile({ profileUrl: imageUrl });
      updateProfile({ profileImageUrl: imageUrl });
      addToast('프로필 사진이 변경되었습니다', 'success');
    } catch (error) {
      console.error('Failed to save profile image:', error);
      addToast('프로필 사진 변경에 실패했습니다', 'error');
      setProfileImagePreview(null);
    }
  };

  const handleBannerImageSave = async (editedFile: File) => {
    try {
      const preview = URL.createObjectURL(editedFile);
      setBannerImagePreview(preview);
      const imageUrl = await uploadImage(editedFile);
      await updateMyProfile({ bannerImageUrl: imageUrl });
      updateProfile({ bannerImageUrl: imageUrl });
      addToast('배경 이미지가 변경되었습니다', 'success');
    } catch (error) {
      console.error('Failed to save banner image:', error);
      addToast('배경 이미지 변경에 실패했습니다', 'error');
      setBannerImagePreview(null);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      setProfileImagePreview(null);
      await updateMyProfile({ profileUrl: '' });
      updateProfile({ profileImageUrl: null });
      addToast('프로필 사진이 삭제되었습니다', 'success');
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      addToast('프로필 사진 삭제에 실패했습니다', 'error');
      if (user?.profileImageUrl) {
        setProfileImagePreview(user.profileImageUrl);
      }
    }
  };

  const handleRemoveBannerImage = async () => {
    try {
      setBannerImagePreview(null);
      await updateMyProfile({ bannerImageUrl: '' });
      updateProfile({ bannerImageUrl: null });
      addToast('배너 이미지가 삭제되었습니다', 'success');
    } catch (error) {
      console.error('Failed to remove banner image:', error);
      addToast('배너 이미지 삭제에 실패했습니다', 'error');
      if (user?.bannerImageUrl) {
        setBannerImagePreview(user.bannerImageUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('이름을 입력해주세요', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMyProfile({
        name: name.trim(),
        introduction: bio.trim() || undefined,
      });
      updateProfile({
        name: name.trim(),
        introduction: bio.trim() || undefined,
      });
      addToast('프로필이 저장되었습니다', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast('프로필 저장에 실패했습니다', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {/* Banner Image */}
      <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900">
        {(bannerImagePreview || user?.bannerImageUrl) && (
          <Image
            src={bannerImagePreview || user?.bannerImageUrl || ''}
            alt="Banner"
            fill
            className="object-cover"
          />
        )}
        <label
          htmlFor="banner-image-upload"
          className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full cursor-pointer transition-colors"
        >
          <CameraIcon className="h-4 w-4 text-white" />
          <input
            id="banner-image-upload"
            type="file"
            accept="image/*"
            onChange={handleBannerImageSelect}
            className="sr-only"
          />
        </label>
        {(bannerImagePreview || user?.bannerImageUrl) && (
          <button
            type="button"
            onClick={handleRemoveBannerImage}
            className="absolute bottom-3 right-12 p-2 bg-black/50 hover:bg-red-600/80 rounded-full transition-colors"
          >
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Profile Image - Overlapping banner */}
        <div className="relative -mt-12 mb-6">
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-gray-100 dark:bg-neutral-800">
              {profileImagePreview || user?.profileImageUrl ? (
                <Image
                  src={profileImagePreview || user?.profileImageUrl || ''}
                  alt={user?.name || 'Profile'}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-300 dark:text-neutral-600" />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 p-2 bg-gray-900 dark:bg-neutral-700 hover:bg-gray-800 dark:hover:bg-neutral-600 rounded-full cursor-pointer transition-colors shadow-lg"
            >
              <CameraIcon className="h-4 w-4 text-white" />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageSelect}
                className="sr-only"
              />
            </label>
          </div>
          {(profileImagePreview || user?.profileImageUrl) && (
            <button
              type="button"
              onClick={handleRemoveProfileImage}
              className="ml-4 text-sm text-gray-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              삭제
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
            >
              이름
            </label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 text-gray-900 dark:text-neutral-100 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자신을 소개해주세요"
              className="block w-full px-4 py-3 text-gray-900 dark:text-neutral-100 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors resize-none placeholder:text-gray-400 dark:placeholder:text-neutral-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Editors */}
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
    </div>
  );
};

export default ProfileSection;
