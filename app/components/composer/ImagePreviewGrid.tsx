'use client';

import Image from 'next/image';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ImagePreviewGridProps {
  images: File[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function ImagePreviewGrid({
  images,
  onEdit,
  onRemove,
  disabled = false,
  size = 'medium',
}: ImagePreviewGridProps) {
  if (images.length === 0) return null;

  const sizeClasses = {
    small: 'h-16 w-16 md:h-20 md:w-20',
    medium: 'h-20 w-20',
  };

  return (
    <div className={size === 'small' ? 'flex flex-wrap gap-2' : 'grid grid-cols-5 gap-2'}>
      {images.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
          <div key={`${file.name}-${index}`} className="relative group">
            <div
              className="cursor-pointer overflow-hidden rounded-lg"
              onClick={() => onEdit(index)}
            >
              <Image
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className={`${sizeClasses[size]} object-cover`}
                unoptimized
              />
            </div>
            <button
              onClick={() => onEdit(index)}
              className="absolute bottom-1 left-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              disabled={disabled}
              title="편집"
            >
              <PencilIcon className="h-3 w-3" />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
              disabled={disabled}
              title="삭제"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
