'use client';

import React, { useState } from 'react';
import {
  PhotoIcon,
  ChartBarIcon,
  FaceSmileIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import PostComposerModal from '@/components/modals/PostComposerModal';

const PostComposer = () => {
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="border-b p-4">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
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
              className="w-full cursor-text rounded-full border bg-gray-100 px-4 py-3 text-gray-500"
              onClick={openModal}
            >
              무슨 생각을 하고 계신가요?
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <PhotoIcon className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <ChartBarIcon className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <FaceSmileIcon className="h-6 w-6" />
                </button>
              </div>
              <button
                className="rounded-full bg-primary-600 px-4 py-2 font-bold text-white hover:bg-primary-700"
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
