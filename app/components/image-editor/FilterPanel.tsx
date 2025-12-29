'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FILTER_PRESETS } from './constants';
import { useImageFilters } from './hooks/useImageFilters';

interface FilterPanelProps {
  imageUrl: string;
  selectedFilterId: string;
  onFilterSelect: (filterId: string) => void;
}

interface FilterThumbnail {
  filterId: string;
  dataUrl: string;
}

export default function FilterPanel({
  imageUrl,
  selectedFilterId,
  onFilterSelect,
}: FilterPanelProps) {
  const [thumbnails, setThumbnails] = useState<FilterThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { generateFilterPreview } = useImageFilters();

  useEffect(() => {
    if (!imageUrl) return;

    const generateThumbnails = async () => {
      setIsLoading(true);
      const newThumbnails: FilterThumbnail[] = [];

      for (const filter of FILTER_PRESETS) {
        try {
          const dataUrl = await generateFilterPreview(imageUrl, filter, 80);
          newThumbnails.push({ filterId: filter.id, dataUrl });
        } catch {
          newThumbnails.push({ filterId: filter.id, dataUrl: imageUrl });
        }
      }

      setThumbnails(newThumbnails);
      setIsLoading(false);
    };

    generateThumbnails();
  }, [imageUrl, generateFilterPreview]);

  const getThumbnail = (filterId: string): string => {
    const thumbnail = thumbnails.find((t) => t.filterId === filterId);
    return thumbnail?.dataUrl || imageUrl;
  };

  return (
    <div className="w-full">
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTER_PRESETS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-200 ${
              selectedFilterId === filter.id
                ? 'opacity-100'
                : 'opacity-70 hover:opacity-90'
            }`}
          >
            <div
              className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedFilterId === filter.id
                  ? 'border-primary-500 ring-2 ring-primary-500/30 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isLoading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={getThumbnail(filter.id)}
                    alt={filter.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              {selectedFilterId === filter.id && (
                <div className="absolute inset-0 bg-primary-500/10" />
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                selectedFilterId === filter.id
                  ? 'text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              {filter.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
