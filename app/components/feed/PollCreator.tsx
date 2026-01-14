'use client';

import { XMarkIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PollCreateData } from '@/types/post';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PollCreatorProps {
  onPollDataChange: (pollData: PollCreateData | null) => void;
  initialData?: PollCreateData | null;
}

export default function PollCreator({
  onPollDataChange,
  initialData = null,
}: PollCreatorProps) {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [isMultipleChoice, setIsMultipleChoice] = useState(
    initialData?.pollType === 'MULTIPLE_CHOICE'
  );
  const [options, setOptions] = useState<string[]>(
    initialData?.options || ['', '']
  );
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [presetDuration, setPresetDuration] = useState<string>('1day');
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const updatePollData = (
    updatedQuestion: string,
    updatedIsMultipleChoice: boolean,
    updatedOptions: string[],
    updatedUseCustomDate: boolean,
    updatedPresetDuration: string,
    updatedCustomEndDate: Date | null
  ) => {
    const validOptions = updatedOptions.filter((opt) => opt.trim() !== '');

    if (validOptions.length < 2) {
      onPollDataChange(null);
      return;
    }

    let endDate: string | undefined;

    if (updatedUseCustomDate && updatedCustomEndDate) {
      endDate = updatedCustomEndDate.toISOString();
    } else if (!updatedUseCustomDate && updatedPresetDuration !== 'unlimited') {
      const now = new Date();
      switch (updatedPresetDuration) {
        case '1day':
          now.setDate(now.getDate() + 1);
          break;
        case '3days':
          now.setDate(now.getDate() + 3);
          break;
        case '7days':
          now.setDate(now.getDate() + 7);
          break;
      }
      endDate = now.toISOString();
    }

    onPollDataChange({
      question: updatedQuestion || undefined,
      pollType: updatedIsMultipleChoice ? 'MULTIPLE_CHOICE' : 'SINGLE_CHOICE',
      endDate,
      options: validOptions,
    });
  };

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    updatePollData(
      value,
      isMultipleChoice,
      options,
      useCustomDate,
      presetDuration,
      customEndDate
    );
  };

  const handleMultipleChoiceChange = (checked: boolean) => {
    setIsMultipleChoice(checked);
    updatePollData(
      question,
      checked,
      options,
      useCustomDate,
      presetDuration,
      customEndDate
    );
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updatePollData(
      question,
      isMultipleChoice,
      newOptions,
      useCustomDate,
      presetDuration,
      customEndDate
    );
  };

  const addOption = () => {
    if (options.length < 10) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      updatePollData(
        question,
        isMultipleChoice,
        newOptions,
        useCustomDate,
        presetDuration,
        customEndDate
      );
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      updatePollData(
        question,
        isMultipleChoice,
        newOptions,
        useCustomDate,
        presetDuration,
        customEndDate
      );
    }
  };

  const handleCustomDateChange = (checked: boolean) => {
    setUseCustomDate(checked);
    updatePollData(
      question,
      isMultipleChoice,
      options,
      checked,
      presetDuration,
      customEndDate
    );
  };

  const handlePresetDurationChange = (value: string) => {
    setPresetDuration(value);
    updatePollData(
      question,
      isMultipleChoice,
      options,
      useCustomDate,
      value,
      customEndDate
    );
  };

  const handleCustomEndDateChange = (date: Date | null) => {
    setCustomEndDate(date);
    updatePollData(
      question,
      isMultipleChoice,
      options,
      useCustomDate,
      presetDuration,
      date
    );
  };

  return (
    <div>
      {/* 투표 질문 (선택사항) */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="투표 질문 (선택사항)"
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
          maxLength={200}
        />
      </div>

      {/* 투표 옵션 */}
      <div className="mb-3 space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`옵션 ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              maxLength={100}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {options.length < 10 && (
          <button
            onClick={addOption}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition w-full justify-center border border-dashed border-primary-300"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm font-medium">옵션 추가</span>
          </button>
        )}
      </div>

      {/* 투표 설정 (Compact) */}
      <div className="mb-3 space-y-2">
        {/* 다중 선택 체크박스 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isMultipleChoice}
            onChange={(e) => handleMultipleChoiceChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-neutral-700 border-gray-300 dark:border-neutral-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 dark:text-neutral-300">
            다중 선택 허용
          </span>
        </label>

        {/* 커스텀 날짜 체크박스 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomDate}
            onChange={(e) => handleCustomDateChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 dark:bg-neutral-700 border-gray-300 dark:border-neutral-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 dark:text-neutral-300">
            종료일 직접 설정
          </span>
        </label>
      </div>

      {/* 기간 설정 */}
      {useCustomDate ? (
        <div className="mb-3">
          <div className="relative">
            <DatePicker
              selected={customEndDate}
              onChange={handleCustomEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              minDate={new Date()}
              placeholderText="날짜와 시간을 선택하세요"
              className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              wrapperClassName="w-full"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <select
            value={presetDuration}
            onChange={(e) => handlePresetDurationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100"
          >
            <option value="1day">1일 후 종료</option>
            <option value="3days">3일 후 종료</option>
            <option value="7days">7일 후 종료</option>
            <option value="unlimited">무제한</option>
          </select>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-neutral-400">
        최소 2개, 최대 10개의 옵션을 입력할 수 있습니다.
      </p>
    </div>
  );
}
