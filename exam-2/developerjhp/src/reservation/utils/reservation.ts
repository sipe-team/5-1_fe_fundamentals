import { TIME_SLOTS } from "@/reservation/constants";
import type { Reservation } from "@/reservation/types";
import { getEndTimeOptions } from "@/reservation/utils/reservationTime";

export function getRoomReservations(
  reservations: Reservation[],
  roomId: string,
): Reservation[] {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .sort((left, right) => left.startTime.localeCompare(right.startTime));
}

export function hasTimeOverlap(
  reservations: Reservation[],
  startTime: string,
  endTime: string,
): boolean {
  return reservations.some(
    (reservation) =>
      startTime < reservation.endTime && reservation.startTime < endTime,
  );
}

export function getAvailableEndTimes(
  reservations: Reservation[],
  startTime: string,
): string[] {
  return getEndTimeOptions(startTime).filter(
    (endTime) => !hasTimeOverlap(reservations, startTime, endTime),
  );
}

export function getAvailableStartTimes(reservations: Reservation[]): string[] {
  return TIME_SLOTS.filter(
    (startTime) => getAvailableEndTimes(reservations, startTime).length > 0,
  );
}
