'use client';

import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import { Comment } from '@/types/post';
import { formatRelativeTime } from '@/lib/date-utils';
import MentionText from '../MentionText';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex space-x-2">
      {comment.author.profileImageUrl ? (
        <Image
          src={comment.author.profileImageUrl}
          alt={comment.author.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300">
          <UserIcon className="h-5 w-5 text-neutral-500" />
        </div>
      )}
      <div className="flex-1">
        <div className="rounded-lg bg-neutral-100 p-2">
          <p className="text-xs font-semibold text-neutral-900">
            {comment.author.name}{' '}
            <span className="font-normal text-neutral-500">
              @{comment.author.username}
            </span>
          </p>
          <MentionText content={comment.content} className="text-sm mt-1" />
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          {formatRelativeTime(comment.createdAt)}
        </p>
      </div>
    </div>
  );
}
