'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ImageAdjustments, DEFAULT_ADJUSTMENTS } from './constants';

interface AdjustmentPanelProps {
  adjustments: ImageAdjustments;
  onAdjustmentChange: (adjustments: ImageAdjustments) => void;
}

interface SliderConfig {
  key: keyof ImageAdjustments;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
  formatValue?: (value: number) => string;
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'brightness',
    label: '밝기',
    min: 50,
    max: 150,
    defaultValue: 100,
    unit: '%',
  },
  {
    key: 'contrast',
    label: '대비',
    min: 50,
    max: 150,
    defaultValue: 100,
    unit: '%',
  },
  {
    key: 'saturation',
    label: '채도',
    min: 0,
    max: 200,
    defaultValue: 100,
    unit: '%',
  },
  {
    key: 'warmth',
    label: '온도',
    min: -100,
    max: 100,
    defaultValue: 0,
    unit: '',
    formatValue: (value: number) => (value > 0 ? `+${value}` : `${value}`),
  },
  {
    key: 'vignette',
    label: '비네팅',
    min: 0,
    max: 100,
    defaultValue: 0,
    unit: '%',
  },
  {
    key: 'sharpen',
    label: '선명도',
    min: 0,
    max: 100,
    defaultValue: 0,
    unit: '%',
  },
];

export default function AdjustmentPanel({
  adjustments,
  onAdjustmentChange,
}: AdjustmentPanelProps) {
  const handleSliderChange = (key: keyof ImageAdjustments, value: number) => {
    onAdjustmentChange({
      ...adjustments,
      [key]: value,
    });
  };

  const handleReset = (key: keyof ImageAdjustments) => {
    onAdjustmentChange({
      ...adjustments,
      [key]: DEFAULT_ADJUSTMENTS[key],
    });
  };

  const handleResetAll = () => {
    onAdjustmentChange({ ...DEFAULT_ADJUSTMENTS });
  };

  const isModified = (key: keyof ImageAdjustments): boolean => {
    return adjustments[key] !== DEFAULT_ADJUSTMENTS[key];
  };

  const hasAnyModification = (): boolean => {
    return SLIDER_CONFIGS.some((config) => isModified(config.key));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-neutral-100">
          세부 조정
        </h3>
        {hasAnyModification() && (
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
            전체 초기화
          </button>
        )}
      </div>

      <div className="space-y-4">
        {SLIDER_CONFIGS.map((config) => {
          const value = adjustments[config.key];
          const modified = isModified(config.key);
          const displayValue = config.formatValue
            ? config.formatValue(value)
            : `${value}${config.unit}`;

          const percentage =
            ((value - config.min) / (config.max - config.min)) * 100;

          return (
            <div key={config.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-neutral-300">
                  {config.label}
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm tabular-nums ${
                      modified
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-neutral-400'
                    }`}
                  >
                    {displayValue}
                  </span>
                  {modified && (
                    <button
                      onClick={() => handleReset(config.key)}
                      className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                      title="초기화"
                    >
                      <ArrowPathIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-150"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(config.key, Number(e.target.value))
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-white shadow-md transition-all duration-150 dark:bg-neutral-200"
                  style={{ left: `calc(${percentage}% - 8px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
