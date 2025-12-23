'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { UserIcon, PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import ProfileImageEditor from '@/components/modals/ProfileImageEditor';
import { uploadImage } from '@/services/media';
import { updateMyProfile } from '@/services/profiles';

const ProfileSection = () => {
  const { user, updateProfile } = useUserStore();
  const { addToast } = useToastStore();

  // Form state - initialize from userStore
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.introduction || '');

  // Image editor state
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showBannerEditor, setShowBannerEditor] = useState(false);
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(
    null
  );
  const [pendingBannerImage, setPendingBannerImage] = useState<File | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );

  // Sync form state with userStore when user data changes
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

      // Upload image to backend
      const imageUrl = await uploadImage(editedFile);

      // Update backend profile
      await updateMyProfile({ profileUrl: imageUrl });

      // Update local store
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

      // Upload image to backend
      const imageUrl = await uploadImage(editedFile);

      // Update backend profile
      await updateMyProfile({ bannerImageUrl: imageUrl });

      // Update local store
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

      // Update backend profile
      await updateMyProfile({ profileUrl: '' });

      // Update local store
      updateProfile({ profileImageUrl: null });

      addToast('프로필 사진이 삭제되었습니다', 'success');
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      addToast('프로필 사진 삭제에 실패했습니다', 'error');
      // Restore preview if backend update failed
      if (user?.profileImageUrl) {
        setProfileImagePreview(user.profileImageUrl);
      }
    }
  };

  const handleRemoveBannerImage = async () => {
    try {
      setBannerImagePreview(null);

      // Update backend profile
      await updateMyProfile({ bannerImageUrl: '' });

      // Update local store
      updateProfile({ bannerImageUrl: null });

      addToast('배너 이미지가 삭제되었습니다', 'success');
    } catch (error) {
      console.error('Failed to remove banner image:', error);
      addToast('배너 이미지 삭제에 실패했습니다', 'error');
      // Restore preview if backend update failed
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

    try {
      // Update backend profile
      await updateMyProfile({
        name: name.trim(),
        introduction: bio.trim() || undefined,
      });

      // Update local store
      updateProfile({
        name: name.trim(),
        introduction: bio.trim() || undefined,
      });

      addToast('프로필이 저장되었습니다', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast('프로필 저장에 실패했습니다', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-3 border-b border-gray-200">
        프로필
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              프로필 사진
            </label>
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20">
                {profileImagePreview || user?.profileImageUrl ? (
                  <Image
                    src={profileImagePreview || user?.profileImageUrl || ''}
                    alt={user?.name || 'Profile'}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 border border-gray-200">
                    <UserIcon className="h-10 w-10 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {profileImagePreview || user?.profileImageUrl ? (
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
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-red-400 hover:text-red-600 text-gray-700 transition-colors"
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
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              배너 이미지
            </label>
            <div className="relative w-full aspect-[21/9] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              {bannerImagePreview || user?.bannerImageUrl ? (
                <Image
                  src={bannerImagePreview || user?.bannerImageUrl || ''}
                  alt="Banner"
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
                {bannerImagePreview || user?.bannerImageUrl ? (
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
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveBannerImage}
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:border-red-400 hover:text-red-600 text-gray-700 transition-colors shadow-sm"
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
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* User Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              이름
            </label>
            <input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-gray-900 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* User Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-gray-900 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            저장
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
    </div>
  );
};

export default ProfileSection;
