'use client';

import React from 'react';
import { Switch } from '@headlessui/react';
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from '@/hooks/useNotificationPreferences';
import { NotificationType } from '@/types/notification';

const NotificationSection = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreference = useUpdateNotificationPreference();

  const notificationLabels: Record<NotificationType, string> = {
    LIKE: '좋아요 알림',
    COMMENT: '댓글 알림',
    MENTION: '멘션 알림',
    SUBSCRIPTION: '구독 알림',
  };

  const notificationDescriptions: Record<NotificationType, string> = {
    LIKE: '다른 사용자가 내 게시물에 좋아요를 누르면 알림을 받습니다',
    COMMENT: '다른 사용자가 내 게시물에 댓글을 남기면 알림을 받습니다',
    MENTION: '다른 사용자가 나를 멘션하면 알림을 받습니다',
    SUBSCRIPTION: '다른 사용자가 나를 구독하면 알림을 받습니다',
  };

  const handleToggle = (type: NotificationType, currentValue: boolean) => {
    updatePreference.mutate({
      notificationType: type,
      enabled: !currentValue,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">알림 설정</h3>
        <p className="text-sm text-gray-500">
          받고 싶은 알림 유형을 선택하세요
        </p>
      </div>

      <div className="space-y-4">
        {preferences?.map((pref) => (
          <div
            key={pref.id}
            className="flex items-start justify-between py-4 border-b border-gray-200 last:border-0"
          >
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900">
                {notificationLabels[pref.notificationType]}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {notificationDescriptions[pref.notificationType]}
              </p>
            </div>
            <Switch
              checked={pref.enabled}
              onChange={() => handleToggle(pref.notificationType, pref.enabled)}
              disabled={updatePreference.isPending}
              className={`${
                pref.enabled ? 'bg-primary-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50`}
            >
              <span
                className={`${
                  pref.enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          알림 방식 (향후 지원 예정)
        </h4>
        <p className="text-sm text-gray-500">
          현재는 웹 알림만 지원합니다. 이메일 알림 기능은 추후 업데이트될
          예정입니다.
        </p>
      </div>
    </div>
  );
};

export default NotificationSection;
