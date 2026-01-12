import { Point } from '@/types/notification';

// TODO: 백엔드 API 준비되면 apiClient.get('/api/v1/points')로 변경
export const getPoints = async (): Promise<Point[]> => {
  const res = await fetch('/api/points');
  if (!res.ok) {
    throw new Error('Failed to fetch points');
  }
  return res.json();
};
