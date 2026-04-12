import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { getReservation } from '../api';

export function useReservation(id: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.reservations.detail(id),
    queryFn: () => getReservation(id),
    select: (data) => data.reservation,
  });
}
