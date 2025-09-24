import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Post as PostType } from '@/types/post';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { author, content, createdAt, stats } = post;

  return (
    <div className="border-b p-4">
      <div className="flex space-x-4">
        <Link href={`/profile/${author.username}`} className="flex-shrink-0">
          {author.profileImageUrl ? (
            <Image
              src={author.profileImageUrl}
              alt={author.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-300 hover:bg-neutral-400 transition-colors">
              <UserIcon className="h-8 w-8 text-neutral-500" />
            </div>
          )}
        </Link>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <Link
              href={`/profile/${author.username}`}
              className="font-bold hover:underline"
            >
              {author.name}
            </Link>
            <Link
              href={`/profile/${author.username}`}
              className="text-neutral-500 hover:underline"
            >
              @{author.username}
            </Link>
            <span className="text-neutral-500">· {createdAt}</span>
          </div>
          <div>
            <p>{content}</p>
          </div>
          <div className="mt-4 flex justify-between">
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span>{stats.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
              <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              <span>{stats.reposts}</span>
            </button>
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
              <HeartIcon className="h-5 w-5" />
              <span>{stats.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-full px-2 py-1 transition-colors">
              <ArrowUpOnSquareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
