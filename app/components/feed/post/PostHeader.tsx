'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/outline';
import { formatRelativeTime } from '@/lib/date-utils';

interface PostHeaderProps {
  author: {
    name: string;
    username: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  disableNavigation?: boolean;
}

export default function PostHeader({
  author,
  createdAt,
  disableNavigation = false,
}: PostHeaderProps) {
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent) => {
    if (disableNavigation) {
      e.preventDefault();
      router.push(`/@${author.username}`);
    }
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <Link
          href={`/@${author.username}`}
          className="flex-shrink-0"
          onClick={handleLinkClick}
        >
          {author.profileImageUrl ? (
            <Image
              src={author.profileImageUrl}
              alt={author.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 transition-colors">
              <UserIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
            </div>
          )}
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/@${author.username}`}
            className="font-semibold text-gray-900 dark:text-neutral-100 text-[15px] hover:underline"
            onClick={handleLinkClick}
          >
            {author.name}
          </Link>
          <Link
            href={`/@${author.username}`}
            className="text-xs text-gray-500 dark:text-neutral-400 hover:underline"
            onClick={handleLinkClick}
          >
            @{author.username}
          </Link>
        </div>
      </div>
      <time className="text-xs text-gray-400 dark:text-neutral-500">
        {formatRelativeTime(createdAt)}
      </time>
    </div>
  );
}
