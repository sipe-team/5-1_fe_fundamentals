import { useSuspenseQuery } from '@tanstack/react-query';

import { getMyReservations } from '@/features/my/api/getMyReservations';
import { myQueryKeys } from './querykeys';
import type { Reservation, ReservationsResponse } from '@/features/reservations/types';

export function useMyReservations() {
  return useSuspenseQuery<ReservationsResponse, Error, Reservation[]>({
    queryKey: myQueryKeys.reservations(),
    queryFn: getMyReservations,
    select: (response) => response.reservations,
  });
}
