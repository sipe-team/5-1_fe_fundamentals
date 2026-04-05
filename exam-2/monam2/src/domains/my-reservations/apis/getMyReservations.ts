import { client } from "@/shared/apis";
import type { ReservationsResponse } from "@/shared/types";

export async function getMyReservations() {
  return client.get("my-reservations").json<ReservationsResponse>();
}
