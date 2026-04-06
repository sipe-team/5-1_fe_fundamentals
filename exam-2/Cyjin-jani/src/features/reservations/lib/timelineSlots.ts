import type { Reservation } from '@/features/reservations/types';

export const TIMELINE_BUSINESS_START_MINUTES = 9 * 60;
export const TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES = 18 * 60;
export const TIMELINE_SLOT_MINUTES = 30;

export interface TimeSlot {
  startMinutes: number;
  endMinutes: number;
  label: string;
}

export function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function formatMinutesAsTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const mo = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(mo).padStart(2, '0')}`;
}

export function buildTimelineSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (
    let t = TIMELINE_BUSINESS_START_MINUTES;
    t < TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES;
    t += TIMELINE_SLOT_MINUTES
  ) {
    slots.push({
      startMinutes: t,
      endMinutes: t + TIMELINE_SLOT_MINUTES,
      label: formatMinutesAsTime(t),
    });
  }
  return slots;
}

export function reservationsOverlappingSlot(
  reservations: Reservation[],
  slotStart: number,
  slotEnd: number,
): Reservation[] {
  return reservations.filter((r) => {
    const resStart = parseTimeToMinutes(r.startTime);
    const resEnd = parseTimeToMinutes(r.endTime);
    return resStart < slotEnd && resEnd > slotStart;
  });
}

export const TIMELINE_SLOTS = buildTimelineSlots();

const TOTAL_HOURS =
  (TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES - TIMELINE_BUSINESS_START_MINUTES) / 60;
const START_HOUR = Math.floor(TIMELINE_BUSINESS_START_MINUTES / 60);

export const TIMELINE_HOURS: number[] = Array.from(
  { length: TOTAL_HOURS },
  (_, i) => START_HOUR + i,
);

export const END_TIME_SLOTS = TIMELINE_SLOTS.map((slot) => ({
  label: formatMinutesAsTime(slot.endMinutes),
  value: formatMinutesAsTime(slot.endMinutes),
})).filter((slot) => {
  const [h, m] = slot.value.split(':').map(Number);
  return h * 60 + m <= TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES + TIMELINE_SLOT_MINUTES;
});
