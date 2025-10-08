'use client';

import { useState } from 'react';

const SecuritySection = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-3 border-b border-gray-200">
        보안
      </h2>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-base font-medium mb-4 text-gray-900">
          2단계 인증
        </h3>
        <div className="flex items-start justify-between p-5 bg-gray-50 border border-gray-300 max-w-2xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              상태: <span className={`${isTwoFactorEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                {isTwoFactorEnabled ? '활성화됨' : '비활성화됨'}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              계정 보안을 강화하려면 2단계 인증을 활성화하세요
            </p>
          </div>
          <button
            onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
            className={`ml-6 px-4 py-2 text-sm font-medium border ${
              isTwoFactorEnabled
                ? 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50'
                : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'
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
