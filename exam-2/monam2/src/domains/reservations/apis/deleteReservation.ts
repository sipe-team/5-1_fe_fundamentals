import { client } from '@/shared/apis';
import type { ApiMessageResponse } from '@/shared/types';

export default function deleteReservation(id: string) {
  return client.delete(`reservations/${id}`).json<ApiMessageResponse>();
}
