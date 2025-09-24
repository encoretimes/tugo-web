'use client';

import { useState } from 'react';
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid';
import { usePoints } from '@/hooks/usePoints';

const PointsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { data: pointHistory, isLoading, error } = usePoints();

  const currentPoints =
    pointHistory?.reduce((acc, curr) => acc + curr.amount, 3000) ?? 3000;

  const filteredHistory = pointHistory?.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const renderHistory = () => {
    if (isLoading)
      return <div className="text-center">포인트 내역을 불러오는 중...</div>;
    if (error)
      return (
        <div className="text-center text-red-500">오류가 발생했습니다.</div>
      );
    if (!filteredHistory || filteredHistory.length === 0) {
      return (
        <div className="text-center text-gray-500">포인트 내역이 없습니다.</div>
      );
    }
    return (
      <div className="space-y-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4">
              {item.type === 'earn' ? (
                <ArrowDownCircleIcon className="w-8 h-8 text-green-500" />
              ) : (
                <ArrowUpCircleIcon className="w-8 h-8 text-red-500" />
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </p>
              </div>
            </div>
            <p
              className={`text-lg font-bold ${item.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}
            >
              {item.amount > 0 ? '+' : ''}
              {item.amount.toLocaleString()} P
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 text-black dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">포인트</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          서비스 내에서 활동하고 포인트를 사용해보세요.
        </p>
      </header>

      {/* Current Points & Charge Button */}
      <section className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold opacity-80">내 포인트</h2>
            <p className="text-4xl font-bold mt-1">
              {currentPoints.toLocaleString()} P
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-gray-100 transition-colors">
            <BanknotesIcon className="w-6 h-6" />
            <span>충전하기</span>
          </button>
        </div>
      </section>

      {/* Points History */}
      <section>
        <h2 className="text-xl font-bold mb-4">포인트 내역</h2>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('earn')}
              className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'earn' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500 hover:text-green-500'}`}
            >
              적립 내역
            </button>
            <button
              onClick={() => setActiveTab('spend')}
              className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'spend' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              사용 내역
            </button>
          </nav>
        </div>
        {renderHistory()}
      </section>
    </div>
  );
};

export default PointsPage;
