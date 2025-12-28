'use client';

import React from 'react';
import { NewsArticle } from '@/types/news';
import { NewspaperIcon } from '@heroicons/react/24/outline';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  // 시간 포맷
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

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-3 hover:bg-neutral-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
          <NewspaperIcon className="w-5 h-5 text-neutral-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {article.source}
            </span>
            <span className="text-xs text-neutral-400">
              {formatTime(article.publishedAt)}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-900 line-clamp-2 mb-1">
            {article.title}
          </p>
          {article.description && (
            <p className="text-xs text-neutral-500 line-clamp-2">
              {article.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
