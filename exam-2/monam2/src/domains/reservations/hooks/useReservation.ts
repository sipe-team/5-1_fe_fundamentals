import { useSuspenseQuery } from '@tanstack/react-query';

import getReservationById from '@/domains/reservations/apis/getReservationById';

const QUERY_KEY = ['reservation'] as const;

export default function useReservation(id: string) {
  return useSuspenseQuery({
    queryKey: useReservation.getQueryKeys(id),
    queryFn: () => getReservationById(id),
  });
}

useReservation.getQueryKeys = (id?: string) => {
  return id ? [...QUERY_KEY, id] : QUERY_KEY;
};
