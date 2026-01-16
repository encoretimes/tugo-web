import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="w-full border-b border-gray-200 py-4 dark:border-gray-800 lg:px-4">
      <div className="flex animate-pulse space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1/4 rounded bg-gray-50 dark:bg-neutral-700"></div>
            <div className="h-3 w-1/6 rounded bg-gray-50 dark:bg-neutral-700"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-50 dark:bg-neutral-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-50 dark:bg-neutral-700"></div>
          </div>
          <div className="flex justify-between pt-4">
            <div className="h-5 w-5 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
            <div className="h-5 w-5 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
            <div className="h-5 w-5 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
            <div className="h-5 w-5 rounded-full bg-gray-50 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
