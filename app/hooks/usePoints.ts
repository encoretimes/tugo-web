import { useQuery } from '@tanstack/react-query';
import { Point } from '@/types/point';

const getPoints = async (): Promise<Point[]> => {
    const res = await fetch('/api/points');
    if (!res.ok) {
        throw new Error('Failed to fetch points');
    }
    return res.json();
}

export const usePoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: getPoints,
  });
};
