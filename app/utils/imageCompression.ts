import imageCompression from 'browser-image-compression';

/**
 * 이미지 파일 타입
 */
export type ImageType = 'profile' | 'banner' | 'post' | 'general';

/**
 * 압축 옵션 인터페이스
 */
interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  fileType?: string;
}

/**
 * 이미지 타입별 기본 압축 설정
 */
const getDefaultOptions = (type: ImageType): CompressionOptions => {
  switch (type) {
    case 'profile':
      return {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        quality: 0.85,
      };
    case 'banner':
      return {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.85,
      };
    case 'post':
      return {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.85,
      };
    case 'general':
    default:
      return {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.85,
      };
  }
};

/**
 * 이미지 파일을 압축합니다.
 *
 * @param file - 압축할 이미지 파일
 * @param type - 이미지 타입 (profile, banner, post, general)
 * @param customOptions - 사용자 정의 압축 옵션
 * @returns 압축된 이미지 파일
 */
export async function compressImage(
  file: File,
  type: ImageType = 'general',
  customOptions?: Partial<CompressionOptions>
): Promise<File> {
  const defaultOptions = getDefaultOptions(type);
  const options = { ...defaultOptions, ...customOptions };

  try {
    // 이미 충분히 작은 파일은 압축하지 않음
    if (file.size <= (options.maxSizeMB || 2) * 1024 * 1024 * 0.5) {
      return file;
    }

    const compressedFile = await imageCompression(file, options);

    // 압축 전후 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(
        `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      );
      console.log(
        `Compression ratio: ${((compressedFile.size / file.size) * 100).toFixed(1)}%`
      );
    }

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // 압축 실패 시 원본 파일 반환
    return file;
  }
}

/**
 * 여러 이미지 파일을 압축합니다.
 *
 * @param files - 압축할 이미지 파일 배열
 * @param type - 이미지 타입
 * @param customOptions - 사용자 정의 압축 옵션
 * @returns 압축된 이미지 파일 배열
 */
export async function compressImages(
  files: File[],
  type: ImageType = 'general',
  customOptions?: Partial<CompressionOptions>
): Promise<File[]> {
  try {
    const compressionPromises = files.map((file) =>
      compressImage(file, type, customOptions)
    );
    return await Promise.all(compressionPromises);
  } catch (error) {
    console.error('Batch image compression failed:', error);
    return files; // 압축 실패 시 원본 파일 배열 반환
  }
}

/**
 * 이미지 파일의 메타데이터를 추출합니다.
 *
 * @param file - 이미지 파일
 * @returns 이미지 너비, 높이, 비율
 */
export async function getImageMetadata(
  file: File
): Promise<{ width: number; height: number; aspectRatio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;

      URL.revokeObjectURL(url);
      resolve({ width, height, aspectRatio });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * 파일이 이미지인지 확인합니다.
 *
 * @param file - 확인할 파일
 * @returns 이미지 여부
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 *
 * @param bytes - 파일 크기 (바이트)
 * @returns 포맷된 파일 크기 문자열
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
