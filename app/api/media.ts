import { apiClient } from '@/lib/api-client';

export interface UploadedFile {
  path: string;
  originalFilename: string;
  size: number;
  contentType: string;
  category: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  // FormData 사용 시 Content-Type 헤더를 명시하지 않음 (브라우저가 자동 설정)
  const result = await apiClient.post<UploadedFile>(
    '/api/v1/media/upload/image',
    formData
  );

  return result.path;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};

export const deleteMedia = async (mediaId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/v1/media/${mediaId}`);
};
