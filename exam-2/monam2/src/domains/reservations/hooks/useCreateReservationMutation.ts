import { useMutation, useQueryClient } from '@tanstack/react-query';

import postReservation from '@/domains/reservations/apis/postReservation';

import type {
  ApiErrorResponse,
  ConflictError,
  CreateReservationRequest,
  NewReservationResponseType,
  ReservationResponse,
} from '@/shared/types';

export type CreateReservationResult =
  | { type: 'success'; data: ReservationResponse }
  | { type: 'conflict'; data: ConflictError }
  | { type: 'error'; data: ApiErrorResponse };

function isConflictError(
  value: NewReservationResponseType,
): value is ConflictError {
  return 'error' in value && value.error === 'Conflict';
}

function isApiErrorResponse(
  value: NewReservationResponseType,
): value is ApiErrorResponse {
  return 'error' in value;
}

export default function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateReservationRequest,
    ): Promise<CreateReservationResult> => {
      const result = await postReservation(payload);

      if (isConflictError(result)) {
        return {
          type: 'conflict' as const,
          data: result,
        };
      }

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
        queryKey: ['rooms'],
      });
    },
  });
}
