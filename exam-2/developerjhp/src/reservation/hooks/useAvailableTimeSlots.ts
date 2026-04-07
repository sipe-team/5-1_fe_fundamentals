import { useQuery } from "@tanstack/react-query";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  getAvailableStartTimes,
  getAvailableEndTimes,
  getRoomReservations,
} from "@/reservation/utils/reservation";

export type AvailabilityStatus = "idle" | "loading" | "error" | "ready" | "empty";

const emptyAvailableTimeSlots = () => [] as string[];

export function useAvailableTimeSlots(roomId: string, date: string) {
  const hasContext = Boolean(date && roomId);

  const reservationsQuery = useQuery({
    ...reservationsQueryOptions(date),
    enabled: hasContext,
  });

  if (!hasContext) {
    return {
      status: "idle" as const,
      availableStartTimes: [],
      getAvailableEndTimes: emptyAvailableTimeSlots,
    };
  }

  if (reservationsQuery.isError) {
    return {
      status: "error" as const,
      availableStartTimes: [],
      getAvailableEndTimes: emptyAvailableTimeSlots,
    };
  }

  if (reservationsQuery.isPending || !reservationsQuery.data) {
    return {
      status: "loading" as const,
      availableStartTimes: [],
      getAvailableEndTimes: emptyAvailableTimeSlots,
    };
  }

  const roomReservations = getRoomReservations(reservationsQuery.data.reservations, roomId);
  const availableStartTimes = getAvailableStartTimes(roomReservations);

  if (availableStartTimes.length === 0) {
    return {
      status: "empty" as const,
      availableStartTimes: [],
      getAvailableEndTimes: emptyAvailableTimeSlots,
    };
  }

  return {
    status: "ready" as const,
    availableStartTimes,
    getAvailableEndTimes: (startTime: string) =>
      getAvailableEndTimes(roomReservations, startTime),
  };
}
