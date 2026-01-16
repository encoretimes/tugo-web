'use client';

import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const SecuritySection = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-gray-100 p-2 dark:bg-neutral-800">
            <ShieldCheckIcon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-neutral-100">
              2단계 인증
            </h4>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
              {isTwoFactorEnabled ? (
                <span className="text-green-600 dark:text-green-400">
                  활성화됨
                </span>
              ) : (
                '계정 보안을 강화하세요'
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isTwoFactorEnabled
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
          }`}
        >
          {isTwoFactorEnabled ? '비활성화' : '활성화'}
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;
