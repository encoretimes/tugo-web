'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState, useEffect, useCallback } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  SparklesIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  ImageEditData,
  ImageAdjustments,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_ASPECT_RATIO,
} from '../image-editor/constants';
import { useImageFilters } from '../image-editor/hooks/useImageFilters';
import FilterPanel from '../image-editor/FilterPanel';
import AdjustmentPanel from '../image-editor/AdjustmentPanel';
import BeforeAfterSlider from '../image-editor/BeforeAfterSlider';
import CropPanel from '../image-editor/CropPanel';
import ThumbnailStrip from '../image-editor/ThumbnailStrip';

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

  const loadImageState = useCallback(
    (index: number) => {
      const image = images[index];
      if (image) {
        setAspectRatio(image.aspectRatio ?? DEFAULT_ASPECT_RATIO);
        setSelectedFilterId(image.filterId ?? 'original');
        setAdjustments(image.adjustments ?? { ...DEFAULT_ADJUSTMENTS });
      }
    },
    [images]
  );

  const handleImageSelect = (index: number) => {
    if (index !== currentIndex) {
      saveCurrentImageState();
      setCurrentIndex(index);
      loadImageState(index);
      setZoomLevel(0);
    }
  };

  const handleReorder = (
    newImages: ImageEditData[],
    newCurrentIndex: number
  ) => {
    setImages(newImages);
    setCurrentIndex(newCurrentIndex);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleImageSelect(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      handleImageSelect(currentIndex + 1);
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

  const handleZoomChange = (newZoom: number) => {
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
    const filteredCanvas = applyFilterToCanvas(
      canvas,
      filter.filters,
      adjustments
    );

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
  }, [
    aspectRatio,
    selectedFilterId,
    adjustments,
    getFilterById,
    applyFilterToCanvas,
    images,
    currentIndex,
  ]);

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
        finalImages[currentIndex] = {
          ...finalImages[currentIndex],
          editedFile,
        };
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
                    <div className="hidden md:block">
                      <ThumbnailStrip
                        images={images}
                        currentIndex={currentIndex}
                        onImageSelect={handleImageSelect}
                        onReorder={handleReorder}
                        variant="vertical"
                      />
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
                      <div className="md:hidden">
                        <ThumbnailStrip
                          images={images}
                          currentIndex={currentIndex}
                          onImageSelect={handleImageSelect}
                          onReorder={handleReorder}
                          variant="horizontal"
                        />
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
                        <CropPanel
                          aspectRatio={aspectRatio}
                          zoomLevel={zoomLevel}
                          onAspectRatioChange={handleAspectRatioChange}
                          onZoomChange={handleZoomChange}
                          onRotateLeft={handleRotateLeft}
                          onRotateRight={handleRotateRight}
                          onFlipHorizontal={handleFlipHorizontal}
                        />
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
