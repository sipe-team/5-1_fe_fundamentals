import reservationsJson from '@/shared/reservations';
import roomsJson from '@/shared/rooms';
import type { Reservation, Room } from '@/types/reservation';

export const initialRooms: Room[] = roomsJson as Room[];
export const initialReservations: Reservation[] =
  reservationsJson as Reservation[];
