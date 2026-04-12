import type { Reservation } from '@/shared/types';
import { formatDateLabel, normalizeDateInput } from '@/shared/utils';

export const DEFAULT_DATE = '2026-04-07';
const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 18;
const SLOT_MINUTES = 30;
export const SLOT_WIDTH = 76;
export const ROOM_LABEL_WIDTH = 180;

export const TIME_SLOTS = createTimeSlots();

export interface ReservationPlacement {
  left: number;
  width: number;
}

export function formatTimelineDate(date: string) {
  return formatDateLabel(date);
}

export function normalizeTimelineDate(date: string) {
  return normalizeDateInput(date, DEFAULT_DATE);
}

export function buildReservationCreateHref({
  roomId,
  date,
  startTime,
}: {
  roomId: string;
  date: string;
  startTime: string;
}) {
  const searchParams = new URLSearchParams({
    roomId,
    date,
    startTime,
  });

  return `/reservations/new?${searchParams.toString()}`;
}

export function groupReservationsByRoom(reservations: Reservation[]) {
  const reservationsByRoom = new Map<string, Reservation[]>();

  for (const reservation of reservations) {
    const roomReservations = reservationsByRoom.get(reservation.roomId);

    if (roomReservations) {
      roomReservations.push(reservation);
      continue;
    }

    reservationsByRoom.set(reservation.roomId, [reservation]);
  }

  return reservationsByRoom;
}

export function getVisibleReservationPlacement(
  startTime: string,
  endTime: string,
): ReservationPlacement | null {
  const timelineStartMinutes = TIMELINE_START_HOUR * 60;
  const timelineEndMinutes = TIMELINE_END_HOUR * 60;
  const reservationStartMinutes = toMinutes(startTime);
  const reservationEndMinutes = toMinutes(endTime);

  const visibleStartMinutes = Math.max(
    reservationStartMinutes,
    timelineStartMinutes,
  );
  const visibleEndMinutes = Math.min(reservationEndMinutes, timelineEndMinutes);

  if (visibleStartMinutes >= visibleEndMinutes) {
    return null;
  }

  const startOffset =
    (visibleStartMinutes - timelineStartMinutes) / SLOT_MINUTES;
  const durationSlots =
    (visibleEndMinutes - visibleStartMinutes) / SLOT_MINUTES;

  return {
    left: startOffset * SLOT_WIDTH + 4,
    width: Math.max(durationSlots * SLOT_WIDTH - 8, SLOT_WIDTH - 8),
  };
}

function createTimeSlots() {
  const slots: string[] = [];

  for (let hour = TIMELINE_START_HOUR; hour < TIMELINE_END_HOUR; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }

  return slots;
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);

  return hour * 60 + minute;
}
