import { parseAsString, useQueryStates } from "nuqs";

import type { Reservation } from "@/shared/types";

export default function useReservationPrefill() {
  const [prefill] = useQueryStates({
    reservationId: parseAsString.withDefault(""),
    roomId: parseAsString.withDefault(""),
    title: parseAsString.withDefault(""),
    organizer: parseAsString.withDefault(""),
    date: parseAsString.withDefault(""),
    attendees: parseAsString.withDefault(""),
    startTime: parseAsString.withDefault(""),
    endTime: parseAsString.withDefault(""),
  });

  return prefill;
}

export function generateReservationParams(reservation: Reservation) {
  const searchParams = new URLSearchParams({
    reservationId: reservation.id,
    roomId: reservation.roomId,
    title: reservation.title,
    organizer: reservation.organizer,
    date: reservation.date,
    attendees: String(reservation.attendees),
    startTime: reservation.startTime,
    endTime: reservation.endTime,
  });

  return `/reservations/new?${searchParams.toString()}`;
}
