'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState, useEffect, useCallback } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';
import {
  XMarkIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  SparklesIcon,
  EyeIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
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
import {
  ImageEditData,
  ImageAdjustments,
  DEFAULT_ADJUSTMENTS,
  ASPECT_RATIOS,
  DEFAULT_ASPECT_RATIO,
} from '../image-editor/constants';
import { useImageFilters } from '../image-editor/hooks/useImageFilters';
import FilterPanel from '../image-editor/FilterPanel';
import AdjustmentPanel from '../image-editor/AdjustmentPanel';
import BeforeAfterSlider from '../image-editor/BeforeAfterSlider';

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id: image.id });

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
          : 'border-gray-200 hover:border-gray-300'
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

interface MultiImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFiles: File[];
  onSave: (editedFiles: File[]) => void;
}

type TabType = 'crop' | 'filter' | 'adjust';

export default function MultiImageEditor({
  isOpen,
  onClose,
  imageFiles,
  onSave,
}: MultiImageEditorProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [images, setImages] = useState<ImageEditData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(
    DEFAULT_ASPECT_RATIO
  );
  const [activeTab, setActiveTab] = useState<TabType>('crop');
  const [selectedFilterId, setSelectedFilterId] = useState<string>('original');
  const [adjustments, setAdjustments] =
    useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const { generateFilterString, getFilterById, applyFilterToCanvas } =
    useImageFilters();

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

  useEffect(() => {
    if (imageFiles.length > 0) {
      const imageData = imageFiles.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        id: `image-${Date.now()}-${index}`,
        aspectRatio: DEFAULT_ASPECT_RATIO,
        filterId: 'original',
        adjustments: { ...DEFAULT_ADJUSTMENTS },
      }));
      setImages(imageData);
      setCurrentIndex(0);
      resetControls();

      return () => {
        imageData.forEach(({ url }) => URL.revokeObjectURL(url));
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  const resetControls = useCallback(() => {
    setZoomLevel(0);
    setAspectRatio(DEFAULT_ASPECT_RATIO);
    setSelectedFilterId('original');
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
    setActiveTab('crop');
    setShowBeforeAfter(false);
  }, []);

  const getCurrentImage = () => images[currentIndex];

  const saveCurrentImageState = useCallback(() => {
    setImages((prev) =>
      prev.map((img, index) =>
        index === currentIndex
          ? {
              ...img,
              aspectRatio,
              filterId: selectedFilterId,
              adjustments: { ...adjustments },
            }
          : img
      )
    );
  }, [currentIndex, aspectRatio, selectedFilterId, adjustments]);

  const loadImageState = useCallback((index: number) => {
    const image = images[index];
    if (image) {
      setAspectRatio(image.aspectRatio ?? DEFAULT_ASPECT_RATIO);
      setSelectedFilterId(image.filterId ?? 'original');
      setAdjustments(image.adjustments ?? { ...DEFAULT_ADJUSTMENTS });
    }
  }, [images]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      saveCurrentImageState();
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      loadImageState(newIndex);
      setZoomLevel(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      saveCurrentImageState();
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      loadImageState(newIndex);
      setZoomLevel(0);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (currentIndex === oldIndex) {
          setCurrentIndex(newIndex);
        } else if (currentIndex === newIndex) {
          setCurrentIndex(oldIndex < newIndex ? newIndex - 1 : newIndex + 1);
        } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
          setCurrentIndex(currentIndex - 1);
        } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
          setCurrentIndex(currentIndex + 1);
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRotateLeft = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(-90);
    }
  };

  const handleRotateRight = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(90);
    }
  };

  const handleFlipHorizontal = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const data = cropper.getData();
      cropper.scaleX(data.scaleX === -1 ? 1 : -1);
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setZoomLevel(value);

    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(value);
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.1, 3);
    setZoomLevel(newZoom);

    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.1, 0);
    setZoomLevel(newZoom);

    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(newZoom);
    }
  };

  const handleAspectRatioChange = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(ratio || NaN);
    }
  };

  const getCurrentFilterString = useCallback((): string => {
    const filter = getFilterById(selectedFilterId);
    return generateFilterString(filter.filters, adjustments);
  }, [selectedFilterId, adjustments, getFilterById, generateFilterString]);

  const saveCurrentEdit = useCallback(async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return null;

    const currentImage = getCurrentImage();
    if (!currentImage) return null;

    let cropWidth = 1080;
    let cropHeight = 1350;

    if (aspectRatio !== undefined) {
      if (aspectRatio === 4 / 5) {
        cropWidth = 1080;
        cropHeight = 1350;
      } else if (aspectRatio === 1) {
        cropWidth = 1080;
        cropHeight = 1080;
      } else if (aspectRatio === 16 / 9) {
        cropWidth = 1920;
        cropHeight = 1080;
      } else {
        const cropData = cropper.getData();
        cropWidth = Math.round(cropData.width);
        cropHeight = Math.round(cropData.height);
        const maxDimension = 1920;
        if (cropWidth > maxDimension || cropHeight > maxDimension) {
          const scale = maxDimension / Math.max(cropWidth, cropHeight);
          cropWidth = Math.round(cropWidth * scale);
          cropHeight = Math.round(cropHeight * scale);
        }
      }
    }

    const canvas = cropper.getCroppedCanvas({
      width: cropWidth,
      height: cropHeight,
      imageSmoothingQuality: 'high',
    });

    const filter = getFilterById(selectedFilterId);
    const filteredCanvas = applyFilterToCanvas(canvas, filter.filters, adjustments);

    return new Promise<File | null>((resolve) => {
      filteredCanvas.toBlob(
        (blob) => {
          if (blob) {
            const editedFile = new File([blob], currentImage.file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(editedFile);
          } else {
            resolve(null);
          }
        },
        'image/jpeg',
        0.92
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio, selectedFilterId, adjustments, getFilterById, applyFilterToCanvas, images, currentIndex]);

  const handleSave = async () => {
    saveCurrentImageState();

    const editedFile = await saveCurrentEdit();
    if (editedFile) {
      setImages((prev) =>
        prev.map((img, index) =>
          index === currentIndex ? { ...img, editedFile } : img
        )
      );
    }

    setTimeout(async () => {
      const finalImages = [...images];
      if (editedFile) {
        finalImages[currentIndex] = { ...finalImages[currentIndex], editedFile };
      }

      const editPromises = finalImages.map(async (img, index) => {
        if (index === currentIndex) {
          return editedFile || img.file;
        }
        if (img.editedFile) {
          return img.editedFile;
        }
        return img.file;
      });

      const finalFiles = await Promise.all(editPromises);
      onSave(finalFiles);
      onClose();
    }, 100);
  };

  const handleCancel = () => {
    onClose();
  };

  const currentImage = getCurrentImage();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'crop',
      label: '자르기',
      icon: <Squares2X2Icon className="h-5 w-5" />,
    },
    {
      id: 'filter',
      label: '필터',
      icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
      id: 'adjust',
      label: '보정',
      icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
    },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl h-screen flex flex-col bg-white">
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      이미지 편집
                    </Dialog.Title>
                  </div>
                  <div className="flex items-center gap-3">
                    {images.length > 1 && (
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {images.length}
                      </span>
                    )}
                    <button
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        showBeforeAfter
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden md:inline">비교</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                  {/* Left: Thumbnail Strip (Desktop) */}
                  {images.length > 1 && (
                    <div className="hidden md:flex flex-col items-center w-20 bg-gray-50 border-r border-gray-200 py-3 overflow-y-auto overflow-x-hidden">
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
                                onClick={() => {
                                  if (index !== currentIndex) {
                                    saveCurrentImageState();
                                    setCurrentIndex(index);
                                    loadImageState(index);
                                    setZoomLevel(0);
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}

                  {/* Center: Preview Area */}
                  <div className="flex-1 flex flex-col bg-gray-100 min-h-0 relative">
                    {/* Navigation Arrows */}
                    {images.length > 1 && currentIndex > 0 && (
                      <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                    )}
                    {images.length > 1 && currentIndex < images.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    )}

                    {/* Image Preview */}
                    <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                      {currentImage && (
                        <div className="w-full h-full max-w-3xl max-h-[60vh] md:max-h-[70vh] bg-white rounded-xl overflow-hidden shadow-lg">
                          {showBeforeAfter ? (
                            <BeforeAfterSlider
                              beforeImage={currentImage.url}
                              afterImage={currentImage.url}
                              afterFilter={getCurrentFilterString()}
                            />
                          ) : (
                            <Cropper
                              ref={cropperRef}
                              src={currentImage.url}
                              style={{
                                height: '100%',
                                width: '100%',
                                filter: getCurrentFilterString(),
                              }}
                              aspectRatio={aspectRatio}
                              viewMode={1}
                              guides={true}
                              background={false}
                              responsive={true}
                              autoCropArea={0.9}
                              checkOrientation={false}
                              dragMode="move"
                              cropBoxMovable={true}
                              cropBoxResizable={true}
                              toggleDragModeOnDblclick={false}
                              ready={() => {
                                const cropper = cropperRef.current?.cropper;
                                if (cropper) {
                                  cropper.zoomTo(zoomLevel);
                                }
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mobile Thumbnail Strip */}
                    {images.length > 1 && (
                      <div className="md:hidden px-4 py-2 bg-white border-t border-gray-200">
                        <div className="flex gap-2 overflow-x-auto justify-center">
                          {images.map((img, index) => (
                            <button
                              key={img.id}
                              onClick={() => {
                                if (index !== currentIndex) {
                                  saveCurrentImageState();
                                  setCurrentIndex(index);
                                  loadImageState(index);
                                  setZoomLevel(0);
                                }
                              }}
                              className={`relative h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                                index === currentIndex
                                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                                  : 'border-gray-200 hover:border-gray-300'
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
                    )}
                  </div>

                  {/* Right: Control Panel */}
                  <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col max-h-[40vh] md:max-h-none">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex flex-col items-center gap-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.icon}
                          <span className="text-xs">{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {activeTab === 'crop' && (
                        <div className="space-y-6">
                          {/* Aspect Ratio */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              비율
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                              {ASPECT_RATIOS.map((ratio) => (
                                <button
                                  key={ratio.id}
                                  onClick={() =>
                                    handleAspectRatioChange(ratio.value)
                                  }
                                  className={`px-3 py-2.5 text-xs rounded-lg border transition-all ${
                                    aspectRatio === ratio.value
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {ratio.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Rotation & Flip */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              회전 및 반전
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={handleRotateLeft}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              >
                                <ArrowUturnLeftIcon className="h-4 w-4" />
                                <span className="text-xs">좌회전</span>
                              </button>
                              <button
                                onClick={handleRotateRight}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                                <span className="text-xs">우회전</span>
                              </button>
                              <button
                                onClick={handleFlipHorizontal}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              >
                                <ArrowsRightLeftIcon className="h-4 w-4" />
                                <span className="text-xs">반전</span>
                              </button>
                            </div>
                          </div>

                          {/* Zoom */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              확대/축소
                            </h3>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleZoomOut}
                                className="p-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <MagnifyingGlassMinusIcon className="h-4 w-4" />
                              </button>
                              <div className="flex-1 relative">
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{ width: `${(zoomLevel / 3) * 100}%` }}
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="3"
                                  step="0.1"
                                  value={zoomLevel}
                                  onChange={handleZoomChange}
                                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                />
                              </div>
                              <button
                                onClick={handleZoomIn}
                                className="p-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <MagnifyingGlassPlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-2">
                              {Math.round(zoomLevel * 100)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'filter' && currentImage && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            필터 선택
                          </h3>
                          <FilterPanel
                            imageUrl={currentImage.url}
                            selectedFilterId={selectedFilterId}
                            onFilterSelect={setSelectedFilterId}
                          />
                        </div>
                      )}

                      {activeTab === 'adjust' && (
                        <AdjustmentPanel
                          adjustments={adjustments}
                          onAdjustmentChange={setAdjustments}
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                        >
                          완료
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
