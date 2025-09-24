'use client';

import { CreditCardIcon, UserIcon } from '@heroicons/react/24/solid';
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
      <h2 className="text-2xl font-bold mb-6 text-gray-900">구독 관리</h2>

      <div className="space-y-4">
        {subscribedCreators.map((creator) => (
          <div
            key={creator.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              {creator.profileImageUrl ? (
                <Image
                  src={creator.profileImageUrl}
                  alt={creator.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div>
                <div className="font-bold text-gray-800">{creator.name}</div>
                <div className="text-sm text-gray-500">@{creator.handle}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right">
                <div className="font-semibold">
                  {creator.monthlyPrice.toLocaleString()}원 / 월
                </div>
                <div className="text-sm text-primary-500 font-medium">
                  {creator.tier} 등급
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100">
                구독 취소
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCardIcon className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            월간 총 구독료
          </h3>
        </div>
        <p className="text-xl font-bold text-primary-600">
          {totalMonthlyCost.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSection;
