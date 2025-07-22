import { useQuery } from '@tanstack/react-query';
import { getPoints } from '@/api/points';

export const usePoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: getPoints,
  });
};
