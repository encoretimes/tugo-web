import { apiClient } from '@/lib/api-client';
import { compressImage, isImageFile } from '@/utils/imageCompression';
import { getApiUrl } from '@/config/env';

export interface UploadedFile {
  path: string;
  originalFilename: string;
  size: number;
  contentType: string;
  category: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  let fileToUpload = file;

  // 이미지 파일인 경우 압축 수행
  if (isImageFile(file)) {
    try {
      // 게시물 이미지로 압축 (max 3MB, max 1920px)
      const compressedFile = await compressImage(file, 'post');
      fileToUpload = compressedFile;

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Image Upload] Original: ${(file.size / 1024).toFixed(0)}KB → Compressed: ${(compressedFile.size / 1024).toFixed(0)}KB`
        );
      }
    } catch (error) {
      console.error('Image compression failed, uploading original:', error);
      // 압축 실패 시 원본 파일 업로드
    }
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);

  // FormData 사용 시 Content-Type 헤더를 명시하지 않음 (브라우저가 자동 설정)
  const result = await apiClient.post<UploadedFile>(
    '/api/v1/media/upload/image',
    formData
  );

  // Convert relative path to full URL for Next.js Image component
  const backendUrl = getApiUrl();
  return `${backendUrl}${result.path}`;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};

export const deleteMedia = async (mediaId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/media/${mediaId}`);
};
