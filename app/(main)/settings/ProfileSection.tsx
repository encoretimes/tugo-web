'use client';

import { useUserStore } from '@/store/userStore';
import { UserIcon, PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const ProfileSection = () => {
  const { user } = useUserStore();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-3 border-b border-gray-200">
        프로필
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission
        }}
      >
        <div className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              프로필 사진
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                {user?.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 border-2 border-gray-300">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <PhotoIcon className="h-7 w-7 text-white" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium border border-gray-400 bg-white hover:bg-gray-50 text-gray-700"
              >
                이미지 변경
              </button>
            </div>
          </div>

          {/* User Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이름
            </label>
            <input
              type="text"
              id="username"
              defaultValue={user?.name}
              className="block w-full px-3 py-2 border border-gray-400 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
            />
          </div>

          {/* User Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              rows={4}
              defaultValue="Tugo의 열정적인 사용자입니다. 정치와 사회 문제에 대해 토론하는 것을 좋아합니다."
              className="block w-full px-3 py-2 border border-gray-400 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
            ></textarea>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
