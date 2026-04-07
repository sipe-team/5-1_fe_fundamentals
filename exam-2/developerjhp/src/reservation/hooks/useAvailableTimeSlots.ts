import { useQuery } from "@tanstack/react-query";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  getAvailableStartTimes,
  getAvailableEndTimes,
  getRoomReservations,
} from "@/reservation/utils/reservation";

export type AvailabilityStatus = "idle" | "loading" | "error" | "ready" | "empty";

export function useAvailableTimeSlots(roomId: string, date: string, startTime: string) {
  const hasContext = Boolean(date && roomId);

  const reservationsQuery = useQuery({
    ...reservationsQueryOptions(date),
    enabled: hasContext,
  });

  if (!hasContext) {
    return { status: "idle" as const, availableStartTimes: [], availableEndTimes: [] };
  }

  if (reservationsQuery.isError) {
    return { status: "error" as const, availableStartTimes: [], availableEndTimes: [], refetch: reservationsQuery.refetch };
  }

  if (reservationsQuery.isPending || !reservationsQuery.data) {
    return { status: "loading" as const, availableStartTimes: [], availableEndTimes: [] };
  }

  const roomReservations = getRoomReservations(reservationsQuery.data.reservations, roomId);
  const availableStartTimes = getAvailableStartTimes(roomReservations);
  const availableEndTimes = startTime ? getAvailableEndTimes(roomReservations, startTime) : [];

  if (availableStartTimes.length === 0) {
    return { status: "empty" as const, availableStartTimes: [], availableEndTimes: [], refetch: reservationsQuery.refetch };
  }

  return {
    status: "ready" as const,
    availableStartTimes,
    availableEndTimes,
    refetch: reservationsQuery.refetch,
  };
}
