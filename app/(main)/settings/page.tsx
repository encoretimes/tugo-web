'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import SecuritySection from './SecuritySection';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const router = useRouter();

  const tabs = [
    { id: 'account', name: '계정 설정', icon: UserCircleIcon },
    { id: 'notifications', name: '알림 설정', icon: BellIcon },
    { id: 'advanced', name: '고급 설정', icon: ShieldCheckIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-8">
            <ProfileSection />
            <div className="border-t border-gray-200 pt-8">
              <SecuritySection />
            </div>
          </div>
        );
      case 'notifications':
        return <NotificationSection />;
      case 'advanced':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                고급 설정
              </h3>
              <p className="text-sm text-gray-500">계정 관리 및 시스템 설정</p>
            </div>

            {/* Logout Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                로그아웃
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                현재 기기에서 로그아웃합니다
              </p>
              <button
                onClick={() => {
                  // Logout logic
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                로그아웃
              </button>
            </div>

            {/* Account Deletion Section */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h4 className="text-base font-medium text-red-900 mb-2">
                계정 삭제
              </h4>
              <p className="text-sm text-red-700 mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수
                없습니다
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                계정 삭제
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 text-black max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-2">
          계정, 알림 및 시스템 설정을 관리합니다
        </p>
      </header>

      {/* Tab navigation */}
      <nav className="flex gap-1 border-b border-gray-200 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <main>{renderContent()}</main>
    </div>
  );
};

export default SettingsPage;
