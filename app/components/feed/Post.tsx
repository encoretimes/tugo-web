import React from 'react';
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
        <div className="flex-shrink-0">
          {author.profileImageUrl ? (
            <img
              src={author.profileImageUrl}
              alt={author.name}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
              <UserIcon className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{author.name}</span>
            <span className="text-gray-500">@{author.username}</span>
            <span className="text-gray-500">· {createdAt}</span>
          </div>
          <div>
            <p>{content}</p>
          </div>
          <div className="mt-4 flex justify-between">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span>{stats.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
              <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              <span>{stats.reposts}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-500">
              <HeartIcon className="h-5 w-5" />
              <span>{stats.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500">
              <ArrowUpOnSquareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
