'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  MapPinIcon,
  LinkIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ShareIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { UserIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import EditProfileModal from '@/components/modals/EditProfileModal';
import ConfirmModal from '@/components/modals/ConfirmModal';
import Post from '@/components/feed/Post';
import { useBookmarks } from '@/hooks/useBookmarks';
import PostSkeleton from '@/components/feed/PostSkeleton';
import {
  useSubscriptionStatus,
  useSubscriberCount,
  useSubscribeMutation,
  useUnsubscribeMutation,
} from '@/hooks/useSubscription';
import SubscribersModal from '@/components/modals/SubscribersModal';

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  // URL에서 @ 기호 제거 (/@sangminn200 -> sangminn200)
  const rawUsername = params.username as string;
  const username = rawUsername.startsWith('@')
    ? rawUsername.slice(1)
    : rawUsername;
  const { user: currentUser } = useUserStore();
  const { addToast } = useToastStore();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch,
  } = useUser(username);

  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'archives'>(
    'posts'
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  // 보관함 데이터 가져오기 (현재 사용자의 프로필일 때만)
  const {
    data: bookmarksData,
    isLoading: isBookmarksLoading,
    refetch: refetchBookmarks,
  } = useBookmarks(0, 20);

  // 구독 관련 데이터
  const memberId = user?.id ? Number(user.id) : 0;
  const { data: subscriptionStatus } = useSubscriptionStatus(memberId);
  const { data: subscriberCount } = useSubscriberCount(memberId);
  const subscribeMutation = useSubscribeMutation();
  const unsubscribeMutation = useUnsubscribeMutation();

  const isOwnProfile = currentUser && currentUser.username === username;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 날짜 포맷팅
  const formatJoinedDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    } catch {
      return dateString.toString().split('T')[0];
    }
  };

  // 프로필 공유하기
  const handleShare = async () => {
    if (!user) return;

    const profileUrl = `${window.location.origin}/@${username}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} (@${user.username})`,
          text: `${user.name}님의 프로필을 확인해보세요`,
          url: profileUrl,
        });
      } else {
        // Fallback: URL 복사
        await navigator.clipboard.writeText(profileUrl);
        addToast('프로필 링크가 복사되었습니다!', 'success');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('공유 실패:', error);
    }
  };

  // 쪽지 보내기
  const handleSendNote = () => {
    if (!user) return;
    router.push(`/notes?userId=${user.id}`);
  };

  // 구독하기
  const handleSubscribe = async () => {
    if (!memberId) return;

    try {
      await subscribeMutation.mutateAsync({ targetMemberId: memberId });
      addToast('구독되었습니다!', 'success');
    } catch (error) {
      console.error('구독 실패:', error);
      addToast('구독에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  // 구독 취소 확인
  const handleUnsubscribeClick = () => {
    setShowUnsubscribeConfirm(true);
  };

  // 구독 취소 실행
  const handleUnsubscribeConfirm = async () => {
    if (!subscriptionStatus?.subscriptionId || !memberId) return;

    try {
      await unsubscribeMutation.mutateAsync({
        subscriptionId: subscriptionStatus.subscriptionId,
        targetMemberId: memberId,
      });
      setShowUnsubscribeConfirm(false);
      addToast('구독이 취소되었습니다.', 'info');
    } catch (error) {
      console.error('구독 취소 실패:', error);
      addToast('구독 취소에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 animate-in slide-in-from-right duration-300">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500">프로필을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 animate-in slide-in-from-right duration-300">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">
              사용자를 찾을 수 없습니다.
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const posts = user.posts || [];
  const mediaItems =
    posts?.filter((post) => post.mediaUrls && post.mediaUrls.length > 0) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-600 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 dark:text-neutral-100" />
          </button>
          <div className="ml-4 flex-1">
            <h1 className="text-xl font-bold dark:text-neutral-100">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {user.stats.posts}개 게시물
            </p>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="relative">
        {/* Background Image */}
        <div className="h-48 bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
          {user.backgroundImageUrl ? (
            <Image
              src={user.backgroundImageUrl}
              alt="Background"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-400 to-primary-600" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Profile Image */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-gray-200 dark:bg-neutral-800">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-neutral-700">
                  <UserIcon className="h-16 w-16 text-gray-500 dark:text-neutral-400" />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold dark:text-neutral-100">
                    {user.name}
                  </h2>
                  {user.isVerified && (
                    <CheckBadgeIcon className="h-6 w-6 text-primary-600" />
                  )}
                </div>
                <p className="text-gray-500 dark:text-neutral-400">
                  @{user.username}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-transparent border border-primary-600 text-gray-900 dark:text-neutral-100 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                  title="공유하기"
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
                {!isOwnProfile && (
                  <button
                    onClick={handleSendNote}
                    className="p-2 bg-transparent border border-primary-600 text-gray-900 dark:text-neutral-100 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                    title="쪽지 보내기"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                  </button>
                )}
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 text-sm bg-transparent border border-primary-600 text-gray-900 dark:text-neutral-100 font-semibold rounded-md hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    프로필 수정
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-900 dark:text-neutral-200">{user.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-neutral-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={user.website}
                    className="text-primary-600 hover:underline"
                  >
                    {user.website.replace('https://', '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="h-4 w-4" />
                <span>{formatJoinedDate(user.joinedDate)}에 가입</span>
              </div>
            </div>

            <div className="flex gap-6 text-sm dark:text-neutral-100">
              <button
                onClick={() => setIsSubscribersModalOpen(true)}
                className="hover:underline"
              >
                <strong>
                  {(subscriberCount?.count || 0).toLocaleString()}
                </strong>{' '}
                <span className="text-gray-500 dark:text-neutral-400">
                  구독자
                </span>
              </button>
              {isOwnProfile && (
                <span>
                  <strong>
                    {(bookmarksData?.totalElements || 0).toLocaleString()}
                  </strong>{' '}
                  <span className="text-gray-500 dark:text-neutral-400">
                    보관함
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subscribe Button - only show if not own profile */}
        {!isOwnProfile && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold dark:text-neutral-100">
                    이 회원을 구독하시겠습니까?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    최신 게시물을 받아보세요
                  </p>
                </div>
                <div className="flex gap-2">
                  {subscriptionStatus?.isSubscribed ? (
                    <button
                      onClick={handleUnsubscribeClick}
                      disabled={unsubscribeMutation.isPending}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 hover:bg-gray-300 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors"
                    >
                      {unsubscribeMutation.isPending ? '처리 중...' : '구독 중'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribeMutation.isPending}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {subscribeMutation.isPending ? '처리 중...' : '구독'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-neutral-800 sticky top-[73px] bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 p-4 font-semibold text-center transition-colors ${
              activeTab === 'posts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
          >
            게시물 {user.stats.posts}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 p-4 font-semibold text-center transition-colors ${
              activeTab === 'media'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
            }`}
          >
            미디어 {user.stats.media}
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('archives')}
              className={`flex-1 p-4 font-semibold text-center transition-colors ${
                activeTab === 'archives'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              보관함 {bookmarksData?.totalElements || 0}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'posts' && (
          <div>
            {isUserLoading ? (
              <div className="p-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">게시물을 불러오는 중...</p>
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.postId}
                  post={post}
                  onPostDeleted={() => refetch()}
                  onPostUpdated={() => refetch()}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                게시물이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="p-4">
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {mediaItems.map((post) => (
                  <div
                    key={post.postId}
                    className="aspect-square relative cursor-pointer hover:opacity-90 transition-opacity group"
                    onClick={() =>
                      router.push(`/@${username}/post/${post.postId}`)
                    }
                  >
                    <Image
                      src={post.mediaUrls![0]}
                      alt="Media"
                      fill
                      className="object-cover rounded-sm"
                    />
                    {/* 다중 이미지 표시 */}
                    {post.mediaUrls && post.mediaUrls.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        +{post.mediaUrls.length - 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                미디어가 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'archives' && (
          <div>
            {isBookmarksLoading ? (
              <div>
                {[...Array(3)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : bookmarksData && bookmarksData.content.length > 0 ? (
              bookmarksData.content.map((post) => (
                <Post
                  key={post.postId}
                  post={post}
                  onPostDeleted={() => {
                    refetch();
                    refetchBookmarks();
                  }}
                  onPostUpdated={() => {
                    refetch();
                    refetchBookmarks();
                  }}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-neutral-400">
                보관한 게시물이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentName={user.name}
          currentIntroduction={user.bio}
          currentProfileUrl={user.profileImageUrl || undefined}
          currentBannerImageUrl={user.backgroundImageUrl || undefined}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Subscribers Modal */}
      {memberId > 0 && (
        <SubscribersModal
          isOpen={isSubscribersModalOpen}
          onClose={() => setIsSubscribersModalOpen(false)}
          memberId={memberId}
          memberName={user.name}
        />
      )}

      {/* Unsubscribe Confirm Modal */}
      <ConfirmModal
        isOpen={showUnsubscribeConfirm}
        onClose={() => setShowUnsubscribeConfirm(false)}
        onConfirm={handleUnsubscribeConfirm}
        title="구독 취소"
        description={`${user?.name}님의 구독을 취소하시겠습니까?\n구독을 취소하면 더 이상 새 콘텐츠 알림을 받지 못합니다.`}
        confirmText="구독 취소"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
        isLoading={unsubscribeMutation.isPending}
      />
    </div>
  );
};

export default ProfilePage;
