'use client';

import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import MentionInput from '../MentionInput';
import EmojiPickerButton from '../EmojiPicker';

interface CommentInputProps {
  userProfileImageUrl?: string | null;
  userName: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
}

export default function CommentInput({
  userProfileImageUrl,
  userName,
  value,
  onChange,
  onSubmit,
  isPending = false,
}: CommentInputProps) {
  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        {userProfileImageUrl ? (
          <Image
            src={userProfileImageUrl}
            alt={userName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 dark:bg-neutral-700">
            <UserIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </div>
        )}
        <div className="flex-1">
          <MentionInput
            value={value}
            onChange={onChange}
            placeholder="댓글을 입력하세요..."
            rows={2}
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-2 text-sm focus:border-primary-600 dark:focus:border-primary-400 focus:outline-none"
          />
          <div className="mt-2 flex justify-between items-center">
            <EmojiPickerButton
              onEmojiSelect={(emoji) => onChange(value + emoji)}
              buttonClassName="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
            />
            <button
              onClick={onSubmit}
              disabled={!value.trim() || isPending}
              className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isPending ? '작성 중...' : '댓글 달기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
