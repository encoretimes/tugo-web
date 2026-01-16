import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface ImageCarouselProps {
  images: string[];
  onImageClick: (index: number) => void;
}

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleImageDimensions, setSingleImageDimensions] =
    useState<ImageDimensions | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isSingleImage = images.length === 1;

  useEffect(() => {
    if (isSingleImage && images[0]) {
      const img = new window.Image();
      img.src = images[0];
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setSingleImageDimensions({
          width: img.width,
          height: img.height,
          aspectRatio,
        });
      };
    }
  }, [images, isSingleImage]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const imageWidth = container.offsetWidth;

    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      container.scrollTo({
        left: (currentIndex - 1) * imageWidth,
        behavior: 'smooth',
      });
    } else if (direction === 'right' && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      container.scrollTo({
        left: (currentIndex + 1) * imageWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollEvent = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const imageWidth = container.offsetWidth;
    const newIndex = Math.round(container.scrollLeft / imageWidth);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const getSingleImageStyle = () => {
    if (!singleImageDimensions) {
      return { paddingBottom: '75%' };
    }

    const { aspectRatio } = singleImageDimensions;
    const maxHeight = 400;
    const containerWidth = 600;

    if (aspectRatio >= 1) {
      const height = Math.min(containerWidth / aspectRatio, maxHeight);
      return { paddingBottom: `${(height / containerWidth) * 100}%` };
    } else {
      const height = Math.min(containerWidth / aspectRatio, maxHeight);
      return {
        paddingBottom: `${Math.min((height / containerWidth) * 100, 100)}%`,
      };
    }
  };

  if (isSingleImage) {
    return (
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
        onClick={() => onImageClick(0)}
      >
        <div className="relative w-full" style={getSingleImageStyle()}>
          <Image
            src={images[0]}
            alt="Post image"
            fill
            className="object-cover transition-opacity hover:opacity-95"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-neutral-200 bg-gray-100 scrollbar-hide dark:border-neutral-700 dark:bg-neutral-800"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((url, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 cursor-pointer snap-center transition-opacity hover:opacity-95"
            onClick={() => onImageClick(index)}
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={url}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScroll('left');
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
          aria-label="이전 이미지"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScroll('right');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
          aria-label="다음 이미지"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
