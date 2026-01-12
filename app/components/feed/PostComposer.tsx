'use client';

import React, { useState } from 'react';
import {
  PhotoIcon,
  ListBulletIcon,
  FaceSmileIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import PostComposerModal from '@/components/modals/PostComposerModal';

const PostComposer = () => {
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // 로그인하지 않았으면 PostComposer를 표시하지 않음
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="border-b p-4">
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
            <div
              className="w-full cursor-text rounded-md border bg-gray-100 px-4 py-3 text-gray-500"
              onClick={openModal}
            >
              무슨 생각을 하고 계신가요?
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="flex items-center justify-center text-gray-500 hover:text-gray-700">
                  <PhotoIcon className="h-6 w-6" />
                </button>
                <button className="flex items-center justify-center text-gray-500 hover:text-gray-700">
                  <ListBulletIcon className="h-6 w-6" />
                </button>
                <button className="flex items-center justify-center text-gray-500 hover:text-gray-700">
                  <FaceSmileIcon className="h-6 w-6" />
                </button>
              </div>
              <button
                className="rounded-md bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-700"
                onClick={openModal}
              >
                투고하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <PostComposerModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default PostComposer;
