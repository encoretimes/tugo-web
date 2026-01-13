'use client';

import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { ASPECT_RATIOS } from './constants';

interface CropPanelProps {
  aspectRatio: number | undefined;
  zoomLevel: number;
  onAspectRatioChange: (ratio: number | undefined) => void;
  onZoomChange: (zoom: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
}

export default function CropPanel({
  aspectRatio,
  zoomLevel,
  onAspectRatioChange,
  onZoomChange,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
}: CropPanelProps) {
  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(parseFloat(e.target.value));
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoomLevel + 0.1, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoomLevel - 0.1, 0));
  };

  return (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">비율</h3>
        <div className="grid grid-cols-4 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => onAspectRatioChange(ratio.value)}
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
        <h3 className="text-sm font-medium text-gray-900 mb-3">회전 및 반전</h3>
        <div className="flex gap-2">
          <button
            onClick={onRotateLeft}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
            <span className="text-xs">좌회전</span>
          </button>
          <button
            onClick={onRotateRight}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="text-xs">우회전</span>
          </button>
          <button
            onClick={onFlipHorizontal}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <ArrowsRightLeftIcon className="h-4 w-4" />
            <span className="text-xs">반전</span>
          </button>
        </div>
      </div>

      {/* Zoom */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">확대/축소</h3>
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
              onChange={handleZoomSliderChange}
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
  );
}
