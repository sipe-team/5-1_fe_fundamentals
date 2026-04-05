import { client } from "@/shared/apis";
import type { ConflictError, ReservationResponse } from "@/shared/types";

export default function postReservation() {
  return client
    .post("reservations")
    .json<ReservationResponse | ConflictError>();
}
