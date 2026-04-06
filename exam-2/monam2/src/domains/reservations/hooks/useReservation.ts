import { useSuspenseQuery } from '@tanstack/react-query';

import getReservationById from '@/domains/reservations/apis/getReservationById';

const QUERY_KEY = (id: string) => ['reservation', id];

export default function useReservation(id: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY(id),
    queryFn: () => getReservationById(id),
  });
}

useReservation.getQueryKeys = (id: string) => {
  return QUERY_KEY(id);
};
