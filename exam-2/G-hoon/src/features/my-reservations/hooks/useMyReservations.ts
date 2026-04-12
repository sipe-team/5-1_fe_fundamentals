import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { getMyReservations } from '../api';

export function useMyReservations() {
  return useSuspenseQuery({
    queryKey: queryKeys.reservations.my,
    queryFn: getMyReservations,
    select: (data) => data.reservations,
  });
}
