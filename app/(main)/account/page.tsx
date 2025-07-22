'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  CreditCardIcon,
  LockClosedIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import ProfileSection from './ProfileSection';

import SubscriptionSection from './SubscriptionSection';

import SecuritySection from './SecuritySection';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: '프로필', icon: UserCircleIcon },
    { id: 'subscription', name: '구독', icon: CreditCardIcon },
    { id: 'security', name: '비밀번호 및 보안', icon: LockClosedIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="p-4 md:p-6 text-black dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">내 계정</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">계정 정보를 관리하고 설정을 변경합니다.</p>
      </header>
      <div className="flex flex-col">
        {/* Tab navigation */}
        <nav className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <main className="flex-1">
          <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            {renderContent()}
          </div>
           <div className="mt-8 p-6 rounded-xl bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800">
             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">계정 관리</h3>
             <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors font-medium">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>로그아웃</span>
                </button>
             </div>
           </div>
           <div className="mt-8 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
             <div className="flex gap-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500 dark:text-red-400 flex-shrink-0"/>
                <div>
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300">회원 탈퇴</h3>
                    <p className="text-red-600 dark:text-red-400 mt-1">계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
                    <button className="mt-4 w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-bold">
                        회원 탈퇴 진행
                    </button>
                </div>
             </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
