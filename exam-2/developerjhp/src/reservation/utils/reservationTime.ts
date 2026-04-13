import {
  DAY_END_TIME,
  RESERVATION_TIME_POLICY,
  TIME_SLOTS,
} from '@/reservation/constants';
import { timeToMinutes } from '@/reservation/utils/time';

export function timeToSlotIndex(time: string): number {
  return (
    (timeToMinutes(time) - RESERVATION_TIME_POLICY.startHour * 60) /
    RESERVATION_TIME_POLICY.intervalMinutes
  );
}

export function getEndTimeOptions(startTime: string): string[] {
  const startIdx = TIME_SLOTS.indexOf(startTime);

  if (startIdx === -1) {
    return [];
  }

  const allEndTimes = [...TIME_SLOTS.slice(startIdx + 1), DAY_END_TIME];

  return allEndTimes.slice(0, RESERVATION_TIME_POLICY.maxDurationSlots);
}

