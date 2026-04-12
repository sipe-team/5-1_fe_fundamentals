import { useMutation, useQueryClient } from "@tanstack/react-query";

import useMyReservations from "@/domains/my-reservations/hooks/useMyReservations";
import deleteReservation from "@/domains/reservations/apis/deleteReservation";
import useReservation from "@/domains/reservations/hooks/useReservation";
import useReservations from "@/domains/reservations/hooks/useReservations";

import type { ApiMessageResponse } from "@/shared/types";

export default function useDeleteReservationMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<ApiMessageResponse> => {
      return deleteReservation(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: useReservations.getQueryKeys(),
      });
      void queryClient.invalidateQueries({
        queryKey: useMyReservations.getQueryKeys(),
      });
      void queryClient.invalidateQueries({
        queryKey: useReservation.getQueryKeys(id),
      });
    },
  });
}
