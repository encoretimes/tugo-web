'use client';

import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const SecuritySection = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  return (
    <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-md">
            <ShieldCheckIcon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-neutral-100">
              2단계 인증
            </h4>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
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
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isTwoFactorEnabled
              ? 'text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
              : 'text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
          }`}
        >
          {isTwoFactorEnabled ? '비활성화' : '활성화'}
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;
