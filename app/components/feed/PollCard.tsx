'use client';

import { Poll, PollOption } from '@/app/types/poll';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface PollCardProps {
  poll: Poll;
  onVote?: (optionIds: number[]) => void;
  disabled?: boolean;
}

export default function PollCard({
  poll,
  onVote,
  disabled = false,
}: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionClick = (optionId: number) => {
    if (poll.hasVoted || poll.isEnded || disabled) return;

    if (poll.pollType === 'SINGLE_CHOICE') {
      setSelectedOptions([optionId]);
    } else {
      // MULTIPLE_CHOICE
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
  };

  const getPercentage = (option: PollOption) => {
    if (poll.totalVoters === 0) return 0;
    // 단일 선택: voteCount가 투표자 수
    // 다중 선택: voteCount가 옵션 선택 수 (총합이 totalVoters보다 클 수 있음)
    return Math.round((option.voteCount / poll.totalVoters) * 100);
  };

  const showResults = poll.hasVoted || poll.isEnded;

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
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-3">
      {/* 투표 질문 */}
      {poll.question && (
        <h4 className="font-semibold text-gray-900 mb-3">{poll.question}</h4>
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
                // 결과 표시 모드
                <div className="relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-medium text-gray-900">
                        {option.optionText}
                      </span>
                      {wasSelectedByMe && (
                        <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {option.voteCount.toLocaleString()}표
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // 투표 선택 모드
                <button
                  onClick={() => handleOptionClick(option.optionId)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={disabled}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {option.optionText}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 투표 정보 및 버튼 */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <span>{poll.totalVoters.toLocaleString()}명 참여</span>
          {poll.endDate && (
            <>
              <span>•</span>
              <span className={poll.isEnded ? 'text-red-600' : ''}>
                {formatEndDate(poll.endDate)}
              </span>
            </>
          )}
          {!poll.endDate && (
            <>
              <span>•</span>
              <span>기한 없음</span>
            </>
          )}
        </div>

        {!showResults && selectedOptions.length > 0 && (
          <button
            onClick={handleVote}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition"
            disabled={disabled}
          >
            투표하기
          </button>
        )}
      </div>

      {/* 투표 타입 표시 */}
      {!showResults && (
        <p className="mt-2 text-xs text-gray-500">
          {poll.pollType === 'SINGLE_CHOICE'
            ? '하나의 옵션을 선택하세요'
            : '여러 옵션을 선택할 수 있습니다'}
        </p>
      )}
    </div>
  );
}
