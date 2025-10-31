'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ImageEditData {
  file: File;
  url: string;
  editedFile?: File;
}

interface MultiImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFiles: File[];
  onSave: (editedFiles: File[]) => void;
}

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
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');

  useEffect(() => {
    if (imageFiles.length > 0) {
      const imageData = imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages(imageData);
      setCurrentIndex(0);
      resetControls();

      return () => {
        imageData.forEach(({ url }) => URL.revokeObjectURL(url));
      };
    }
  }, [imageFiles]);

  const resetControls = () => {
    setZoomLevel(0);
    setAspectRatio(undefined);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setActiveTab('crop');
  };

  const getCurrentImage = () => images[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetControls();
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetControls();
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

  const saveCurrentEdit = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const currentImage = getCurrentImage();
    if (!currentImage) return;

    const canvas = cropper.getCroppedCanvas({
      width: 1080,
      height: 1080,
      imageSmoothingQuality: 'high',
    });

    if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const filteredCanvas = document.createElement('canvas');
        filteredCanvas.width = canvas.width;
        filteredCanvas.height = canvas.height;
        const filteredCtx = filteredCanvas.getContext('2d');

        if (filteredCtx) {
          filteredCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
          filteredCtx.drawImage(canvas, 0, 0);

          // Convert filtered canvas to blob
          filteredCanvas.toBlob(
            (blob) => {
              if (blob) {
                const editedFile = new File([blob], currentImage.file.name, {
                  type: currentImage.file.type,
                  lastModified: Date.now(),
                });

                setImages((prev) =>
                  prev.map((img, index) =>
                    index === currentIndex ? { ...img, editedFile } : img
                  )
                );
              }
            },
            currentImage.file.type,
            0.9
          );
          return;
        }
      }
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const editedFile = new File([blob], currentImage.file.name, {
            type: currentImage.file.type,
            lastModified: Date.now(),
          });

          setImages((prev) =>
            prev.map((img, index) =>
              index === currentIndex ? { ...img, editedFile } : img
            )
          );
        }
      },
      currentImage.file.type,
      0.9
    );
  };

  const handleSave = () => {
    saveCurrentEdit();

    setTimeout(() => {
      const finalFiles = images.map((img) => img.editedFile || img.file);
      onSave(finalFiles);
      onClose();
    }, 100);
  };

  const handleCancel = () => {
    onClose();
  };

  const currentImage = getCurrentImage();

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

        <div className="fixed inset-0 overflow-y-auto">
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
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
                  <div className="flex items-center space-x-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      이미지 편집
                    </Dialog.Title>
                    {images.length > 1 && (
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {images.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Image Editor Area */}
                  <div className="flex-1 flex flex-col bg-gray-50">
                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="p-4 bg-white border-b text-center">
                        <span className="text-sm text-gray-600">
                          {currentIndex + 1} / {images.length}
                        </span>
                      </div>
                    )}

                    {/* Cropper with Navigation */}
                    <div className="flex-1 p-6 flex items-center justify-center relative">
                      {/* Previous Button */}
                      {images.length > 1 && currentIndex > 0 && (
                        <button
                          onClick={handlePrevious}
                          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                      )}

                      {/* Next Button */}
                      {images.length > 1 &&
                        currentIndex < images.length - 1 && (
                          <button
                            onClick={handleNext}
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        )}

                      {currentImage && (
                        <div className="w-full h-full max-w-4xl max-h-[60vh] bg-white rounded-lg shadow-lg overflow-hidden">
                          <Cropper
                            ref={cropperRef}
                            src={currentImage.url}
                            style={{
                              height: '100%',
                              width: '100%',
                              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                            }}
                            aspectRatio={aspectRatio}
                            viewMode={1}
                            guides={true}
                            background={false}
                            responsive={true}
                            autoCropArea={0.8}
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
                        </div>
                      )}
                    </div>

                    {/* Image Thumbnails */}
                    {images.length > 1 && (
                      <div className="p-4 bg-white border-t">
                        <div className="flex space-x-2 overflow-x-auto justify-center">
                          {images.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentIndex(index);
                                resetControls();
                              }}
                              className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                                index === currentIndex
                                  ? 'border-primary-500'
                                  : 'border-gray-200'
                              }`}
                            >
                              <Image
                                src={img.url}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {img.editedFile && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Control Panel */}
                  <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b">
                      <button
                        onClick={() => setActiveTab('crop')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                          activeTab === 'crop'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Squares2X2Icon className="h-4 w-4 mx-auto mb-1" />
                        자르기
                      </button>
                      <button
                        onClick={() => setActiveTab('adjust')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                          activeTab === 'adjust'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mx-auto mb-1" />
                        보정
                      </button>
                    </div>

                    {/* Control Content */}
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                      {activeTab === 'crop' && (
                        <>
                          {/* Aspect Ratio */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              비율
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() =>
                                  handleAspectRatioChange(undefined)
                                }
                                className={`px-3 py-2 text-xs rounded-lg border ${
                                  aspectRatio === undefined
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                자유
                              </button>
                              <button
                                onClick={() => handleAspectRatioChange(1)}
                                className={`px-3 py-2 text-xs rounded-lg border ${
                                  aspectRatio === 1
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                1:1
                              </button>
                              <button
                                onClick={() => handleAspectRatioChange(4 / 3)}
                                className={`px-3 py-2 text-xs rounded-lg border ${
                                  aspectRatio === 4 / 3
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                4:3
                              </button>
                              <button
                                onClick={() => handleAspectRatioChange(16 / 9)}
                                className={`px-3 py-2 text-xs rounded-lg border ${
                                  aspectRatio === 16 / 9
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                16:9
                              </button>
                            </div>
                          </div>

                          {/* Rotation */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              회전
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={handleRotateLeft}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                <ArrowUturnLeftIcon className="h-4 w-4" />
                                <span className="text-xs">좌회전</span>
                              </button>
                              <button
                                onClick={handleRotateRight}
                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                                <span className="text-xs">우회전</span>
                              </button>
                            </div>
                          </div>

                          {/* Zoom */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              확대/축소
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleZoomOut}
                                className="p-1 text-gray-600 hover:text-gray-800"
                              >
                                <MagnifyingGlassMinusIcon className="h-4 w-4" />
                              </button>
                              <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={zoomLevel}
                                onChange={handleZoomChange}
                                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <button
                                onClick={handleZoomIn}
                                className="p-1 text-gray-600 hover:text-gray-800"
                              >
                                <MagnifyingGlassPlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-1">
                              {Math.round(zoomLevel * 100)}%
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'adjust' && (
                        <>
                          {/* Brightness */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              밝기
                            </h3>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={brightness}
                              onChange={(e) =>
                                setBrightness(Number(e.target.value))
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center text-xs text-gray-500 mt-1">
                              {brightness}%
                            </div>
                          </div>

                          {/* Contrast */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              대비
                            </h3>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={contrast}
                              onChange={(e) =>
                                setContrast(Number(e.target.value))
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center text-xs text-gray-500 mt-1">
                              {contrast}%
                            </div>
                          </div>

                          {/* Saturation */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              채도
                            </h3>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={saturation}
                              onChange={(e) =>
                                setSaturation(Number(e.target.value))
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center text-xs text-gray-500 mt-1">
                              {saturation}%
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
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
