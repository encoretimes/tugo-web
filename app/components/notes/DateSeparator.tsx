'use client';

import { formatDateSeparator } from '@/lib/date-utils';

interface DateSeparatorProps {
  date: string;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  const formattedDate = formatDateSeparator(date);

  if (!formattedDate) {
    return null;
  }

  return (
    <div className="my-4 flex items-center justify-center">
      <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
        {formattedDate}
      </div>
    </div>
  );
}
