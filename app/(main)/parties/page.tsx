import React from 'react';
import PartyCard from './PartyCard';
import { PlusIcon } from '@heroicons/react/24/solid';

const myParties = [
  {
    id: 1,
    name: '대한민국 정책 토론방',
    description: '부동산, 교육, 외교 등 대한민국의 주요 정책에 대해 심도 깊게 토론합니다.',
    memberCount: 12500,
    bannerImageUrl: '/banners/policy.svg', // Replace with actual banner images
    isJoined: true,
  },
  {
    id: 2,
    name: '2030 정치 이슈',
    description: '청년 세대가 직면한 정치, 사회적 문제들을 논의하고 해결책을 모색합니다.',
    memberCount: 8700,
    bannerImageUrl: '/banners/youth.svg',
    isJoined: true,
  },
];

const recommendedParties = [
  {
    id: 3,
    name: '환경과 미래',
    description: '기후 변화, 지속 가능한 에너지 등 환경 문제에 관심 있는 사람들의 모임입니다.',
    memberCount: 5400,
    bannerImageUrl: '/banners/environment.svg',
  },
  {
    id: 4,
    name: '자유 시장 경제 포럼',
    description: '자유주의와 시장 경제 원칙에 입각하여 경제 현안을 분석하고 토론합니다.',
    memberCount: 9800,
    bannerImageUrl: '/banners/economy.svg',
  },
  {
    id: 5,
    name: '글로벌 외교/안보',
    description: '급변하는 국제 정세와 한반도 주변의 외교, 안보 이슈를 다룹니다.',
    memberCount: 7200,
    bannerImageUrl: '/banners/security.svg',
  },
    {
    id: 6,
    name: 'Tugo 공식 건의사항',
    description: 'Tugo 플랫폼의 발전과 개선을 위한 아이디어를 제안하고 토론하는 공간입니다.',
    memberCount: 21300,
    bannerImageUrl: '/banners/official.svg',
  },
];

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
