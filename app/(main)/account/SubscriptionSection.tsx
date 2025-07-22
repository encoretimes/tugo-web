'use client';

import { CreditCardIcon, UserIcon } from '@heroicons/react/24/solid';

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
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        구독 관리
      </h2>

      <div className="space-y-4">
        {subscribedCreators.map((creator) => (
          <div
            key={creator.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              {creator.profileImageUrl ? (
                <img
                  src={creator.profileImageUrl}
                  alt={creator.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-700">
                  <UserIcon className="h-8 w-8 text-gray-500 dark:text-neutral-400" />
                </div>
              )}
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200">{creator.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">@{creator.handle}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="text-right">
                    <div className="font-semibold">{creator.monthlyPrice.toLocaleString()}원 / 월</div>
                    <div className="text-sm text-blue-500 font-medium">{creator.tier} 등급</div>
               </div>
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700">
                구독 취소
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <CreditCardIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            월간 총 구독료
            </h3>
        </div>
        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {totalMonthlyCost.toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSection;
