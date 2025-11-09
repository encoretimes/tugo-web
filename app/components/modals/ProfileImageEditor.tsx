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
} from '@heroicons/react/24/outline';

interface ProfileImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onSave: (editedFile: File) => void;
  imageType: 'profile' | 'banner';
}

export default function ProfileImageEditor({
  isOpen,
  onClose,
  imageFile,
  onSave,
  imageType,
}: ProfileImageEditorProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(0);

  // 이미지 타입별 비율 설정
  const aspectRatio = imageType === 'profile' ? 1 : 16 / 9;

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
    if (!cropper || !imageFile) return;

    // 이미지 타입별 크기 설정
    const width = imageType === 'profile' ? 800 : 1920;
    const height = imageType === 'profile' ? 800 : 1080;

    const canvas = cropper.getCroppedCanvas({
      width,
      height,
      imageSmoothingQuality: 'high',
    });

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const editedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now(),
          });
          onSave(editedFile);
          onClose();
        }
      },
      imageFile.type,
      0.9
    );
  };

  const handleCancel = () => {
    onClose();
  };

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {imageType === 'profile'
                      ? '프로필 사진 편집'
                      : '배경 이미지 편집'}
                  </Dialog.Title>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="p-6">
                  {imageUrl && (
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                      {/* 원형 마스크 오버레이 (프로필 사진만) */}
                      {imageType === 'profile' && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none z-10"
                          style={{ mixBlendMode: 'multiply' }}
                        >
                          <defs>
                            <mask id="circleMask">
                              <rect width="100%" height="100%" fill="white" />
                              <circle cx="50%" cy="50%" r="40%" fill="black" />
                            </mask>
                          </defs>
                          <rect
                            width="100%"
                            height="100%"
                            fill="rgba(0, 0, 0, 0.5)"
                            mask="url(#circleMask)"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="40%"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        </svg>
                      )}

                      <Cropper
                        ref={cropperRef}
                        src={imageUrl}
                        style={{
                          height: '60vh',
                          width: '100%',
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
                    </div>
                  )}

                  {/* Controls */}
                  <div className="mt-6 space-y-4">
                    {/* Rotation */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        회전
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleRotateLeft}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[44px]"
                        >
                          <ArrowUturnLeftIcon className="h-5 w-5" />
                          <span className="text-sm">좌회전</span>
                        </button>
                        <button
                          onClick={handleRotateRight}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 min-h-[44px]"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                          <span className="text-sm">우회전</span>
                        </button>
                      </div>
                    </div>

                    {/* Zoom */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        확대/축소
                      </h3>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleZoomOut}
                          className="p-2 text-gray-600 hover:text-gray-800 min-h-[44px] min-w-[44px]"
                        >
                          <MagnifyingGlassMinusIcon className="h-5 w-5" />
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
                          className="p-2 text-gray-600 hover:text-gray-800 min-h-[44px] min-w-[44px]"
                        >
                          <MagnifyingGlassPlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-1">
                        {Math.round(zoomLevel * 100)}%
                      </div>
                    </div>

                    {imageType === 'profile' && (
                      <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 p-3">
                        점선 원 안의 영역이 프로필 사진으로 표시됩니다
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
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
