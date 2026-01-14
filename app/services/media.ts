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

  if (isImageFile(file)) {
    try {
      const compressedFile = await compressImage(file, 'post');
      fileToUpload = compressedFile;

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Image Upload] Original: ${(file.size / 1024).toFixed(0)}KB → Compressed: ${(compressedFile.size / 1024).toFixed(0)}KB`
        );
      }
    } catch (error) {
      console.error('Image compression failed, uploading original:', error);
    }
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);

  const result = await apiClient.post<UploadedFile>(
    '/api/v1/media/upload/image',
    formData
  );

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
