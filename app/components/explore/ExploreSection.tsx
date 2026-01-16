'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface ExploreSectionProps {
  title: string;
  href: string;
  children: React.ReactNode;
  showMoreText?: string;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
  title,
  href,
  children,
  showMoreText = '더보기',
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <Link
          href={href}
          className="flex items-center justify-between transition-opacity hover:opacity-70"
        >
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <div className="flex items-center gap-1 text-primary-600">
            <span className="text-sm font-medium">{showMoreText}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
        </Link>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ExploreSection;
