'use client';

import { useUserStore } from '@/store/userStore';
import { UserIcon, PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const ProfileSection = () => {
  const { user } = useUserStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">프로필 수정</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission
        }}
      >
        <div className="space-y-8">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로필 사진
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24">
                {user?.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                    <UserIcon className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <PhotoIcon className="h-8 w-8 text-white" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
              >
                이미지 변경
              </button>
            </div>
          </div>

          {/* User Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              이름
            </label>
            <input
              type="text"
              id="username"
              defaultValue={user?.name}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-primary-600 focus:ring-primary-600 sm:text-sm"
            />
          </div>

          {/* User Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              rows={4}
              defaultValue="Tugo의 열정적인 사용자입니다. 정치와 사회 문제에 대해 토론하는 것을 좋아합니다."
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-primary-600 focus:ring-primary-600 sm:text-sm"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
