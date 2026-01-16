'use client';

import { Poll, PollOption } from '@/types/post';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface PollCardProps {
  poll: Poll;
  onVote?: (optionIds: number[]) => void;
  onRevote?: (optionIds: number[]) => void;
  disabled?: boolean;
  hideQuestion?: boolean;
}

export default function PollCard({
  poll,
  onVote,
  onRevote,
  disabled = false,
  hideQuestion = false,
}: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isRevoting, setIsRevoting] = useState(false);

  const handleOptionClick = (optionId: number) => {
    if (!isRevoting && (poll.hasVoted || poll.isEnded || disabled)) return;

    if (poll.pollType === 'SINGLE_CHOICE') {
      setSelectedOptions([optionId]);
    } else {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0 || !onVote) return;
    onVote(selectedOptions);
    setIsRevoting(false);
  };

  const handleRevote = () => {
    if (selectedOptions.length === 0 || !onRevote) return;
    onRevote(selectedOptions);
    setIsRevoting(false);
  };

  const startRevoting = () => {
    const currentlySelected = poll.options
      .filter((opt) => opt.isSelectedByMe)
      .map((opt) => opt.optionId);
    setSelectedOptions(currentlySelected);
    setIsRevoting(true);
  };

  const cancelRevoting = () => {
    setSelectedOptions([]);
    setIsRevoting(false);
  };

  const getPercentage = (option: PollOption) => {
    if (poll.totalVoters === 0) return 0;
    return Math.round((option.voteCount / poll.totalVoters) * 100);
  };

  const showResults = (poll.hasVoted || poll.isEnded) && !isRevoting;

  const formatEndDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return '종료됨';
    if (diffDays > 0) return `${diffDays}일 남음`;
    if (diffHours > 0) return `${diffHours}시간 남음`;
    return '곧 종료';
  };

  return (
    <div className="rounded-md border border-gray-200 p-4 dark:border-neutral-700">
      {/* 투표 질문 */}
      {!hideQuestion && poll.question && (
        <h4 className="mb-3 text-base font-medium text-gray-900 dark:text-neutral-100">
          {poll.question}
        </h4>
      )}

      {/* 투표 옵션 */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = getPercentage(option);
          const isSelected = selectedOptions.includes(option.optionId);
          const wasSelectedByMe = option.isSelectedByMe;

          return (
            <div key={option.optionId}>
              {showResults ? (
                // 결과 표시 모드 - 심플한 바 차트
                <div className="relative overflow-hidden rounded">
                  <div
                    className="absolute inset-0 bg-gray-100 transition-all duration-300 dark:bg-neutral-700"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 dark:text-neutral-100">
                        {option.optionText}
                      </span>
                      {wasSelectedByMe && (
                        <CheckIcon
                          className="h-4 w-4 text-gray-900 dark:text-neutral-100"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ) : (
                // 투표 선택 모드 - 심플한 체크박스 스타일
                <button
                  onClick={() => handleOptionClick(option.optionId)}
                  className={`w-full rounded px-3 py-2.5 text-left transition ${
                    isSelected
                      ? 'bg-gray-100 dark:bg-neutral-700'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                  disabled={disabled}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded ${
                        isSelected
                          ? 'bg-gray-900 dark:bg-neutral-100'
                          : 'bg-gray-200 dark:bg-neutral-600'
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon
                          className="h-3 w-3 text-white dark:text-neutral-900"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-neutral-100">
                      {option.optionText}
                    </span>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 정보 및 버튼 */}
      <div className="mt-3 flex items-center justify-between">
        {/* 왼쪽: 투표 정보 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
          <span>{poll.totalVoters.toLocaleString()}명</span>
          {poll.endDate && (
            <>
              <span>·</span>
              <span className={poll.isEnded ? 'text-red-600' : ''}>
                {formatEndDate(poll.endDate)}
              </span>
            </>
          )}
        </div>

        {/* 오른쪽: 버튼 */}
        <div className="flex items-center gap-2">
          {!isRevoting && !showResults && selectedOptions.length > 0 && (
            <button
              onClick={handleVote}
              className="rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              disabled={disabled}
            >
              투표
            </button>
          )}

          {!isRevoting && poll.hasVoted && !poll.isEnded && onRevote && (
            <button
              onClick={startRevoting}
              className="rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              disabled={disabled}
            >
              다시 투표하기
            </button>
          )}

          {isRevoting && (
            <>
              <button
                onClick={cancelRevoting}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                취소
              </button>
              {selectedOptions.length > 0 && (
                <button
                  onClick={handleRevote}
                  className="rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  disabled={disabled}
                >
                  저장
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
