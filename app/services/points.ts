import { Point } from '@/types/notification';

export const getPoints = async (): Promise<Point[]> => {
  const res = await fetch('/api/points');
  if (!res.ok) {
    throw new Error('Failed to fetch points');
  }
  return res.json();
};
