'use client';

import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  ListBulletIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { usePostComposer } from '@/hooks/usePostComposer';
import EmojiPickerButton from './EmojiPicker';
import MentionInput from './MentionInput';
import PollCreatorModal from '@/components/modals/PollCreatorModal';
import MultiImageEditor from '@/components/modals/MultiImageEditor';
import ImageEditor from '@/components/modals/ImageEditor';
import { ImagePreviewGrid, PollPreview } from '@/components/composer';
import { useToastStore } from '@/store/toastStore';

const InlinePostComposer = () => {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const composer = usePostComposer({
    onSuccess: () => {
      setIsFocused(false);
      addToast('게시물이 작성되었습니다.', 'success');
    },
  });

  if (!user) {
    return null;
  }

  const isExpanded =
    isFocused ||
    composer.content.length > 0 ||
    composer.selectedImages.length > 0 ||
    composer.pollData !== null;

  return (
    <div className="mx-4 mt-4 rounded-[20px] border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-950">
      <div className="p-4">
        <div className="flex gap-3">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.displayName}
                width={48}
                height={48}
                className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 md:h-12 md:w-12">
                <UserIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500 md:h-6 md:w-6" />
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="min-w-0 flex-1">
            <div
              className={`transition-all duration-200 ${
                isExpanded ? '' : 'md:py-0'
              }`}
            >
              <MentionInput
                value={composer.content}
                onChange={composer.setContent}
                onFocus={() => setIsFocused(true)}
                placeholder="무슨 생각을 하고 계신가요?"
                rows={isExpanded ? 3 : 1}
                disabled={composer.isPending}
                className={`w-full resize-none border-0 bg-transparent text-base leading-relaxed text-gray-900 placeholder-gray-500 focus:ring-0 dark:text-neutral-100 dark:placeholder-neutral-500 md:text-lg ${
                  isExpanded ? 'py-2' : 'py-3 md:py-2'
                }`}
              />
            </div>

            {/* 이미지 미리보기 */}
            {composer.selectedImages.length > 0 && (
              <div className="mt-3">
                <ImagePreviewGrid
                  images={composer.selectedImages}
                  onEdit={composer.handleEditImage}
                  onRemove={composer.handleRemoveImage}
                  disabled={composer.isPending}
                  size="small"
                />
              </div>
            )}

            {/* 투표 미리보기 */}
            {composer.pollData && (
              <PollPreview
                pollData={composer.pollData}
                onRemove={() => composer.handlePollButtonClick()}
                variant="compact"
              />
            )}

            {/* 하단 툴바 */}
            <div
              className={`mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-neutral-800 ${
                isExpanded
                  ? 'opacity-100'
                  : 'opacity-100 md:opacity-70 md:hover:opacity-100'
              } transition-opacity`}
            >
              <div className="flex items-center gap-1">
                {/* 이미지 업로드 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={composer.isPending}
                  className="rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30"
                  title="이미지 추가"
                >
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={composer.handleImageSelect}
                  className="hidden"
                />

                {/* 투표 */}
                <button
                  onClick={composer.handlePollButtonClick}
                  disabled={composer.isPending}
                  className={`rounded-md p-2 transition-colors ${
                    composer.pollData
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-primary-500 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  title="투표 추가"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>

                {/* 이모지 */}
                <EmojiPickerButton
                  onEmojiSelect={composer.handleEmojiSelect}
                  buttonClassName="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                />
              </div>

              {/* 글자 수 & 작성 버튼 */}
              <div className="flex items-center gap-3">
                {isExpanded && (
                  <span
                    className={`hidden text-xs sm:inline ${
                      composer.isOverLimit ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {composer.contentByteLength.toLocaleString()} /{' '}
                    {composer.maxByteLength.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={composer.handleSubmit}
                  disabled={!composer.canSubmit}
                  className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {composer.isPending ? '작성 중...' : '투고'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <PollCreatorModal
        isOpen={composer.showPollModal}
        onClose={composer.handlePollCancel}
        onPollCreate={composer.handlePollCreate}
        initialData={composer.pollData}
      />

      <MultiImageEditor
        isOpen={composer.showMultiImageEditor}
        onClose={composer.handleImageEditCancel}
        imageFiles={composer.pendingImages}
        onSave={composer.handleImageEditComplete}
      />

      {composer.editingImageIndex !== null &&
        composer.selectedImages[composer.editingImageIndex] && (
          <ImageEditor
            isOpen={composer.editingImageIndex !== null}
            onClose={composer.handleImageEditorClose}
            imageFile={composer.selectedImages[composer.editingImageIndex]}
            onSave={composer.handleImageEditorSave}
          />
        )}
    </div>
  );
};

export default InlinePostComposer;
