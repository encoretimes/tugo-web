'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';
import { useUserStore } from '@/store/userStore';

interface UsernameSetupModalProps {
  isOpen: boolean;
  onClose?: () => void; // username 설정 전에는 닫을 수 없음
}

export default function UsernameSetupModal({
  isOpen,
  onClose,
}: UsernameSetupModalProps) {
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Username 유효성 검사 (영문, 숫자, 언더스코어만 허용)
  const validateUsername = (value: string): boolean => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(value);
  };

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

    if (!isAvailable) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.put(
        `/api/v1/members/me/username?username=${username}`
      );

      // User 정보 업데이트
      if (user) {
        setUser({
          ...user,
          username: username,
        });
      }

      // 모달 닫기 (설정 완료)
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Username update error:', err);
      setError('사용자명 설정에 실패했습니다');
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 mb-2"
                >
                  사용자명 설정
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 mb-6">
                  Tugo에서 사용할 고유한 사용자명을 설정해주세요.
                  <br />
                  사용자명은 프로필 URL에 사용됩니다.
                </Dialog.Description>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      사용자명
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        className="w-full pl-8 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="username"
                        required
                        minLength={3}
                        maxLength={20}
                        pattern="[a-zA-Z0-9_]{3,20}"
                      />
                      {isChecking && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                      )}
                      {!isChecking && isAvailable === true && (
                        <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {!isChecking && isAvailable === false && (
                        <XMarkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    {!error && isAvailable === true && (
                      <p className="mt-2 text-sm text-green-600">
                        사용 가능한 사용자명입니다
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      3-20자, 영문/숫자/언더스코어(_)만 사용 가능
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={!isAvailable || isSubmitting}
                      className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? '설정 중...' : '설정 완료'}
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
