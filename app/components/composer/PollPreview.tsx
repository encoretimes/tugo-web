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
            onClick={onRemove}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
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
                <span className="text-sm text-gray-700">{option}</span>
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
          onClick={onRemove}
          className="ml-3 p-1 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
