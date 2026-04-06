import { client } from '@/shared/apis';
import type { ApiErrorResponse, ApiMessageResponse } from '@/shared/types';

export default function deleteReservation(id: string) {
  return client
    .delete(`reservations/${id}`, {
      throwHttpErrors: false,
    })
    .json<ApiMessageResponse | ApiErrorResponse>();
}
