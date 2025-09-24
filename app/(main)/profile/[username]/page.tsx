'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  MapPinIcon,
  LinkIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { useUserPosts } from '@/hooks/useUserPosts';
import { UserIcon } from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUser(username);
  const { data: posts, isLoading: isPostsLoading } = useUserPosts(username);

  const handleBack = () => {
    router.back();
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
  }, []);

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
          <div className="ml-4">
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
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {user.isVerified && (
                  <CheckBadgeIcon className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
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
                <span>{user.joinedDate}에 가입</span>
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
            </div>
          </div>
        </div>

        {/* Follow/Subscribe Button */}
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
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-[73px] bg-white/90 backdrop-blur-sm z-10">
        <div className="flex">
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
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'posts' && (
          <div>
            {isPostsLoading ? (
              <div className="p-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">게시물을 불러오는 중...</p>
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 p-4">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {user.profileImageUrl ? (
                        <Image
                          src={user.profileImageUrl}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{user.name}</span>
                        {user.isVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-primary-600" />
                        )}
                        <span className="text-gray-500">@{user.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{post.createdAt}</span>
                      </div>
                      <p className="text-gray-900 mb-3">{post.content}</p>

                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div
                          className={`grid gap-2 mb-3 ${
                            post.mediaUrls.length === 1
                              ? 'grid-cols-1'
                              : 'grid-cols-2'
                          }`}
                        >
                          {post.mediaUrls.map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-lg overflow-hidden"
                            >
                              <Image
                                src={url}
                                alt={`Media ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between max-w-md text-gray-500">
                        <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
                          <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                          <span>{post.stats.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
                          <ArrowPathRoundedSquareIcon className="h-5 w-5" />
                          <span>{post.stats.reposts}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
                          <HeartIcon className="h-5 w-5" />
                          <span>{post.stats.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
                          <ArrowUpOnSquareIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                      key={`${post.id}-${index}`}
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
      </div>
    </div>
  );
};

export default ProfilePage;
