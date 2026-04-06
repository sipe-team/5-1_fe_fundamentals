import { useQuery } from "@tanstack/react-query";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  getAvailableStartTimes,
  getAvailableEndTimes,
  getRoomReservations,
} from "@/reservation/utils/reservation";

type TimeFieldStatus = "blocked" | "loading" | "ready" | "empty";

export function useAvailableTimeSlots(
  roomId: string,
  date: string,
  startTime: string,
) {
  const hasContext = Boolean(date && roomId);

  const reservationsQuery = useQuery({
    ...reservationsQueryOptions(date),
    enabled: hasContext,
  });

  const roomReservations = roomId
    ? getRoomReservations(reservationsQuery.data?.reservations ?? [], roomId)
    : [];

  const isPending = hasContext && reservationsQuery.isPending;

  const availableStartTimes =
    hasContext && !isPending ? getAvailableStartTimes(roomReservations) : [];

  const availableEndTimes =
    startTime && hasContext && !isPending
      ? getAvailableEndTimes(roomReservations, startTime)
      : [];

  const startTimeStatus: TimeFieldStatus = !hasContext
    ? "blocked"
    : isPending
      ? "loading"
      : availableStartTimes.length > 0
        ? "ready"
        : "empty";

  const endTimeStatus: TimeFieldStatus = !startTime
    ? "blocked"
    : isPending
      ? "loading"
      : availableEndTimes.length > 0
        ? "ready"
        : "empty";

  return {
    availableStartTimes,
    availableEndTimes,
    startTimeStatus,
    endTimeStatus,
    isPending,
  };
}
