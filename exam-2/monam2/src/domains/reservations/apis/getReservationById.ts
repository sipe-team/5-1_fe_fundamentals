import { client } from "@/shared/apis";
import type { ApiErrorResponse, ReservationResponse } from "@/shared/types";

export default function getReservationById(id: string) {
  return client
    .get(`reservations/${id}`)
    .json<ReservationResponse | ApiErrorResponse>();
}
