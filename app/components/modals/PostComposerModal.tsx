'use client';

import { Dialog, Transition, Menu } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import {
  PhotoIcon,
  UserIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PencilIcon,
  LockOpenIcon,
  LockClosedIcon,
  CheckIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { useCreatePost } from '@/hooks/usePosts';
import { uploadImages } from '@/api/media';
import { useToastStore } from '@/store/toastStore';
import ImageEditor from './ImageEditor';
import MultiImageEditor from './MultiImageEditor';
import EmojiPickerButton from '../feed/EmojiPicker';
import PollCreatorModal from './PollCreatorModal';
import MentionInput from '../feed/MentionInput';
import { PollCreateData } from '@/app/types/poll';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function PostComposerModal({
  isOpen,
  onClose,
  onPostCreated,
}: PostComposerModalProps) {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'FREE' | 'SUBSCRIBER_ONLY' | 'PPV'>(
    'FREE'
  );
  /* PPV 기능 (향후 사용) */
  // const [ppvPrice, setPpvPrice] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );
  const [pollData, setPollData] = useState<PollCreateData | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [showMultiImageEditor, setShowMultiImageEditor] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);

  const createPostMutation = useCreatePost();

  const handleSubmit = async () => {
    if (!content.trim() || createPostMutation.isPending) return;

    let mediaUrls: string[] = [];

    // Upload images if any
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
        postType: postType,
        /* PPV 기능 (향후 사용) */
        // ppvPrice: postType === 'PPV' && ppvPrice ? Number(ppvPrice) : undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        pollData: pollData || undefined,
      },
      {
        onSuccess: () => {
          setContent('');
          setPostType('FREE');
          // setPpvPrice('');
          setSelectedImages([]);
          setPollData(null);
          onClose();
          onPostCreated?.();
        },
      }
    );
  };

  const handleClose = () => {
    if (!createPostMutation.isPending) {
      setContent('');
      setPostType('FREE');
      // setPpvPrice('');
      setSelectedImages([]);
      setPollData(null);
      setIsExpanded(false);
      setPendingImages([]);
      setShowMultiImageEditor(false);
      setShowPollModal(false);
      onClose();
    }
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

    // 이미지 편집 모달을 바로 열기
    setPendingImages(newFiles);
    setShowMultiImageEditor(true);

    // 파일 입력 초기화
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
      // 이미 투표가 있으면 제거
      setPollData(null);
    } else {
      // 투표가 없으면 모달 열기
      setShowPollModal(true);
    }
  };

  const handlePollCreate = (newPollData: PollCreateData) => {
    setPollData(newPollData);
    setShowPollModal(false);
  };

  const handlePollModalCancel = () => {
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

  const handleImageEditorClose = () => {
    setEditingImageIndex(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${
                  isExpanded ? 'max-w-3xl' : 'max-w-md'
                } transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    새 게시물 작성
                  </Dialog.Title>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? (
                        <ArrowsPointingInIcon className="h-6 w-6" />
                      ) : (
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={createPostMutation.isPending}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
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
                      <MentionInput
                        value={content}
                        onChange={setContent}
                        placeholder="무슨 생각을 하고 계신가요?"
                        rows={isExpanded ? 10 : 4}
                        disabled={createPostMutation.isPending}
                        className="w-full resize-none border-none bg-transparent p-2 text-black focus:ring-0"
                      />
                    </div>
                  </div>

                  {/* Poll Preview */}
                  {pollData && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-3">
                            {pollData.question}
                          </h3>
                          <div className="space-y-2">
                            {pollData.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center p-2 border border-gray-300 rounded-lg bg-white"
                              >
                                <div className="w-4 h-4 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {pollData.pollType === 'MULTIPLE_CHOICE'
                              ? '복수 선택 가능'
                              : '단일 선택'}
                            {pollData.endDate &&
                              ` • ${new Date(pollData.endDate).toLocaleDateString('ko-KR')}까지`}
                          </p>
                        </div>
                        <button
                          onClick={() => setPollData(null)}
                          className="ml-3 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image Preview Grid */}
                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-5 gap-2">
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
                                  width={100}
                                  height={100}
                                  className="h-20 w-20 object-cover"
                                  unoptimized
                                />
                              </div>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditImage(index)}
                                className="absolute bottom-1 left-1 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                disabled={createPostMutation.isPending}
                                title="편집"
                              >
                                <PencilIcon className="h-3.5 w-3.5" />
                              </button>
                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                disabled={createPostMutation.isPending}
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

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center justify-center text-primary-500 hover:text-primary-700 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          disabled={createPostMutation.isPending}
                          className="hidden"
                        />
                        <PhotoIcon className="h-6 w-6" />
                      </label>
                      <button
                        onClick={handlePollButtonClick}
                        className={`flex items-center justify-center ${pollData ? 'text-blue-600' : 'text-primary-500 hover:text-primary-700'}`}
                        disabled={createPostMutation.isPending}
                      >
                        <ListBulletIcon className="h-6 w-6" />
                      </button>
                      <EmojiPickerButton
                        onEmojiSelect={handleEmojiSelect}
                        buttonClassName="flex items-center justify-center text-primary-500 hover:text-primary-700"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Post Type Dropdown Menu */}
                      <Menu as="div" className="relative">
                        <Menu.Button
                          disabled={createPostMutation.isPending}
                          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-gray-500 border-[1.5px] border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {postType === 'FREE' ? (
                            <>
                              <LockOpenIcon className="h-5 w-5" />
                              <span>모두 공개</span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon className="h-5 w-5" />
                              <span>구독자 전용</span>
                            </>
                          )}
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute bottom-full mb-2 left-0 w-48 origin-bottom-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setPostType('FREE')}
                                    className={`${
                                      active ? 'bg-gray-100' : ''
                                    } group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-900`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LockOpenIcon className="h-5 w-5 text-gray-500" />
                                      <span>모두 공개</span>
                                    </div>
                                    {postType === 'FREE' && (
                                      <CheckIcon className="h-5 w-5 text-primary-600" />
                                    )}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      setPostType('SUBSCRIBER_ONLY')
                                    }
                                    className={`${
                                      active ? 'bg-gray-100' : ''
                                    } group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-900`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                                      <span>구독자 전용</span>
                                    </div>
                                    {postType === 'SUBSCRIBER_ONLY' && (
                                      <CheckIcon className="h-5 w-5 text-primary-600" />
                                    )}
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <button
                        onClick={handleSubmit}
                        disabled={
                          !content.trim() || createPostMutation.isPending
                        }
                        className="rounded-full bg-primary-600 px-4 py-2 font-bold text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        {createPostMutation.isPending
                          ? '작성 중...'
                          : '투고하기'}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Image Editor Modal */}
        {editingImageIndex !== null && selectedImages[editingImageIndex] && (
          <ImageEditor
            isOpen={editingImageIndex !== null}
            onClose={handleImageEditorClose}
            imageFile={selectedImages[editingImageIndex]}
            onSave={handleImageEditorSave}
          />
        )}

        <MultiImageEditor
          isOpen={showMultiImageEditor}
          onClose={handleImageEditCancel}
          imageFiles={pendingImages}
          onSave={handleImageEditComplete}
        />

        <PollCreatorModal
          isOpen={showPollModal}
          onClose={handlePollModalCancel}
          onPollCreate={handlePollCreate}
          initialData={pollData}
        />
      </Dialog>
    </Transition>
  );
}
