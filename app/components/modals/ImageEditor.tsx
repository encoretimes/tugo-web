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
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    이미지 편집
                  </Dialog.Title>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Cropper Area */}
                <div className="p-6">
                  <div className="relative mx-auto max-h-[60vh] w-full overflow-hidden rounded-lg bg-gray-100">
                    {imageUrl && (
                      <Cropper
                        ref={cropperRef}
                        src={imageUrl}
                        style={{ height: '60vh', width: '100%' }}
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
                </div>

                {/* Toolbar */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex flex-col space-y-4">
                    {/* Rotation Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={handleRotateLeft}
                        className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                        title="좌회전"
                      >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        <span>좌회전</span>
                      </button>
                      <button
                        onClick={handleRotateRight}
                        className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                        title="우회전"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                        <span>우회전</span>
                      </button>
                    </div>

                    {/* Zoom Slider */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleZoomOut}
                        className="text-gray-600 hover:text-gray-800"
                        title="축소"
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
                        className="flex-grow"
                      />
                      <button
                        onClick={handleZoomIn}
                        className="text-gray-600 hover:text-gray-800"
                        title="확대"
                      >
                        <MagnifyingGlassPlusIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={handleCancel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSave}
                        className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
                      >
                        저장
                      </button>
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
