import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { getReservations } from '../api';

export function useReservations(date: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.reservations.byDate(date),
    queryFn: () => getReservations(date),
    select: (data) => data.reservations,
  });
}
