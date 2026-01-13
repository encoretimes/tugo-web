'use client';

import { useState, useCallback } from 'react';
import { useCreatePost } from './usePosts';
import { uploadImages } from '@/services/media';
import { useToastStore } from '@/store/toastStore';
import type { PollCreateData, PostType } from '@/types/post';

export interface UsePostComposerOptions {
  defaultPostType?: PostType;
  onSuccess?: () => void;
}

export interface UsePostComposerReturn {
  // State
  content: string;
  setContent: (content: string) => void;
  postType: PostType;
  setPostType: (type: PostType) => void;
  selectedImages: File[];
  pollData: PollCreateData | null;
  pendingImages: File[];
  showMultiImageEditor: boolean;
  showPollModal: boolean;
  editingImageIndex: number | null;

  // Computed
  contentByteLength: number;
  maxByteLength: number;
  isOverLimit: boolean;
  canSubmit: boolean;
  isPending: boolean;

  // Actions
  handleSubmit: () => Promise<void>;
  handleEmojiSelect: (emoji: string) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleImageEditComplete: (editedFiles: File[]) => void;
  handleImageEditCancel: () => void;
  handlePollButtonClick: () => void;
  handlePollCreate: (newPollData: PollCreateData) => void;
  handlePollCancel: () => void;
  handleEditImage: (index: number) => void;
  handleImageEditorSave: (editedFile: File) => void;
  handleImageEditorClose: () => void;
  resetForm: () => void;
}

const MAX_BYTE_LENGTH = 10000;
const MAX_IMAGES = 10;

export function usePostComposer(
  options: UsePostComposerOptions = {}
): UsePostComposerReturn {
  const { defaultPostType = 'FREE', onSuccess } = options;

  const { addToast } = useToastStore();
  const createPostMutation = useCreatePost();

  // Content state
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>(defaultPostType);

  // Image state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [showMultiImageEditor, setShowMultiImageEditor] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );

  // Poll state
  const [pollData, setPollData] = useState<PollCreateData | null>(null);
  const [showPollModal, setShowPollModal] = useState(false);

  // Computed values
  const getByteLength = (str: string) => new Blob([str]).size;
  const contentByteLength = getByteLength(content);
  const isOverLimit = contentByteLength > MAX_BYTE_LENGTH;
  const canSubmit =
    content.trim().length > 0 && !isOverLimit && !createPostMutation.isPending;

  // Reset form
  const resetForm = useCallback(() => {
    setContent('');
    setPostType(defaultPostType);
    setSelectedImages([]);
    setPendingImages([]);
    setPollData(null);
    setShowMultiImageEditor(false);
    setShowPollModal(false);
    setEditingImageIndex(null);
  }, [defaultPostType]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

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
        postType: postType,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        pollData: pollData || undefined,
      },
      {
        onSuccess: () => {
          resetForm();
          onSuccess?.();
        },
      }
    );
  }, [
    canSubmit,
    selectedImages,
    content,
    postType,
    pollData,
    createPostMutation,
    addToast,
    resetForm,
    onSuccess,
  ]);

  // Emoji handler
  const handleEmojiSelect = useCallback((emoji: string) => {
    setContent((prev) => prev + emoji);
  }, []);

  // Image handlers
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      const totalImages = selectedImages.length + newFiles.length;

      if (totalImages > MAX_IMAGES) {
        addToast(`최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`, 'error');
        return;
      }

      setPendingImages(newFiles);
      setShowMultiImageEditor(true);
      e.target.value = '';
    },
    [selectedImages.length, addToast]
  );

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleImageEditComplete = useCallback((editedFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...editedFiles]);
    setShowMultiImageEditor(false);
    setPendingImages([]);
  }, []);

  const handleImageEditCancel = useCallback(() => {
    setShowMultiImageEditor(false);
    setPendingImages([]);
  }, []);

  const handleEditImage = useCallback((index: number) => {
    setEditingImageIndex(index);
  }, []);

  const handleImageEditorSave = useCallback(
    (editedFile: File) => {
      if (editingImageIndex !== null) {
        setSelectedImages((prev) => {
          const updated = [...prev];
          updated[editingImageIndex] = editedFile;
          return updated;
        });
        setEditingImageIndex(null);
      }
    },
    [editingImageIndex]
  );

  const handleImageEditorClose = useCallback(() => {
    setEditingImageIndex(null);
  }, []);

  // Poll handlers
  const handlePollButtonClick = useCallback(() => {
    if (pollData) {
      setPollData(null);
    } else {
      setShowPollModal(true);
    }
  }, [pollData]);

  const handlePollCreate = useCallback((newPollData: PollCreateData) => {
    setPollData(newPollData);
    setShowPollModal(false);
  }, []);

  const handlePollCancel = useCallback(() => {
    setShowPollModal(false);
  }, []);

  return {
    // State
    content,
    setContent,
    postType,
    setPostType,
    selectedImages,
    pollData,
    pendingImages,
    showMultiImageEditor,
    showPollModal,
    editingImageIndex,

    // Computed
    contentByteLength,
    maxByteLength: MAX_BYTE_LENGTH,
    isOverLimit,
    canSubmit,
    isPending: createPostMutation.isPending,

    // Actions
    handleSubmit,
    handleEmojiSelect,
    handleImageSelect,
    handleRemoveImage,
    handleImageEditComplete,
    handleImageEditCancel,
    handlePollButtonClick,
    handlePollCreate,
    handlePollCancel,
    handleEditImage,
    handleImageEditorSave,
    handleImageEditorClose,
    resetForm,
  };
}
