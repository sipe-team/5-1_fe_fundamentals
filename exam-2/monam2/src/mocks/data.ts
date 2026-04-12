import reservationsJson from "@/data/reservations";
import roomsJson from "@/data/rooms";
import type { Reservation, Room } from "@/shared/types/reservation";

export const initialRooms: Room[] = roomsJson as Room[];
export const initialReservations: Reservation[] =
  reservationsJson as Reservation[];
