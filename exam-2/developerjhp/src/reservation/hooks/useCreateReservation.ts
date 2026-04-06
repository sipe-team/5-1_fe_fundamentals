import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation, reservationKeys } from '@/reservation/api/reservations';
import type {
  CreateReservationRequest,
  ReservationsResponse,
} from '@/reservation/types';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservation(data),
    onSuccess: (data) => {
      const reservation = data.reservation;

      queryClient.setQueryData<ReservationsResponse>(
        reservationKeys.list(reservation.date),
        (old) => ({
          reservations: [
            ...(old?.reservations ?? []).filter((item) => item.id !== reservation.id),
            reservation,
          ],
        }),
      );

      queryClient.setQueryData<ReservationsResponse>(
        reservationKeys.my(),
        (old) => ({
          reservations: [
            ...(old?.reservations ?? []).filter((item) => item.id !== reservation.id),
            reservation,
          ],
        }),
      );
    },
  });
}
