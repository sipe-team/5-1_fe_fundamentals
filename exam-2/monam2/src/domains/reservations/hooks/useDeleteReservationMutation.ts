import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteReservation from '@/domains/reservations/apis/deleteReservation';

import type { ApiErrorResponse, ApiMessageResponse } from '@/shared/types';

export type DeleteReservationResult =
  | { type: 'success'; data: ApiMessageResponse }
  | { type: 'error'; data: ApiErrorResponse };

function isApiErrorResponse(
  value: ApiMessageResponse | ApiErrorResponse,
): value is ApiErrorResponse {
  return 'error' in value;
}

export default function useDeleteReservationMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<DeleteReservationResult> => {
      const result = await deleteReservation(id);

      if (isApiErrorResponse(result)) {
        return {
          type: 'error' as const,
          data: result,
        };
      }

      return {
        type: 'success' as const,
        data: result,
      };
    },
    onSuccess: ({ type }) => {
      if (type !== 'success') return;

      void queryClient.invalidateQueries({
        queryKey: ['reservations'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['my-reservations'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['rooms'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['reservation', id],
      });
    },
  });
}
