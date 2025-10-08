'use client';

import { useState } from 'react';
import {
  UserCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import ProfileSection from './ProfileSection';
import CreatorSection from './CreatorSection';
import SecuritySection from './SecuritySection';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: '프로필', icon: UserCircleIcon },
    { id: 'creator', name: '크리에이터', icon: UserCircleIcon },
    { id: 'security', name: '보안', icon: LockClosedIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'creator':
        return <CreatorSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="p-4 md:p-6 text-black">
      <header className="border-b border-gray-300 pb-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">계정 설정</h1>
        <p className="text-gray-600 mt-2 text-sm">
          계정 정보를 관리하고 설정을 변경합니다
        </p>
      </header>
      <div className="flex flex-col">
        {/* Tab navigation */}
        <nav className="flex border-b border-gray-300 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <main className="flex-1">
          <div className="bg-white p-8 border border-gray-300">
            {renderContent()}
          </div>
          <div className="mt-6 p-6 bg-gray-50 border border-gray-300">
            <h3 className="text-base font-semibold text-gray-900 mb-3">계정 관리</h3>
            <button className="px-5 py-2.5 border border-gray-400 bg-white hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
              로그아웃
            </button>
          </div>
          <div className="mt-6 p-6 bg-white border-2 border-red-300">
            <h3 className="text-base font-semibold text-gray-900 mb-2">회원 탈퇴</h3>
            <p className="text-gray-600 text-sm mb-4">
              계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <button className="px-5 py-2.5 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
              회원 탈퇴 진행
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
