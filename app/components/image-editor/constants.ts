export interface FilterValues {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
  hueRotate: number;
  blur: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  nameEn: string;
  filters: FilterValues;
  overlayColor?: string;
  overlayOpacity?: number;
}

export interface AspectRatio {
  id: string;
  label: string;
  value: number | undefined;
  isDefault?: boolean;
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  hueRotate: 0,
  blur: 0,
};

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: '원본',
    nameEn: 'Original',
    filters: { ...DEFAULT_FILTER_VALUES },
  },
  {
    id: 'clarendon',
    name: '클래런던',
    nameEn: 'Clarendon',
    filters: {
      brightness: 110,
      contrast: 120,
      saturate: 125,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'gingham',
    name: '깅엄',
    nameEn: 'Gingham',
    filters: {
      brightness: 105,
      contrast: 90,
      saturate: 85,
      sepia: 3,
      grayscale: 0,
      hueRotate: 350,
      blur: 0,
    },
  },
  {
    id: 'moon',
    name: '문',
    nameEn: 'Moon',
    filters: {
      brightness: 110,
      contrast: 110,
      saturate: 0,
      sepia: 0,
      grayscale: 100,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'lark',
    name: '라크',
    nameEn: 'Lark',
    filters: {
      brightness: 108,
      contrast: 95,
      saturate: 105,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'reyes',
    name: '레예스',
    nameEn: 'Reyes',
    filters: {
      brightness: 110,
      contrast: 85,
      saturate: 75,
      sepia: 22,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'juno',
    name: '주노',
    nameEn: 'Juno',
    filters: {
      brightness: 103,
      contrast: 110,
      saturate: 130,
      sepia: 0,
      grayscale: 0,
      hueRotate: 5,
      blur: 0,
    },
  },
  {
    id: 'slumber',
    name: '슬럼버',
    nameEn: 'Slumber',
    filters: {
      brightness: 105,
      contrast: 90,
      saturate: 70,
      sepia: 15,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'crema',
    name: '크레마',
    nameEn: 'Crema',
    filters: {
      brightness: 102,
      contrast: 95,
      saturate: 90,
      sepia: 8,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'ludwig',
    name: '루드비히',
    nameEn: 'Ludwig',
    filters: {
      brightness: 105,
      contrast: 110,
      saturate: 95,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'aden',
    name: '아덴',
    nameEn: 'Aden',
    filters: {
      brightness: 115,
      contrast: 90,
      saturate: 80,
      sepia: 12,
      grayscale: 0,
      hueRotate: 20,
      blur: 0,
    },
  },
  {
    id: 'perpetua',
    name: '페르페투아',
    nameEn: 'Perpetua',
    filters: {
      brightness: 105,
      contrast: 105,
      saturate: 110,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      blur: 0,
    },
    overlayColor: 'linear-gradient(to bottom, #005b9a, #e6c13d)',
    overlayOpacity: 0.15,
  },
];

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: 'free', label: '자유', value: undefined },
  { id: '4:5', label: '4:5', value: 4 / 5, isDefault: true },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
];

export const DEFAULT_ASPECT_RATIO = 4 / 5;

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  vignette: number;
  sharpen: number;
}

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  vignette: 0,
  sharpen: 0,
};

export interface ImageEditData {
  file: File;
  url: string;
  editedFile?: File;
  aspectRatio?: number;
  id: string;
  filterId?: string;
  adjustments?: ImageAdjustments;
}
