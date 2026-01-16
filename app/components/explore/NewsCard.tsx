'use client';

import React from 'react';
import { NewsArticle } from '@/types/news';
import { NewspaperIcon } from '@heroicons/react/24/outline';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  // HTML 엔티티 디코딩
  const decodeHtmlEntities = (text: string): string => {
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
    };
    return text.replace(
      /&[a-zA-Z0-9#]+;/g,
      (match) => entities[match] || match
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const isGoogleSource = article.source.toLowerCase().includes('google');
  const decodedTitle = decodeHtmlEntities(article.title);
  const displayTitle = isGoogleSource
    ? decodedTitle
    : `${decodedTitle} - ${article.source}`;
  const displayDescription = article.description
    ? decodeHtmlEntities(article.description)
    : null;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <NewspaperIcon className="h-5 w-5 text-neutral-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {displayTitle}
          </p>
          {displayDescription && (
            <p className="mb-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
              {displayDescription}
            </p>
          )}
          <span className="text-xs text-neutral-400">
            {formatTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
