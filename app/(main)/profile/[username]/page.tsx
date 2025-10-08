'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  MapPinIcon,
  LinkIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { UserIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '@/store/userStore';
import EditProfileModal from '@/components/modals/EditProfileModal';
import Post from '@/components/feed/Post';
import { useBookmarks } from '@/hooks/useBookmarks';
import PostSkeleton from '@/components/feed/PostSkeleton';

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser } = useUserStore();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch,
  } = useUser(username);

  // Creator 여부에 따라 기본 탭 설정
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'archives'>(
    user?.isCreator ? 'posts' : 'archives'
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 보관함 데이터 가져오기 (현재 사용자의 프로필일 때만)
  const {
    data: bookmarksData,
    isLoading: isBookmarksLoading,
    refetch: refetchBookmarks,
  } = useBookmarks(0, 20);

  // user가 로드되면 기본 탭 재설정
  useEffect(() => {
    if (user) {
      setActiveTab(user.isCreator ? 'posts' : 'archives');
    }
  }, [user]);

  // Check if this is the current user's profile
  const isOwnProfile = currentUser && currentUser.username === username;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 날짜 포맷팅 함수
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

    const profileUrl = `${window.location.origin}/profile/${username}`;
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
        alert('프로필 링크가 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-white animate-in slide-in-from-right duration-300">
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
      <div className="min-h-screen bg-white animate-in slide-in-from-right duration-300">
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
    <div className="min-h-screen bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div className="ml-4 flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.stats.posts}개 게시물</p>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="relative">
        {/* Background Image */}
        <div className="h-48 bg-gray-200 relative overflow-hidden">
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
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <UserIcon className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  {user.isVerified && (
                    <CheckBadgeIcon className="h-6 w-6 text-primary-600" />
                  )}
                </div>
                <p className="text-gray-500">@{user.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-transparent border border-primary-600 text-gray-900 rounded-md hover:bg-primary-50 transition-colors"
                  title="공유하기"
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 text-sm bg-transparent border border-primary-600 text-gray-900 font-semibold rounded-md hover:bg-primary-50 transition-colors"
                  >
                    프로필 수정
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-900">{user.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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

            <div className="flex gap-6 text-sm">
              <span>
                <strong>{user.stats.following.toLocaleString()}</strong>{' '}
                <span className="text-gray-500">팔로잉</span>
              </span>
              <span>
                <strong>{user.stats.followers.toLocaleString()}</strong>{' '}
                <span className="text-gray-500">팔로워</span>
              </span>
              {isOwnProfile && (
                <span>
                  <strong>
                    {(bookmarksData?.totalElements || 0).toLocaleString()}
                  </strong>{' '}
                  <span className="text-gray-500">보관함</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Follow/Subscribe Button - only show if not own profile */}
        {!isOwnProfile && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    이 사용자를 팔로우하시겠습니까?
                  </h3>
                  <p className="text-sm text-gray-500">
                    최신 게시물을 받아보세요
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      user.isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {user.isFollowing ? '팔로잉' : '팔로우'}
                  </button>
                  {!user.isSubscribed && (
                    <button className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200">
                      구독
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-[73px] bg-white/90 backdrop-blur-sm z-10">
        <div className="flex">
          {user.isCreator && (
            <>
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 p-4 font-semibold text-center transition-colors ${
                  activeTab === 'posts'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                게시물 {user.stats.posts}
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`flex-1 p-4 font-semibold text-center transition-colors ${
                  activeTab === 'media'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                미디어 {user.stats.media}
              </button>
            </>
          )}
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('archives')}
              className={`flex-1 p-4 font-semibold text-center transition-colors ${
                activeTab === 'archives'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
              <div className="p-8 text-center text-gray-500">
                게시물이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="p-4">
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {mediaItems.map((post) =>
                  post.mediaUrls?.map((url, index) => (
                    <div
                      key={`${post.postId}-${index}`}
                      className="aspect-square relative"
                    >
                      <Image
                        src={url}
                        alt="Media"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
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
              <div className="p-8 text-center text-gray-500">
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
          creatorId={currentUser?.creatorId || 0}
          currentPublicName={user.username}
          currentIntroduction={user.bio}
          currentProfileUrl={user.profileImageUrl || undefined}
          currentBannerImageUrl={user.backgroundImageUrl || undefined}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
