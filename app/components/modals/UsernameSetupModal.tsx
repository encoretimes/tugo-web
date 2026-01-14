'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useUserStore } from '@/store/userStore';
import { updateMyProfile } from '@/services/profiles';

interface UsernameSetupModalProps {
  isOpen: boolean;
  onClose?: (username: string) => void;
}

export default function UsernameSetupModal({
  isOpen,
  onClose,
}: UsernameSetupModalProps) {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Username 유효성 검사 (영문, 숫자, 언더스코어만 허용)
  const validateUsername = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(value);
  };

  // Nickname 유효성 검사 (1-20자, 공백만 있는 것은 불허)
  const validateNickname = (
    value: string
  ): { valid: boolean; error: string } => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, error: '닉네임을 입력해주세요' };
    }
    if (trimmed.length < 1 || trimmed.length > 20) {
      return { valid: false, error: '닉네임은 1-20자 사이여야 합니다' };
    }
    return { valid: true, error: '' };
  };

  // Nickname 변경 핸들러
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (value.trim()) {
      const { valid, error } = validateNickname(value);
      setNicknameError(valid ? '' : error);
    } else {
      setNicknameError('');
    }
  };

  // 전체 폼 유효성 확인
  const isFormValid =
    isAvailable === true && nickname.trim().length >= 1 && !nicknameError;

  // Username 중복 확인
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setError('');
      return;
    }

    if (!validateUsername(username)) {
      setIsAvailable(false);
      setError('영문, 숫자, 언더스코어(_)만 사용 가능합니다 (3-20자)');
      return;
    }

    const checkUsername = async () => {
      setIsChecking(true);
      setError('');
      try {
        const available = await apiClient.get<boolean>(
          `/api/v1/members/check-username?username=${username}`
        );
        setIsAvailable(available);
        if (!available) {
          setError('이미 사용 중인 사용자명입니다');
        }
      } catch {
        setError('사용자명 확인 중 오류가 발생했습니다');
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Username 설정
      await apiClient.put(`/api/v1/members/me/username?username=${username}`);

      // 2. Profile 닉네임 설정
      await updateMyProfile({ displayName: nickname.trim() });

      // User 정보 업데이트 (Zustand store)
      if (user) {
        setUser({
          ...user,
          username: username,
          displayName: nickname.trim(),
        });
      }

      // React Query 캐시 무효화하여 최신 사용자 정보 다시 가져오기
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      // 성공 시 모달 닫기 - username을 파라미터로 전달
      if (onClose) {
        onClose(username);
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError('프로필 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          // username이 설정되지 않았다면 닫을 수 없음
          // 설정 완료 후에만 닫을 수 있음
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
                {/* 헤더 영역 */}
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-gray-900 dark:text-neutral-100 mb-2"
                  >
                    프로필 설정
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-600 dark:text-neutral-400">
                    Tugo에서 사용할 프로필을 설정해주세요
                  </Dialog.Description>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* 닉네임 입력 필드 */}
                  <div className="mb-5">
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
                    >
                      닉네임
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => handleNicknameChange(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 placeholder:text-gray-400 dark:placeholder:text-neutral-500 ${
                          nicknameError
                            ? 'border-red-300 dark:border-red-500'
                            : nickname.trim()
                              ? 'border-green-300 dark:border-green-500'
                              : 'border-gray-300 dark:border-neutral-600'
                        }`}
                        placeholder="다른 사용자에게 보여질 이름"
                        required
                        maxLength={20}
                      />
                      {nickname.trim() && !nicknameError && (
                        <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 transition-all duration-200 ease-in-out" />
                      )}
                    </div>
                    {nicknameError && (
                      <p className="mt-2 text-sm text-red-600 transition-opacity duration-200 ease-in-out">
                        {nicknameError}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                      한글, 영문, 숫자 등 자유롭게 사용 가능 (최대 20자)
                    </p>
                  </div>

                  {/* 사용자명 입력 필드 */}
                  <div className="mb-5">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2"
                    >
                      사용자 아이디
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400">
                        @
                      </span>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase())
                        }
                        className={`w-full pl-8 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 placeholder:text-gray-400 dark:placeholder:text-neutral-500 ${
                          isAvailable === true
                            ? 'border-green-300 dark:border-green-500'
                            : isAvailable === false
                              ? 'border-red-300 dark:border-red-500'
                              : 'border-gray-300 dark:border-neutral-600'
                        }`}
                        placeholder="username"
                        required
                        minLength={3}
                        maxLength={20}
                        pattern="[a-zA-Z0-9_]{3,20}"
                      />
                      {isChecking && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 ease-in-out">
                          <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                      )}
                      {!isChecking && isAvailable === true && (
                        <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 transition-all duration-200 ease-in-out animate-fade-in" />
                      )}
                      {!isChecking && isAvailable === false && (
                        <XMarkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 transition-all duration-200 ease-in-out animate-fade-in" />
                      )}
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600 transition-opacity duration-200 ease-in-out animate-fade-in">
                        {error}
                      </p>
                    )}
                    {!error && isAvailable === true && (
                      <p className="mt-2 text-sm text-green-600 transition-opacity duration-200 ease-in-out animate-fade-in">
                        사용 가능한 아이디입니다
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                      프로필 URL에 사용됩니다 (3-20자, 영문/숫자/언더스코어)
                    </p>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          설정 중...
                        </span>
                      ) : (
                        '시작하기'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
