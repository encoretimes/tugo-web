import { useQuery } from '@tanstack/react-query';
import { getPoints } from '@/services/points';
import { queryKeys } from '@/lib/query-keys';

export const usePoints = () => {
  return useQuery({
    queryKey: queryKeys.points,
    queryFn: getPoints,
  });
};
