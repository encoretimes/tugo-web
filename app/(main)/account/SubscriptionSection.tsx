'use client';

import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const subscribedCreators = [
  {
    id: 1,
    name: '진보논객',
    handle: 'progressive_master',
    profileImageUrl: 'https://i.pravatar.cc/150?u=progressive_master',
    tier: '베이직',
    monthlyPrice: 4900,
  },
  {
    id: 2,
    name: '보수논객',
    handle: 'conservative_critic',
    profileImageUrl: 'https://i.pravatar.cc/150?u=conservative_critic',
    tier: '프리미엄',
    monthlyPrice: 9900,
  },
  {
    id: 3,
    name: '중도정치 분석가',
    handle: 'neutral_analyst',
    profileImageUrl: 'https://i.pravatar.cc/150?u=neutral_analyst',
    tier: '베이직',
    monthlyPrice: 4900,
  },
];

const SubscriptionSection = () => {
  const totalMonthlyCost = subscribedCreators.reduce(
    (sum, creator) => sum + creator.monthlyPrice,
    0
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-3 border-b border-gray-200">
        구독 관리
      </h2>

      <div className="space-y-3">
        {subscribedCreators.map((creator) => (
          <div
            key={creator.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-gray-300"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              {creator.profileImageUrl ? (
                <Image
                  src={creator.profileImageUrl}
                  alt={creator.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 border border-gray-300">
                  <UserIcon className="h-7 w-7 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{creator.name}</div>
                <div className="text-sm text-gray-500">@{creator.handle}</div>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {creator.monthlyPrice.toLocaleString()}원/월
                </div>
                <div className="text-sm text-gray-500">{creator.tier} 등급</div>
              </div>
              <button className="px-4 py-2 text-sm font-medium border border-gray-400 bg-white hover:bg-gray-50 text-gray-700">
                취소
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-gray-50 border border-gray-300 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900">월간 총 구독료</h3>
        <p className="text-lg font-semibold text-gray-900">
          {totalMonthlyCost.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSection;
