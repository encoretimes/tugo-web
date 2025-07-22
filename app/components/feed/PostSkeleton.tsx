import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="animate-pulse border-b p-4">
      <div className="flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-300"></div>
          <div className="h-4 w-1/2 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
