'use client';

import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { ImageEditData } from './constants';

interface SortableImageProps {
  image: ImageEditData;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function SortableImage({
  image,
  index,
  isActive,
  onClick,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 150ms ease',
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const hasEdits = image.editedFile || image.filterId || image.adjustments;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
        isDragging
          ? 'cursor-grabbing scale-105 shadow-lg border-primary-400'
          : 'cursor-pointer'
      } ${
        isActive
          ? 'border-primary-500 ring-2 ring-primary-500/30'
          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
      }`}
      onClick={handleClick}
    >
      <Image
        src={image.url}
        alt={`Image ${index + 1}`}
        fill
        className="object-cover pointer-events-none"
        draggable={false}
      />
      {hasEdits && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full pointer-events-none" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center pointer-events-none">
        <span className="text-[10px] text-white">{index + 1}</span>
      </div>
    </div>
  );
}

interface ThumbnailStripProps {
  images: ImageEditData[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
  onReorder: (images: ImageEditData[], newCurrentIndex: number) => void;
  variant?: 'vertical' | 'horizontal';
}

export default function ThumbnailStrip({
  images,
  currentIndex,
  onImageSelect,
  onReorder,
  variant = 'vertical',
}: ThumbnailStripProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);

      let newCurrentIndex = currentIndex;
      if (currentIndex === oldIndex) {
        newCurrentIndex = newIndex;
      } else if (currentIndex === newIndex) {
        newCurrentIndex = oldIndex < newIndex ? newIndex - 1 : newIndex + 1;
      } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
        newCurrentIndex = currentIndex - 1;
      } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
        newCurrentIndex = currentIndex + 1;
      }

      onReorder(arrayMove(images, oldIndex, newIndex), newCurrentIndex);
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className="px-4 py-2 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex gap-2 overflow-x-auto justify-center">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => onImageSelect(index)}
              className={`relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                index === currentIndex
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
              }`}
            >
              <Image
                src={img.url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center">
                <span className="text-[10px] text-white">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-20 bg-gray-50 dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-800 py-3 overflow-y-auto overflow-x-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col items-center gap-2">
            {images.map((img, index) => (
              <SortableImage
                key={img.id}
                image={img}
                index={index}
                isActive={index === currentIndex}
                onClick={() => onImageSelect(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
