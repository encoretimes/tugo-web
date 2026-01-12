'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import SecuritySection from './SecuritySection';
import ThemeSettings from '@/components/settings/ThemeSettings';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const router = useRouter();

  const tabs = [
    { id: 'account', name: '계정', icon: UserCircleIcon },
    { id: 'notifications', name: '알림', icon: BellIcon },
    { id: 'advanced', name: '고급', icon: Cog6ToothIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <ProfileSection />
            <SecuritySection />
          </div>
        );
      case 'notifications':
        return <NotificationSection />;
      case 'advanced':
        return (
          <div className="space-y-6">
            {/* Theme Settings */}
            <ThemeSettings />

            {/* Logout Section */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-neutral-100">
                    로그아웃
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                    현재 기기에서 로그아웃합니다
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/login');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>

            {/* Account Deletion Section */}
            <div className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/50 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-red-600 dark:text-red-400">
                    계정 삭제
                  </h4>
                  <p className="text-sm text-red-500/80 dark:text-red-400/70 mt-1">
                    모든 데이터가 영구적으로 삭제됩니다
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                  계정 삭제
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            설정
          </h1>
        </header>

        {/* Tab Navigation */}
        <nav className="flex gap-1 p-1 bg-gray-100 dark:bg-neutral-900 rounded-lg mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 shadow-sm'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default SettingsPage;
