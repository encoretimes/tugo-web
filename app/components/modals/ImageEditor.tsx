'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState, useEffect } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'react-cropper/node_modules/cropperjs/dist/cropper.css';
import {
  XMarkIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File;
  onSave: (editedFile: File) => void;
}

export default function ImageEditor({
  isOpen,
  onClose,
  imageFile,
  onSave,
}: ImageEditorProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(0);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      setZoomLevel(0);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile]);

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

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now(),
        });
        onSave(editedFile);
        onClose();
      }
    }, imageFile.type);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900 dark:text-neutral-100 tracking-tight"
                  >
                    이미지 편집
                  </Dialog.Title>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Cropper Area */}
                <div className="relative bg-neutral-950">
                  {imageUrl && (
                    <Cropper
                      ref={cropperRef}
                      src={imageUrl}
                      style={{ height: '360px', width: '100%' }}
                      aspectRatio={NaN}
                      viewMode={1}
                      guides={true}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                    />
                  )}
                </div>

                {/* Controls */}
                <div className="px-5 py-4 space-y-4 border-t border-gray-100 dark:border-neutral-800">
                  {/* Zoom */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      aria-label="축소"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={zoomLevel}
                        onChange={handleZoomChange}
                        className="w-full h-1 bg-gray-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-3.5
                          [&::-webkit-slider-thumb]:h-3.5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gray-900
                          [&::-webkit-slider-thumb]:dark:bg-neutral-100
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                    </div>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      aria-label="확대"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-gray-400 dark:text-neutral-500 w-10 text-right tabular-nums">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>

                  {/* Rotation */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleRotateLeft}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <ArrowUturnLeftIcon className="h-4 w-4" />
                      <span>좌회전</span>
                    </button>
                    <button
                      onClick={handleRotateRight}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>우회전</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-100 dark:border-neutral-800">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-neutral-400 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors"
                  >
                    저장
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
