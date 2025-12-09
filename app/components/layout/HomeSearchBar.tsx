'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const trendingKeywords = [
  '1위 이것은 테스트1 입니다.',
  '2위 이것은 테스트2 입니다.',
  '3위 이것은 테스트3 입니다.',
  '4위 이것은 테스트4 입니다.',
  '5위 이것은 테스트5 입니다.',
];

const HomeSearchBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingKeywords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full bg-[#EDEBF0] pb-10">
      <div className="max-w-content mx-auto flex justify-center">
        <div
          onClick={handleContainerClick}
          className="relative w-full max-w-3xl bg-white rounded-[20px] border border-neutral-200 flex items-center px-5 py-2 cursor-text shadow-sm hover:shadow-md transition-shadow"
        >
          {/* 입력 필드 */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder-transparent"
            placeholder="검색어를 입력하세요"
          />

          {/* 힌트 텍스트 (입력값이 없고 포커스가 아닐 때만 표시) */}
          {!inputValue && !isFocused && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span
                className={`text-[16px] text-neutral-400 transition-all duration-300 ${
                  isAnimating
                    ? 'opacity-0 -translate-y-2'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                {trendingKeywords[currentIndex]}
              </span>
            </div>
          )}

          {/* 검색 버튼 */}
          <button className="ml-3 p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Image
              src="/system_ico/search_black.svg"
              alt="검색"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSearchBar;
