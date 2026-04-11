import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { deleteReservation } from '@/features/reservations/api/deleteReservation';
import { reservationsQueryKeys } from './querykeys';
import { myQueryKeys } from '@/features/my/hooks/queries/querykeys';
import type { Reservation, ReservationsResponse } from '@/features/reservations/types';

type DeleteReservationContext = {
  previousReservations?: ReservationsResponse;
  date?: string;
  previousMyReservations?: ReservationsResponse;
};

export function useDeleteReservation(
  options?: UseMutationOptions<{ message: string }, HTTPError, string, DeleteReservationContext>,
): UseMutationResult<{ message: string }, HTTPError, string, DeleteReservationContext> {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, HTTPError, string, DeleteReservationContext>({
    mutationFn: (id) => deleteReservation(id),
    onMutate: async (id, mutationContext) => {
      await options?.onMutate?.(id, mutationContext);

      const reservationListQueries = queryClient.getQueriesData<ReservationsResponse>({
        queryKey: ['reservations'],
      });

      const targetEntry = reservationListQueries.find(([, data]) =>
        data?.reservations.some((r: Reservation) => r.id === id),
      );

      let previousReservations: ReservationsResponse | undefined;
      let date: string | undefined;

      if (targetEntry) {
        const [queryKey, snapshot] = targetEntry;
        date = (queryKey as string[])[1];
        previousReservations = snapshot;

        await queryClient.cancelQueries({ queryKey: reservationsQueryKeys.allByDate(date) });

        queryClient.setQueryData<ReservationsResponse>(
          reservationsQueryKeys.allByDate(date),
          (old) => {
            if (!old) return old;
            return { ...old, reservations: old.reservations.filter((r) => r.id !== id) };
          },
        );
      }

      await queryClient.cancelQueries({ queryKey: myQueryKeys.reservations() });

      const previousMyReservations = queryClient.getQueryData<ReservationsResponse>(
        myQueryKeys.reservations(),
      );

      queryClient.setQueryData<ReservationsResponse>(myQueryKeys.reservations(), (old) => {
        if (!old) return old;
        return { ...old, reservations: old.reservations.filter((r) => r.id !== id) };
      });

      return { previousReservations, date, previousMyReservations };
    },
    onError: (error, id, context, mutationContext) => {
      if (context?.previousReservations && context.date) {
        queryClient.setQueryData(
          reservationsQueryKeys.allByDate(context.date),
          context.previousReservations,
        );
      }
      if (context?.previousMyReservations) {
        queryClient.setQueryData(myQueryKeys.reservations(), context.previousMyReservations);
      }
      options?.onError?.(error, id, context, mutationContext);
    },
    onSuccess: options?.onSuccess,
    onSettled: (data, error, id, context, mutationContext) => {
      if (context?.date) {
        queryClient.invalidateQueries({
          queryKey: reservationsQueryKeys.allByDate(context.date),
        });
      }
      queryClient.invalidateQueries({ queryKey: myQueryKeys.reservations() });
      queryClient.removeQueries({ queryKey: reservationsQueryKeys.detailById(id) });
      options?.onSettled?.(data, error, id, context, mutationContext);
    },
  });
}
