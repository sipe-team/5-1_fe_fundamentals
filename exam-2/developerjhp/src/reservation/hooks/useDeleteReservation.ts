import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteReservation,
  reservationKeys,
} from "@/reservation/api/reservations";
import type { ReservationsResponse } from "@/reservation/types";

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => deleteReservation(id),
    onSuccess: (_data, { id, date }) => {
      const removeById = (old: ReservationsResponse | undefined) => ({
        reservations: (old?.reservations ?? []).filter((r) => r.id !== id),
      });

      const targetKeys = [reservationKeys.list(date), reservationKeys.my()];

      for (const key of targetKeys) {
        if (queryClient.getQueryData(key) !== undefined) {
          queryClient.setQueryData<ReservationsResponse>(key, removeById);
        }
      }

      queryClient.removeQueries({ queryKey: reservationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}
