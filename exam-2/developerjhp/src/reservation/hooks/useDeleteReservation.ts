import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReservation, reservationKeys } from '@/reservation/api/reservations';
import type { Reservation, ReservationsResponse } from '@/reservation/types';

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => deleteReservation(id),
    onSuccess: (_data, variables) => {
      const { id, date } = variables;

      const removeById = (old: ReservationsResponse | undefined) => ({
        reservations: (old?.reservations ?? []).filter((r: Reservation) => r.id !== id),
      });

      queryClient.setQueryData<ReservationsResponse>(
        reservationKeys.list(date),
        removeById,
      );
      queryClient.setQueryData<ReservationsResponse>(
        reservationKeys.my(),
        removeById,
      );
      queryClient.removeQueries({ queryKey: reservationKeys.detail(id) });
    },
  });
}
