'use client';

import { useState, useEffect, useCallback } from 'react';
import { Switch } from '@headlessui/react';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';
import {
  isPushSupported,
  getPushPermissionStatus,
  subscribeToPush,
  unsubscribeFromPush,
  isPushEnabled,
  isPushServiceAvailable,
} from '@/services/push';

export default function PushNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supported = isPushSupported();
      setIsSupported(supported);

      if (!supported) {
        setIsLoading(false);
        return;
      }

      // 서버 Push 서비스 상태 확인
      const serviceAvailable = await isPushServiceAvailable();
      setIsServiceAvailable(serviceAvailable);

      if (!serviceAvailable) {
        setIsLoading(false);
        return;
      }

      // 권한 상태 확인
      const permission = getPushPermissionStatus();
      setPermissionDenied(permission === 'denied');

      // 현재 구독 상태 확인
      const enabled = await isPushEnabled();
      setIsEnabled(enabled);
    } catch (e) {
      console.error('Failed to check push status:', e);
      setError('상태 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleToggle = async (enabled: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      if (enabled) {
        await subscribeToPush();
        setIsEnabled(true);
      } else {
        await unsubscribeFromPush();
        setIsEnabled(false);
      }
    } catch (e) {
      console.error('Push toggle failed:', e);
      setError('설정 변경에 실패했습니다.');
      // 상태 롤백
      setIsEnabled(!enabled);
    } finally {
      setIsLoading(false);
      // 상태 다시 확인
      const permission = getPushPermissionStatus();
      setPermissionDenied(permission === 'denied');
    }
  };

  if (isLoading && !isSupported) {
    return (
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-600 dark:border-neutral-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <BellSlashIcon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            이 브라우저는 푸시 알림을 지원하지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!isServiceAvailable) {
    return (
      <div className="bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <BellSlashIcon className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            푸시 알림 서비스가 준비 중입니다.
          </p>
        </div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <BellSlashIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              푸시 알림이 차단되었습니다
            </p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
              브라우저 설정에서 알림을 허용해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-md">
            {isEnabled ? (
              <BellIcon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
            ) : (
              <BellSlashIcon className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-neutral-100">
              푸시 알림
            </h4>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              새 쪽지와 알림을 즉시 받아보세요
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onChange={handleToggle}
          disabled={isLoading}
          className={`${
            isEnabled
              ? 'bg-neutral-900 dark:bg-neutral-100'
              : 'bg-gray-200 dark:bg-neutral-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 disabled:opacity-50`}
        >
          <span
            className={`${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-950 transition-transform shadow-sm`}
          />
        </Switch>
      </div>

      {error && (
        <div className="px-5 pb-5">
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
