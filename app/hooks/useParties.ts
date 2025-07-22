import { useQuery } from '@tanstack/react-query';
import { getParties } from '@/api/parties';

export const useParties = () => {
  return useQuery({
    queryKey: ['parties'],
    queryFn: getParties,
  });
};
