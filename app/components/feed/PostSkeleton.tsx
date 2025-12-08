import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="w-full py-4 lg:px-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-4 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-50 dark:bg-neutral-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-50 dark:bg-neutral-700 rounded w-1/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-50 dark:bg-neutral-700 rounded"></div>
            <div className="h-4 bg-gray-50 dark:bg-neutral-700 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between pt-4">
            <div className="h-5 w-5 bg-gray-50 dark:bg-neutral-700 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-50 dark:bg-neutral-700 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-50 dark:bg-neutral-700 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-50 dark:bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
