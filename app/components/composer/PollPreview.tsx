'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PollCreateData } from '@/types/post';

interface PollPreviewProps {
  pollData: PollCreateData;
  onRemove: () => void;
  variant?: 'compact' | 'full';
}

export default function PollPreview({
  pollData,
  onRemove,
  variant = 'full',
}: PollPreviewProps) {
  if (variant === 'compact') {
    return (
      <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {pollData.question}
            </h4>
            <div className="space-y-1">
              {pollData.options.slice(0, 2).map((option, index) => (
                <div
                  key={index}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {option}
                </div>
              ))}
              {pollData.options.length > 2 && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  +{pollData.options.length - 2}개 옵션
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onRemove}
            className="ml-2 p-1 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-3 font-medium text-neutral-900 dark:text-neutral-100">
            {pollData.question}
          </h3>
          <div className="space-y-2">
            {pollData.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg border border-neutral-300 bg-white p-2 dark:border-neutral-600 dark:bg-neutral-700"
              >
                <div className="mr-3 h-4 w-4 flex-shrink-0 rounded-full border border-neutral-400 dark:border-neutral-500"></div>
                <span className="text-sm text-neutral-700 dark:text-neutral-200">
                  {option}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {pollData.pollType === 'MULTIPLE_CHOICE'
              ? '복수 선택 가능'
              : '단일 선택'}
            {pollData.endDate &&
              ` • ${new Date(pollData.endDate).toLocaleDateString('ko-KR')}까지`}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="ml-3 p-1 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
