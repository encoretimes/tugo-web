import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface ImageCarouselProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // 스크롤 이벤트로 현재 인덱스 업데이트
  const handleScrollEvent = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const imageWidth = container.offsetWidth;
    const newIndex = Math.round(container.scrollLeft / imageWidth);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative group">
      {/* 이미지 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl border border-neutral-200"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((url, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 snap-center cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(index)}
          >
            <Image
              src={url}
              alt={`Post image ${index + 1}`}
              width={600}
              height={400}
              className="w-full object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
        ))}
      </div>

      {/* 왼쪽 화살표 */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScroll('left');
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="이전 이미지"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      )}

      {/* 오른쪽 화살표 */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScroll('right');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="다음 이미지"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* 인디케이터 (점) */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* 이미지 카운터 */}
      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
