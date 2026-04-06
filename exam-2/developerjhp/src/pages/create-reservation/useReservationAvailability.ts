import { useQuery } from "@tanstack/react-query";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  getAvailableEndTimes,
  getAvailableStartTimes,
  getRoomReservations,
} from "@/reservation/utils/reservation";

interface UseReservationAvailabilityParams {
  date: string;
  roomId: string;
  startTime: string;
}

export function useReservationAvailability({
  date,
  roomId,
  startTime,
}: UseReservationAvailabilityParams) {
  const hasAvailabilityContext = Boolean(date && roomId);
  const reservationsQuery = useQuery({
    ...reservationsQueryOptions(date),
    enabled: hasAvailabilityContext,
  });
  const roomReservations = roomId
    ? getRoomReservations(reservationsQuery.data?.reservations ?? [], roomId)
    : [];
  const isAvailabilityPending =
    hasAvailabilityContext && reservationsQuery.isPending;
  const availableStartTimes =
    hasAvailabilityContext && !isAvailabilityPending
      ? getAvailableStartTimes(roomReservations)
      : [];
  const availableEndTimes =
    startTime && hasAvailabilityContext && !isAvailabilityPending
      ? getAvailableEndTimes(roomReservations, startTime)
      : [];

  return {
    isAvailabilityPending,
    availableStartTimes,
    availableEndTimes,
  };
}
