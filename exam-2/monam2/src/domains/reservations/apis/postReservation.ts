import { client } from '@/shared/apis';
import type {
  CreateReservationRequest,
  ReservationResponse,
} from '@/shared/types';

export default function postReservation(payload: CreateReservationRequest) {
  return client
    .post('reservations', { json: payload })
    .json<ReservationResponse>();
}
