import type {
  FieldErrors,
  UseFormRegisterReturn,
} from "react-hook-form";
import { useReservationAvailability } from "@/pages/create-reservation/useReservationAvailability";
import type { ReservationFormInputValues } from "@/reservation/schemas/reservation";

interface UseReservationTimeFieldsParams {
  roomId: string;
  date: string;
  startTime: string;
  errors: FieldErrors<ReservationFormInputValues>;
  startTimeField: UseFormRegisterReturn;
  endTimeField: UseFormRegisterReturn;
}

type TimeFieldStatus = "blocked" | "loading" | "ready" | "empty";

const START_TIME_GUIDE_BY_STATUS: Record<TimeFieldStatus, string | undefined> = {
  blocked: "날짜와 회의실을 먼저 선택하세요.",
  loading: "예약 가능한 시작 시간을 확인하는 중입니다.",
  ready: undefined,
  empty: "선택한 날짜와 회의실에는 예약 가능한 시작 시간이 없습니다.",
};

const END_TIME_GUIDE_BY_STATUS: Record<TimeFieldStatus, string | undefined> = {
  blocked: "시작 시간을 먼저 선택하세요.",
  loading: "예약 가능한 종료 시간을 확인하는 중입니다.",
  ready: undefined,
  empty: "선택한 시작 시간으로 예약 가능한 종료 시간이 없습니다.",
};

function getStartTimeStatus({
  date,
  roomId,
  isAvailabilityPending,
  availableStartTimes,
}: {
  date: string;
  roomId: string;
  isAvailabilityPending: boolean;
  availableStartTimes: string[];
}): TimeFieldStatus {
  if (!date || !roomId) {
    return "blocked";
  }

  if (isAvailabilityPending) {
    return "loading";
  }

  return availableStartTimes.length > 0 ? "ready" : "empty";
}

function getEndTimeStatus({
  startTime,
  isAvailabilityPending,
  availableEndTimes,
}: {
  startTime: string;
  isAvailabilityPending: boolean;
  availableEndTimes: string[];
}): TimeFieldStatus {
  if (!startTime) {
    return "blocked";
  }

  if (isAvailabilityPending) {
    return "loading";
  }

  return availableEndTimes.length > 0 ? "ready" : "empty";
}

export function useReservationTimeFields({
  roomId,
  date,
  startTime,
  errors,
  startTimeField,
  endTimeField,
}: UseReservationTimeFieldsParams) {
  const { isAvailabilityPending, availableStartTimes, availableEndTimes } =
    useReservationAvailability({
      date,
      roomId,
      startTime,
    });
  const startTimeStatus = getStartTimeStatus({
    date,
    roomId,
    isAvailabilityPending,
    availableStartTimes,
  });
  const endTimeStatus = getEndTimeStatus({
    startTime,
    isAvailabilityPending,
    availableEndTimes,
  });

  return {
    isAvailabilityPending,
    fields: {
      startTime: {
        field: startTimeField,
        options: availableStartTimes,
        disabled: startTimeStatus !== "ready",
        guide: START_TIME_GUIDE_BY_STATUS[startTimeStatus],
        error: errors.startTime?.message,
      },
      endTime: {
        field: endTimeField,
        options: availableEndTimes,
        disabled: endTimeStatus !== "ready",
        guide: END_TIME_GUIDE_BY_STATUS[endTimeStatus],
        error: errors.endTime?.message,
      },
    },
  };
}
