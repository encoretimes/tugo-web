'use client';

import { LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const SecuritySection = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        비밀번호 및 보안
      </h2>

      {/* Change Password Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <LockClosedIcon className="w-5 h-5" />
          비밀번호 변경
        </h3>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 max-w-md"
        >
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              현재 비밀번호
            </label>
            <input
              type="password"
              id="current-password"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              새 비밀번호
            </label>
            <input
              type="password"
              id="new-password"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              새 비밀번호 확인
            </label>
            <input
              type="password"
              id="confirm-password"
              className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <ShieldCheckIcon className="w-5 h-5" />
          2단계 인증 (2FA)
        </h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-700">
          <div>
            <p className="font-medium">
              상태:
              <span
                className={`ml-2 font-bold ${
                  isTwoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isTwoFactorEnabled ? '활성화됨' : '비활성화됨'}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              계정 보안을 강화하려면 2단계 인증을 활성화하세요.
            </p>
          </div>
          <button
            onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              isTwoFactorEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900'
            }`}
          >
            {isTwoFactorEnabled ? '비활성화' : '활성화'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
