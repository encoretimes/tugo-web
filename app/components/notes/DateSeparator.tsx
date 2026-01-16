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
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 text-xs px-3 py-1 rounded-full">
        {formattedDate}
      </div>
    </div>
  );
}
