import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { createReservation } from '../api';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.byDate(variables.date),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.my });
    },
  });
}
