import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  reservationKeys,
} from "@/reservation/api/reservations";
import type {
  CreateReservationRequest,
  ReservationsResponse,
} from "@/reservation/types";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservation(data),
    onSuccess: (data) => {
      const reservation = data.reservation;
      const addReservation = (old: ReservationsResponse | undefined) => ({
        reservations: [
          ...(old?.reservations ?? []).filter((item) => item.id !== reservation.id),
          reservation,
        ],
      });

      const targetKeys = [
        reservationKeys.list(reservation.date),
        reservationKeys.my(),
      ];

      for (const key of targetKeys) {
        if (queryClient.getQueryData(key) !== undefined) {
          queryClient.setQueryData<ReservationsResponse>(key, addReservation);
        }
      }

      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}
