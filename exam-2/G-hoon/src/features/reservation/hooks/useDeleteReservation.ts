import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import type {
  ReservationResponse,
  ReservationsResponse,
} from '@/types/reservation';
import { deleteReservation } from '../api';

interface DeleteReservationVariables {
  id: string;
  date: string;
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteReservationVariables) => deleteReservation(id),
    onMutate: async ({ id, date }) => {
      const byDateKey = queryKeys.reservations.byDate(date);
      const myKey = queryKeys.reservations.my;
      const detailKey = queryKeys.reservations.detail(id);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: byDateKey }),
        queryClient.cancelQueries({ queryKey: myKey }),
        queryClient.cancelQueries({ queryKey: detailKey }),
      ]);

      const previousByDate =
        queryClient.getQueryData<ReservationsResponse>(byDateKey);
      const previousMy = queryClient.getQueryData<ReservationsResponse>(myKey);
      const previousDetail =
        queryClient.getQueryData<ReservationResponse>(detailKey);

      const removeReservation = (
        old: ReservationsResponse | undefined,
      ): ReservationsResponse | undefined => {
        if (!old) return old;

        return {
          ...old,
          reservations: old.reservations.filter((r) => r.id !== id),
        };
      };

      queryClient.setQueryData<ReservationsResponse>(
        byDateKey,
        removeReservation,
      );
      queryClient.setQueryData<ReservationsResponse>(myKey, removeReservation);
      queryClient.removeQueries({ queryKey: detailKey });

      return { previousByDate, previousMy, previousDetail };
    },
    onError: (_error, variables, context) => {
      if (!context) return;

      if (context.previousByDate) {
        queryClient.setQueryData(
          queryKeys.reservations.byDate(variables.date),
          context.previousByDate,
        );
      }

      if (context.previousMy) {
        queryClient.setQueryData(queryKeys.reservations.my, context.previousMy);
      }

      if (context.previousDetail) {
        queryClient.setQueryData(
          queryKeys.reservations.detail(variables.id),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.byDate(variables.date),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.my });
    },
  });
}
