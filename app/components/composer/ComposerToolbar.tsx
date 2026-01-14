'use client';

import { useRef } from 'react';
import { PhotoIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import EmojiPickerButton from '@/app/components/feed/EmojiPicker';

interface ComposerToolbarProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPollClick: () => void;
  onEmojiSelect: (emoji: string) => void;
  hasPoll?: boolean;
  disabled?: boolean;
}

export default function ComposerToolbar({
  onImageSelect,
  onPollClick,
  onEmojiSelect,
  hasPoll = false,
  disabled = false,
}: ComposerToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center space-x-2">
      <label className="flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg p-1.5 cursor-pointer transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect}
          disabled={disabled}
          className="hidden"
        />
        <PhotoIcon className="h-6 w-6" />
      </label>
      <button
        onClick={onPollClick}
        className={`flex items-center justify-center rounded-lg p-1.5 transition-colors ${
          hasPoll
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
        }`}
        disabled={disabled}
      >
        <ListBulletIcon className="h-6 w-6" />
      </button>
      <EmojiPickerButton
        onEmojiSelect={onEmojiSelect}
        buttonClassName="flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg p-1.5 transition-colors"
      />
    </div>
  );
}
