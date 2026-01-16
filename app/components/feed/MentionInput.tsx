'use client';

import React, { useState, useRef, useEffect } from 'react';
import { searchMembers } from '@/services/members';
import { MemberSearchResult } from '@/types/post';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export default function MentionInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = '내용을 입력하세요',
  rows = 4,
  disabled = false,
  className = '',
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MemberSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 멘션 감지 및 검색
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    onChange(newValue);

    // @ 기호 이전 위치 찾기
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      // @ 이전 문자가 없거나 공백인지 확인
      const charBeforeAt =
        lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';
      const isValidMention = lastAtIndex === 0 || /\s/.test(charBeforeAt);

      if (isValidMention) {
        const query = textBeforeCursor.substring(lastAtIndex + 1);
        // 공백이나 특수문자가 있으면 멘션 모드 종료
        if (!/[\s@]/.test(query)) {
          setMentionStart(lastAtIndex);
          setSearchQuery(query);
          debouncedSearch(query);
          return;
        }
      }
    }

    // 멘션 모드 종료
    setShowSuggestions(false);
    setMentionStart(null);
    setSuggestions([]);
  };

  // 디바운스된 검색
  const debouncedSearch = (query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (query.length >= 1) {
        try {
          const results = await searchMembers(query);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
          setSelectedIndex(0);
        } catch (error) {
          console.error('Failed to search members:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  // 멘션 선택
  const insertMention = (user: MemberSearchResult) => {
    if (mentionStart === null) return;

    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + searchQuery.length + 1);
    const newValue = `${before}@${user.username} ${after}`;

    onChange(newValue);
    setShowSuggestions(false);
    setMentionStart(null);
    setSuggestions([]);

    // 커서를 멘션 뒤로 이동
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = mentionStart + user.username.length + 2;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? suggestions.length - 1 : prev - 1
        );
        break;
      case 'Enter':
        if (showSuggestions) {
          e.preventDefault();
          insertMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setMentionStart(null);
        setSuggestions([]);
        break;
    }
  };

  // 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex, showSuggestions]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={className}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />

      {/* 멘션 제안 드롭다운 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 max-h-60 w-full max-w-xs overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-900 dark:ring-neutral-700"
          style={{
            bottom: 'auto',
            top: '100%',
          }}
        >
          {suggestions.map((user, index) => (
            <button
              key={user.memberId}
              onClick={() => insertMention(user)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 ${
                index === selectedIndex ? 'bg-gray-100 dark:bg-neutral-800' : ''
              }`}
            >
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-neutral-700">
                  <UserIcon className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-900 dark:text-neutral-100">
                  {user.displayName}
                </span>
                <span className="text-gray-500 dark:text-neutral-400">
                  @{user.username}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
