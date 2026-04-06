import type { Equipment } from "@/reservation/types";
import { createTimeSlots, formatTime } from "@/reservation/utils/time";

export const RESERVATION_TIME_POLICY = {
  startHour: 9,
  endHour: 18,
  intervalMinutes: 30,
  maxDurationSlots: 8,
} as const;

export const DAY_END_TIME = formatTime(
  RESERVATION_TIME_POLICY.endHour * 60,
);

export const TIME_SLOTS = createTimeSlots(RESERVATION_TIME_POLICY);

export const ALL_EQUIPMENT = [
  "monitor",
  "whiteboard",
  "video_conference",
  "projector",
] as const satisfies readonly Equipment[];

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  monitor: "모니터",
  whiteboard: "화이트보드",
  video_conference: "화상회의",
  projector: "빔프로젝터",
};

export const MIN_CAPACITY_OPTIONS = [
  { value: 0, label: "전체" },
  { value: 2, label: "2인 이상" },
  { value: 4, label: "4인 이상" },
  { value: 6, label: "6인 이상" },
  { value: 8, label: "8인 이상" },
  { value: 10, label: "10인 이상" },
  { value: 15, label: "15인 이상" },
] as const;
