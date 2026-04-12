import { client } from '@/shared/apis';
import type { ReservationsResponse } from '@/shared/types';

export default function getReservations(date: string) {
  return client
    .get('reservations', {
      searchParams: {
        date,
      },
    })
    .json<ReservationsResponse>();
}
