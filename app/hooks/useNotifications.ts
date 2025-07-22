import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/api/notifications';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
};
