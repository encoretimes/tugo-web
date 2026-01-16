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

    const croppedCanvas = cropper.getCroppedCanvas({
      width,
      height,
      imageSmoothingQuality: 'high',
    });

    // 프로필 사진인 경우 원형 마스크 적용
    let finalCanvas = croppedCanvas;
    if (imageType === 'profile') {
      finalCanvas = document.createElement('canvas');
      finalCanvas.width = width;
      finalCanvas.height = height;
      const ctx = finalCanvas.getContext('2d');

      if (ctx) {
        // 원형 클리핑 패스 생성
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 클리핑된 영역에 이미지 그리기
        ctx.drawImage(croppedCanvas, 0, 0, width, height);
      }
    }

    finalCanvas.toBlob(
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
              <Dialog.Panel
                className={`w-full ${imageType === 'profile' ? 'max-w-md' : 'max-w-2xl'} bg-white shadow-2xl transition-all dark:bg-neutral-900`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold tracking-tight text-gray-900 dark:text-neutral-100"
                  >
                    {imageType === 'profile' ? '프로필 사진' : '배경 이미지'}
                  </Dialog.Title>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Cropper Area */}
                <div className="relative bg-neutral-950">
                  {imageUrl && (
                    <>
                      {/* 프로필: 원형 가이드 오버레이 */}
                      {imageType === 'profile' && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                          <div
                            className="rounded-full border-2 border-dashed border-white/40"
                            style={{
                              width: '70%',
                              aspectRatio: '1',
                            }}
                          />
                        </div>
                      )}

                      <Cropper
                        ref={cropperRef}
                        src={imageUrl}
                        style={{
                          height: imageType === 'profile' ? '320px' : '280px',
                          width: '100%',
                        }}
                        aspectRatio={aspectRatio}
                        viewMode={1}
                        guides={false}
                        background={false}
                        responsive={true}
                        autoCropArea={0.8}
                        checkOrientation={false}
                        dragMode="move"
                        cropBoxMovable={false}
                        cropBoxResizable={false}
                        toggleDragModeOnDblclick={false}
                        ready={() => {
                          const cropper = cropperRef.current?.cropper;
                          if (cropper) {
                            cropper.zoomTo(zoomLevel);
                          }
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-4 border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
                  {/* Zoom */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      aria-label="축소"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={zoomLevel}
                        onChange={handleZoomChange}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-neutral-700 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:dark:bg-neutral-100"
                      />
                    </div>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      aria-label="확대"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-right text-xs tabular-nums text-gray-400 dark:text-neutral-500">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>

                  {/* Rotation */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleRotateLeft}
                      className="flex flex-1 items-center justify-center gap-2 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                      <ArrowUturnLeftIcon className="h-4 w-4" />
                      <span>좌회전</span>
                    </button>
                    <button
                      onClick={handleRotateRight}
                      className="flex flex-1 items-center justify-center gap-2 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>우회전</span>
                    </button>
                  </div>

                  {/* Helper text */}
                  <p className="text-center text-xs text-gray-400 dark:text-neutral-500">
                    {imageType === 'profile'
                      ? '드래그하여 위치 조정 · 원형 영역이 프로필로 저장됩니다'
                      : '드래그하여 위치 조정'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
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
