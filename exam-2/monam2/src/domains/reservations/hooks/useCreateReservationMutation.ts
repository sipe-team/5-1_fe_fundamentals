import { useMutation, useQueryClient } from "@tanstack/react-query";

import postReservation from "@/domains/reservations/apis/postReservation";
import useReservations from "@/domains/reservations/hooks/useReservations";

import type {
  ConflictError,
  CreateReservationRequest,
  ReservationResponse,
} from "@/shared/types";
import { readConflictError } from "@/shared/utils";

export type CreateReservationResult =
  | { type: "success"; data: ReservationResponse }
  | { type: "conflict"; data: ConflictError };

export default function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateReservationRequest,
    ): Promise<CreateReservationResult> => {
      try {
        const result = await postReservation(payload);

        return {
          type: "success" as const,
          data: result,
        };
      } catch (error) {
        const conflictError = await readConflictError(error);

        if (conflictError) {
          return {
            type: "conflict" as const,
            data: conflictError,
          };
        }

        throw error;
      }
    },
    onSuccess: ({ type }) => {
      if (type !== "success") {
        return;
      }

      // Room metadata does not change, so the rooms cache stays intact.
      void queryClient.invalidateQueries({
        queryKey: useReservations.getQueryKeys(),
      });
    },
  });
}
