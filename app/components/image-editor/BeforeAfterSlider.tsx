'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  afterFilter: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  afterFilter,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updateSliderPosition(e.touches[0].clientX);
    },
    [updateSliderPosition]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateSliderPosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt="After"
          fill
          className="object-cover"
          style={{ filter: afterFilter }}
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            <svg
              className="w-3 h-3 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
        원본
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
        편집
      </div>
    </div>
  );
}
