import { useQuery } from "@tanstack/react-query";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  getAvailableStartTimes,
  getAvailableEndTimes,
  getRoomReservations,
} from "@/reservation/utils/reservation";

export type AvailabilityStatus = "idle" | "loading" | "error" | "ready" | "empty";

const EMPTY_TIME_SLOTS: string[] = [];

type UnavailableTimeSlots = {
  status: Exclude<AvailabilityStatus, "ready">;
  availableStartTimes: string[];
};

type ReadyTimeSlots = {
  status: "ready";
  availableStartTimes: string[];
  getAvailableEndTimes: (startTime: string) => string[];
};

export type AvailableTimeSlots = UnavailableTimeSlots | ReadyTimeSlots;

export function useAvailableTimeSlots(
  roomId: string,
  date: string,
): AvailableTimeSlots {
  const hasContext = Boolean(date && roomId);

  const reservationsQuery = useQuery({
    ...reservationsQueryOptions(date),
    enabled: hasContext,
  });

  if (!hasContext) {
    return {
      status: "idle" as const,
      availableStartTimes: EMPTY_TIME_SLOTS,
    };
  }

  if (reservationsQuery.isError) {
    return {
      status: "error" as const,
      availableStartTimes: EMPTY_TIME_SLOTS,
    };
  }

  if (reservationsQuery.isPending || !reservationsQuery.data) {
    return {
      status: "loading" as const,
      availableStartTimes: EMPTY_TIME_SLOTS,
    };
  }

  const roomReservations = getRoomReservations(
    reservationsQuery.data.reservations,
    roomId,
  );
  const availableStartTimes = getAvailableStartTimes(roomReservations);

  if (availableStartTimes.length === 0) {
    return {
      status: "empty" as const,
      availableStartTimes: EMPTY_TIME_SLOTS,
    };
  }

  return {
    status: "ready" as const,
    availableStartTimes,
    getAvailableEndTimes: (startTime: string) =>
      getAvailableEndTimes(roomReservations, startTime),
  };
}
