'use client';

import { useState } from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, BanknotesIcon } from '@heroicons/react/24/solid';

const pointHistory = [
  {
    id: 1,
    type: 'earn',
    description: '출석 체크 보상',
    amount: 100,
    date: '2025-07-21',
  },
  {
    id: 2,
    type: 'spend',
    description: "'진보논객' 크리에이터 구독",
    amount: -49,
    date: '2025-07-20',
  },
  {
    id: 3,
    type: 'earn',
    description: '이벤트 참여 보상',
    amount: 500,
    date: '2025-07-19',
  },
  {
    id: 4,
    type: 'earn',
    description: '출석 체크 보상',
    amount: 100,
    date: '2025-07-18',
  },
    {
    id: 5,
    type: 'spend',
    description: "'보수논객' 크리에이터 후원",
    amount: -100,
    date: '2025-07-17',
  },
];

const PointsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const currentPoints = pointHistory.reduce((acc, curr) => acc + curr.amount, 3000);

  const filteredHistory = pointHistory.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div className="p-4 md:p-6 text-black dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">포인트</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">서비스 내에서 활동하고 포인트를 사용해보세요.</p>
      </header>

      {/* Current Points & Charge Button */}
      <section className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold opacity-80">내 포인트</h2>
                <p className="text-4xl font-bold mt-1">{currentPoints.toLocaleString()} P</p>
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
            <button onClick={() => setActiveTab('all')} className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}>
              전체
            </button>
            <button onClick={() => setActiveTab('earn')} className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'earn' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500 hover:text-green-500'}`}>
              적립 내역
            </button>
            <button onClick={() => setActiveTab('spend')} className={`px-3 py-2 font-semibold transition-colors ${activeTab === 'spend' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              사용 내역
            </button>
          </nav>
        </div>

        <div className="space-y-3">
          {filteredHistory.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                {item.type === 'earn' ? (
                  <ArrowDownCircleIcon className="w-8 h-8 text-green-500" />
                ) : (
                  <ArrowUpCircleIcon className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${item.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} P
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PointsPage;
