'use client';

import React, { useState, useRef } from 'react';
import {
  PhotoIcon,
  ListBulletIcon,
  UserIcon,
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { useCreatePost } from '@/hooks/usePosts';
import { uploadImages } from '@/api/media';
import { useToastStore } from '@/store/toastStore';
import EmojiPickerButton from './EmojiPicker';
import MentionInput from './MentionInput';
import PollCreatorModal from '@/components/modals/PollCreatorModal';
import MultiImageEditor from '@/components/modals/MultiImageEditor';
import ImageEditor from '@/components/modals/ImageEditor';
import { PollCreateData } from '@/app/types/poll';

const InlinePostComposer = () => {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [pollData, setPollData] = useState<PollCreateData | null>(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [showMultiImageEditor, setShowMultiImageEditor] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = useCreatePost();

  // UTF-8 바이트 크기 계산
  const getByteLength = (str: string) => new Blob([str]).size;
  const contentByteLength = getByteLength(content);
  const maxByteLength = 10000;

  // 로그인하지 않았으면 표시하지 않음
  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    if (!content.trim() || createPostMutation.isPending) return;

    let mediaUrls: string[] = [];

    if (selectedImages.length > 0) {
      try {
        mediaUrls = await uploadImages(selectedImages);
      } catch {
        addToast('이미지 업로드에 실패했습니다.', 'error');
        return;
      }
    }

    createPostMutation.mutate(
      {
        contentText: content,
        postType: 'FREE',
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        pollData: pollData || undefined,
      },
      {
        onSuccess: () => {
          setContent('');
          setSelectedImages([]);
          setPollData(null);
          setIsFocused(false);
          addToast('게시물이 작성되었습니다.', 'success');
        },
      }
    );
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(content + emoji);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = selectedImages.length + newFiles.length;

    if (totalImages > 10) {
      addToast('최대 10장까지 업로드할 수 있습니다.', 'error');
      return;
    }

    setPendingImages(newFiles);
    setShowMultiImageEditor(true);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleImageEditComplete = (editedFiles: File[]) => {
    setSelectedImages([...selectedImages, ...editedFiles]);
    setShowMultiImageEditor(false);
    setPendingImages([]);
  };

  const handleImageEditCancel = () => {
    setShowMultiImageEditor(false);
    setPendingImages([]);
  };

  const handlePollButtonClick = () => {
    if (pollData) {
      setPollData(null);
    } else {
      setShowPollModal(true);
    }
  };

  const handlePollCreate = (newPollData: PollCreateData) => {
    setPollData(newPollData);
    setShowPollModal(false);
  };

  const handleEditImage = (index: number) => {
    setEditingImageIndex(index);
  };

  const handleImageEditorSave = (editedFile: File) => {
    if (editingImageIndex !== null) {
      const updatedImages = [...selectedImages];
      updatedImages[editingImageIndex] = editedFile;
      setSelectedImages(updatedImages);
      setEditingImageIndex(null);
    }
  };

  const isExpanded = isFocused || content.length > 0 || selectedImages.length > 0 || pollData !== null;

  return (
    <div className="bg-[#FAF8FF] rounded-[20px] mx-4 mt-4">
      <div className="p-4">
        <div className="flex gap-3">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.name}
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gray-200">
                <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="flex-1 min-w-0">
            {/* 모바일: 한 줄 입력창 / PC: 확장 가능한 텍스트 영역 */}
            <div
              className={`transition-all duration-200 ${
                isExpanded ? '' : 'md:py-0'
              }`}
            >
              <MentionInput
                value={content}
                onChange={setContent}
                onFocus={() => setIsFocused(true)}
                placeholder="무슨 생각을 하고 계신가요?"
                rows={isExpanded ? 3 : 1}
                disabled={createPostMutation.isPending}
                className={`w-full resize-none border-0 bg-transparent text-gray-900 placeholder-gray-500 focus:ring-0 text-base md:text-lg leading-relaxed ${
                  isExpanded ? 'py-2' : 'py-3 md:py-2'
                }`}
              />
            </div>

            {/* 이미지 미리보기 */}
            {selectedImages.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group"
                      >
                        <div
                          className="cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => handleEditImage(index)}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Preview ${index + 1}`}
                            width={80}
                            height={80}
                            className="h-16 w-16 md:h-20 md:w-20 object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          onClick={() => handleEditImage(index)}
                          className="absolute bottom-1 left-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="편집"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          title="삭제"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 투표 미리보기 */}
            {pollData && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">
                      {pollData.question}
                    </h4>
                    <div className="space-y-1">
                      {pollData.options.slice(0, 2).map((option, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200"
                        >
                          {option}
                        </div>
                      ))}
                      {pollData.options.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{pollData.options.length - 2}개 옵션
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setPollData(null)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 하단 툴바 - 확장 시 또는 항상 표시 */}
            <div
              className={`flex items-center justify-between mt-3 pt-3 border-t border-gray-100 ${
                isExpanded ? 'opacity-100' : 'opacity-100 md:opacity-70 md:hover:opacity-100'
              } transition-opacity`}
            >
              <div className="flex items-center gap-1">
                {/* 이미지 업로드 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={createPostMutation.isPending}
                  className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  title="이미지 추가"
                >
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* 투표 */}
                <button
                  onClick={handlePollButtonClick}
                  disabled={createPostMutation.isPending}
                  className={`p-2 rounded-full transition-colors ${
                    pollData
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-primary-500 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  title="투표 추가"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>

                {/* 이모지 */}
                <EmojiPickerButton
                  onEmojiSelect={handleEmojiSelect}
                  buttonClassName="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                />
              </div>

              {/* 글자 수 & 작성 버튼 */}
              <div className="flex items-center gap-3">
                {isExpanded && (
                  <span
                    className={`text-xs hidden sm:inline ${
                      contentByteLength > maxByteLength
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}
                  >
                    {contentByteLength.toLocaleString()} / {maxByteLength.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={
                    !content.trim() ||
                    contentByteLength > maxByteLength ||
                    createPostMutation.isPending
                  }
                  className="px-4 py-1.5 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createPostMutation.isPending ? '작성 중...' : '투고'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <PollCreatorModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onPollCreate={handlePollCreate}
        initialData={pollData}
      />

      <MultiImageEditor
        isOpen={showMultiImageEditor}
        onClose={handleImageEditCancel}
        imageFiles={pendingImages}
        onSave={handleImageEditComplete}
      />

      {editingImageIndex !== null && selectedImages[editingImageIndex] && (
        <ImageEditor
          isOpen={editingImageIndex !== null}
          onClose={() => setEditingImageIndex(null)}
          imageFile={selectedImages[editingImageIndex]}
          onSave={handleImageEditorSave}
        />
      )}
    </div>
  );
};

export default InlinePostComposer;
