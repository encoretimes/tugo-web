import { useCallback } from 'react';
import {
  FilterValues,
  FilterPreset,
  FILTER_PRESETS,
  DEFAULT_FILTER_VALUES,
  ImageAdjustments,
  DEFAULT_ADJUSTMENTS,
} from '../constants';

export function useImageFilters() {
  const generateFilterString = useCallback(
    (filters: FilterValues, adjustments?: ImageAdjustments): string => {
      const brightness =
        (filters.brightness / 100) *
        ((adjustments?.brightness ?? 100) / 100) *
        100;
      const contrast =
        (filters.contrast / 100) * ((adjustments?.contrast ?? 100) / 100) * 100;
      const saturate =
        (filters.saturate / 100) *
        ((adjustments?.saturation ?? 100) / 100) *
        100;

      const parts: string[] = [];

      if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
      if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
      if (saturate !== 100) parts.push(`saturate(${saturate}%)`);
      if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
      if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
      if (filters.hueRotate !== 0)
        parts.push(`hue-rotate(${filters.hueRotate}deg)`);
      if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);

      if (adjustments?.warmth && adjustments.warmth !== 0) {
        const warmthDeg = adjustments.warmth * 0.3;
        parts.push(`hue-rotate(${warmthDeg}deg)`);
      }

      return parts.length > 0 ? parts.join(' ') : 'none';
    },
    []
  );

  const getFilterById = useCallback((filterId: string): FilterPreset => {
    return (
      FILTER_PRESETS.find((f) => f.id === filterId) || {
        id: 'original',
        name: '원본',
        nameEn: 'Original',
        filters: DEFAULT_FILTER_VALUES,
      }
    );
  }, []);

  const applyFilterToCanvas = useCallback(
    (
      canvas: HTMLCanvasElement,
      filters: FilterValues,
      adjustments?: ImageAdjustments
    ): HTMLCanvasElement => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return canvas;

      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = canvas.width;
      filteredCanvas.height = canvas.height;
      const filteredCtx = filteredCanvas.getContext('2d');

      if (!filteredCtx) return canvas;

      const filterString = generateFilterString(filters, adjustments);
      filteredCtx.filter = filterString;
      filteredCtx.drawImage(canvas, 0, 0);

      if (adjustments?.vignette && adjustments.vignette > 0) {
        const centerX = filteredCanvas.width / 2;
        const centerY = filteredCanvas.height / 2;
        const radius = Math.max(centerX, centerY);

        const gradient = filteredCtx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.3,
          centerX,
          centerY,
          radius
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(
          1,
          `rgba(0, 0, 0, ${adjustments.vignette / 100})`
        );

        filteredCtx.filter = 'none';
        filteredCtx.fillStyle = gradient;
        filteredCtx.fillRect(0, 0, filteredCanvas.width, filteredCanvas.height);
      }

      return filteredCanvas;
    },
    [generateFilterString]
  );

  const generateFilterPreview = useCallback(
    async (
      imageUrl: string,
      filter: FilterPreset,
      size: number = 80
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const aspectRatio = 4 / 5;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size / aspectRatio;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          const imgAspect = img.width / img.height;
          const canvasAspect = canvas.width / canvas.height;

          let sx = 0,
            sy = 0,
            sw = img.width,
            sh = img.height;

          if (imgAspect > canvasAspect) {
            sw = img.height * canvasAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / canvasAspect;
            sy = (img.height - sh) / 2;
          }

          ctx.filter = generateFilterString(filter.filters);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
    },
    [generateFilterString]
  );

  const combineFiltersAndAdjustments = useCallback(
    (filterId: string, adjustments: ImageAdjustments): string => {
      const filter = getFilterById(filterId);
      return generateFilterString(filter.filters, adjustments);
    },
    [getFilterById, generateFilterString]
  );

  return {
    generateFilterString,
    getFilterById,
    applyFilterToCanvas,
    generateFilterPreview,
    combineFiltersAndAdjustments,
    filterPresets: FILTER_PRESETS,
    defaultAdjustments: DEFAULT_ADJUSTMENTS,
  };
}
