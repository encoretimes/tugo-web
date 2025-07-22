import React from 'react';
import PartyCard from './PartyCard';
import { PlusIcon } from '@heroicons/react/24/solid';

import partiesData from '@/data/parties.json';

const { myParties, recommendedParties } = partiesData;

const PartiesPage = () => {
  return (
    <div className="p-4 md:p-6 text-black dark:text-white">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold">파티</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">관심 주제에 대한 커뮤니티에 참여해보세요.</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-bold">
            <PlusIcon className="w-5 h-5" />
            <span>파티 만들기</span>
        </button>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">내가 가입한 파티</h2>
        {myParties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myParties.map((party) => (
              <PartyCard key={party.id} party={party} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
            <h3 className="text-lg font-semibold">아직 가입한 파티가 없습니다.</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">추천 파티에 가입하여 활동을 시작해보세요!</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">추천 파티</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedParties.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PartiesPage;
