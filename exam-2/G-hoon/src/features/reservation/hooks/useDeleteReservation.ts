import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { ReservationsResponse } from '@/types/reservation';
import { deleteReservation } from '../api';

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteReservation,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['reservations'] });

      const previousQueries = queryClient.getQueriesData<ReservationsResponse>({
        queryKey: ['reservations'],
      });

      queryClient.setQueriesData<ReservationsResponse>(
        { queryKey: ['reservations'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            reservations: old.reservations.filter((r) => r.id !== id),
          };
        },
      );

      navigate(-1);

      return { previousQueries };
    },
    onError: (_error, _id, context) => {
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
