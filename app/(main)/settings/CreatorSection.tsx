'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api-client';
import { useToastStore } from '@/store/toastStore';
import ConfirmModal from '@/components/modals/ConfirmModal';

const CreatorSection = () => {
  const { user, setUser } = useUserStore();
  const { addToast } = useToastStore();
  const [isConverting, setIsConverting] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  const [error, setError] = useState('');
  const [postCount, setPostCount] = useState<number | null>(null);
  const [isLoadingPostCount, setIsLoadingPostCount] = useState(false);

  // Creator인 경우 게시물 수 조회
  useEffect(() => {
    const fetchPostCount = async () => {
      if (user?.hasCreator && user?.username) {
        setIsLoadingPostCount(true);
        try {
          const profileData = await apiClient.get<{
            stats: { posts: number };
          }>(`/api/v1/profiles/${user.username}`);
          setPostCount(profileData.stats.posts);
        } catch (err) {
          console.error('Failed to fetch post count:', err);
          setPostCount(null);
        } finally {
          setIsLoadingPostCount(false);
        }
      }
    };

    fetchPostCount();
  }, [user?.hasCreator, user?.username]);

  const handleConvertToCreator = async () => {
    if (!user?.username) {
      setError('username을 먼저 설정해주세요');
      return;
    }

    setIsConverting(true);
    setError('');
    try {
      const response = await apiClient.post<{
        id: number;
        email: string;
        name: string;
        role: string;
        createdAt: string;
        updatedAt: string;
        hasCreator: boolean;
        creatorId: number | null;
        username: string | null;
      }>('/api/v1/members/me/convert-to-creator');

      // User 정보 업데이트
      setUser({
        ...user,
        role: response.role,
        hasCreator: response.hasCreator,
        creatorId: response.creatorId,
      });

      setShowConvertConfirm(false);
      addToast(
        '크리에이터로 전환되었습니다! 이제 게시물을 작성할 수 있습니다.',
        'success'
      );
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
        id: number;
        email: string;
        name: string;
        role: string;
        createdAt: string;
        updatedAt: string;
        hasCreator: boolean;
        creatorId: number | null;
        username: string | null;
      }>('/api/v1/members/me/revert-from-creator');

      // User 정보 업데이트
      if (user) {
        setUser({
          ...user,
          role: response.role,
          hasCreator: response.hasCreator,
          creatorId: response.creatorId,
        });
      }

      setShowRevertConfirm(false);
      addToast('일반 회원으로 복귀했습니다', 'success');
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
              크리에이터로 전환하면 게시물을 작성하고 구독자를 관리할 수
              있습니다. 기본 크리에이터 계정은 무료로 전환할 수 있습니다.
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

            <button
              onClick={() => setShowConvertConfirm(true)}
              disabled={!user?.username}
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              크리에이터로 전환
            </button>
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
              현재 크리에이터 계정을 사용 중입니다. 게시물을 작성하고 구독자를
              관리할 수 있습니다.
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

              {/* 게시물 수 표시 */}
              {isLoadingPostCount ? (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-300">
                  <p className="text-sm text-gray-600">게시물 수 확인 중...</p>
                </div>
              ) : (
                postCount !== null && (
                  <div
                    className={`mb-4 p-4 border ${
                      postCount === 0
                        ? 'bg-green-50 border-green-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      현재 게시물 수: {postCount}개
                    </p>
                    {postCount > 0 && (
                      <p className="text-sm text-gray-700 mt-1">
                        게시물을 모두 삭제한 후 복귀할 수 있습니다
                      </p>
                    )}
                  </div>
                )
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-300">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={() => setShowRevertConfirm(true)}
                disabled={postCount === null || postCount > 0}
                className="px-6 py-2.5 border-2 border-gray-900 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:border-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                일반 회원으로 복귀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Creator Confirm Modal */}
      <ConfirmModal
        isOpen={showConvertConfirm}
        onClose={() => setShowConvertConfirm(false)}
        onConfirm={handleConvertToCreator}
        title="크리에이터로 전환"
        description="크리에이터로 전환하시겠습니까?\n전환 후 게시물을 작성하고 구독자를 관리할 수 있습니다."
        confirmText="전환"
        confirmButtonClass="bg-gray-900 hover:bg-gray-800 text-white"
        isLoading={isConverting}
      />

      {/* Revert to Member Confirm Modal */}
      <ConfirmModal
        isOpen={showRevertConfirm}
        onClose={() => setShowRevertConfirm(false)}
        onConfirm={handleRevertFromCreator}
        title="일반 회원으로 복귀"
        description="정말로 일반 회원으로 복귀하시겠습니까?\n게시물이 있는 경우 복귀할 수 없습니다."
        confirmText="복귀"
        confirmButtonClass="bg-gray-900 hover:bg-gray-800 text-white"
        isLoading={isReverting}
      />
    </div>
  );
};

export default CreatorSection;
