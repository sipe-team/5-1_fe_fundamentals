import { useSuspenseQuery } from '@tanstack/react-query';

import { getReservations } from '@/domains/reservations/apis';

const QUERY_KEY = ['reservations'] as const;

export default function useReservations(date: string) {
  return useSuspenseQuery({
    queryKey: useReservations.getQueryKeys(date),
    queryFn: () => getReservations(date),
    select: (data) => data.reservations,
  });
}

useReservations.getQueryKeys = (date?: string) => {
  return date ? [...QUERY_KEY, date] : QUERY_KEY;
};
