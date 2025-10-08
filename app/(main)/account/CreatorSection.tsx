'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';

const CreatorSection = () => {
  const { user, setUser } = useUserStore();
  const [isConverting, setIsConverting] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleConvertToCreator = async () => {
    if (!user?.username) {
      setError('username을 먼저 설정해주세요');
      return;
    }

    setIsConverting(true);
    setError('');
    try {
      const response = await apiClient.post<{
        hasCreator: boolean;
        creatorId: number | null;
      }>('/api/v1/members/me/convert-to-creator');

      // User 정보 업데이트
      setUser({
        ...user,
        hasCreator: response.hasCreator,
        creatorId: response.creatorId,
      });

      setShowConvertConfirm(false);
      alert('크리에이터로 전환되었습니다! 이제 게시물을 작성할 수 있습니다.');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || '크리에이터 전환에 실패했습니다'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleRevertFromCreator = async () => {
    setIsReverting(true);
    setError('');
    try {
      const response = await apiClient.post<{
        hasCreator: boolean;
        creatorId: number | null;
      }>('/api/v1/members/me/revert-from-creator');

      // User 정보 업데이트
      if (user) {
        setUser({
          ...user,
          hasCreator: response.hasCreator,
          creatorId: response.creatorId,
        });
      }

      setShowRevertConfirm(false);
      alert('일반 회원으로 복귀했습니다');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || '일반 회원 복귀에 실패했습니다'
      );
    } finally {
      setIsReverting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 pb-3 border-b border-gray-200">
        크리에이터
      </h2>

      {!user?.hasCreator ? (
        // 크리에이터가 아닌 경우
        <div className="bg-white p-6 border-2 border-gray-300">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">
              크리에이터 전환
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              크리에이터로 전환하면 게시물을 작성하고 구독자를 관리할 수 있습니다. 기본 크리에이터 계정은 무료로 전환할 수 있습니다.
            </p>

            {!user?.username && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300">
                <p className="text-sm text-gray-800">
                  크리에이터로 전환하려면 먼저 username을 설정해주세요
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-300">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {!showConvertConfirm ? (
              <button
                onClick={() => setShowConvertConfirm(true)}
                disabled={!user?.username}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                크리에이터로 전환
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-5 bg-gray-50 border border-gray-300">
                  <p className="text-sm text-gray-800 mb-4">
                    크리에이터로 전환하시겠습니까?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleConvertToCreator}
                      disabled={isConverting}
                      className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300"
                    >
                      {isConverting ? '전환 중...' : '확인'}
                    </button>
                    <button
                      onClick={() => setShowConvertConfirm(false)}
                      disabled={isConverting}
                      className="px-5 py-2.5 border border-gray-400 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 크리에이터인 경우
        <div>
          <div className="bg-white p-6 border-2 border-green-600 mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-2">
              크리에이터 활성화됨
            </h3>
            <p className="text-sm text-gray-600">
              현재 크리에이터 계정을 사용 중입니다. 게시물을 작성하고 구독자를 관리할 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-6 border-2 border-gray-300">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                일반 회원으로 복귀
              </h3>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                크리에이터 권한을 해제하고 일반 회원으로 복귀할 수 있습니다.
              </p>
              <p className="text-sm text-red-700 mb-4">
                주의: 게시물이 0개일 때만 복귀할 수 있습니다
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-300">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {!showRevertConfirm ? (
                <button
                  onClick={() => setShowRevertConfirm(true)}
                  className="px-6 py-2.5 border-2 border-gray-900 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50"
                >
                  일반 회원으로 복귀
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-5 bg-gray-50 border border-gray-300">
                    <p className="text-sm text-gray-800 mb-1">
                      정말로 일반 회원으로 복귀하시겠습니까?
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      게시물이 있는 경우 복귀할 수 없습니다
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRevertFromCreator}
                        disabled={isReverting}
                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300"
                      >
                        {isReverting ? '복귀 중...' : '복귀'}
                      </button>
                      <button
                        onClick={() => setShowRevertConfirm(false)}
                        disabled={isReverting}
                        className="px-5 py-2.5 border border-gray-400 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorSection;
