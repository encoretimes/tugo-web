'use client';

import React from 'react';
import { Switch } from '@headlessui/react';
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from '@/hooks/useNotificationPreferences';
import { NotificationType } from '@/types/notification';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  AtSymbolIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

const NotificationSection = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreference = useUpdateNotificationPreference();

  const notificationConfig: Record<
    NotificationType,
    { label: string; description: string; icon: React.ElementType }
  > = {
    LIKE: {
      label: '좋아요',
      description: '게시물에 좋아요를 받으면 알림',
      icon: HeartIcon,
    },
    COMMENT: {
      label: '댓글',
      description: '게시물에 댓글이 달리면 알림',
      icon: ChatBubbleLeftIcon,
    },
    MENTION: {
      label: '멘션',
      description: '다른 사용자가 나를 멘션하면 알림',
      icon: AtSymbolIcon,
    },
    SUBSCRIPTION: {
      label: '구독',
      description: '새로운 구독자가 생기면 알림',
      icon: UserPlusIcon,
    },
  };

  const handleToggle = (type: NotificationType, currentValue: boolean) => {
    updatePreference.mutate({
      notificationType: type,
      enabled: !currentValue,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-600 dark:border-neutral-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        {preferences?.map((pref, index) => {
          const config = notificationConfig[pref.notificationType];
          const Icon = config.icon;
          return (
            <div
              key={pref.id}
              className={`flex items-center justify-between p-5 ${
                index !== 0 ? 'border-t border-gray-100 dark:border-neutral-800' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-md">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                    {config.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                    {config.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={pref.enabled}
                onChange={() => handleToggle(pref.notificationType, pref.enabled)}
                disabled={updatePreference.isPending}
                className={`${
                  pref.enabled ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-gray-200 dark:bg-neutral-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 disabled:opacity-50`}
              >
                <span
                  className={`${
                    pref.enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-950 transition-transform shadow-sm`}
                />
              </Switch>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-5">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          이메일 알림 기능은 추후 업데이트될 예정입니다
        </p>
      </div>
    </div>
  );
};

export default NotificationSection;
