import { client } from "@/shared/apis";

export default function deleteReservation(id: string) {
  return client.delete(`reservations/${id}`);
}
