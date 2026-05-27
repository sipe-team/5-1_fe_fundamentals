export const RESERVATION_TIME_POLICY = {
  startTime: '09:00',
  endTime: '18:00',
  slotMinutes: 30,
} as const;

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function formatMinutesToTime(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}

function createTimeRange({ includeEnd }: { includeEnd: boolean }): string[] {
  const startMinutes = parseTimeToMinutes(RESERVATION_TIME_POLICY.startTime);
  const endMinutes = parseTimeToMinutes(RESERVATION_TIME_POLICY.endTime);
  const times: string[] = [];

  for (
    let minutes = startMinutes;
    includeEnd ? minutes <= endMinutes : minutes < endMinutes;
    minutes += RESERVATION_TIME_POLICY.slotMinutes
  ) {
    times.push(formatMinutesToTime(minutes));
  }

  return times;
}

export const TIME_OPTIONS = createTimeRange({ includeEnd: true });
export const TIME_SLOTS = createTimeRange({ includeEnd: false });
export const TIME_SLOTS_LENGTH = TIME_SLOTS.length;

export function timeToSlotIndex(time: string): number {
  const startMinutes = parseTimeToMinutes(RESERVATION_TIME_POLICY.startTime);
  const targetMinutes = parseTimeToMinutes(time);

  return Math.floor(
    (targetMinutes - startMinutes) / RESERVATION_TIME_POLICY.slotMinutes,
  );
}

export function slotIndexToTime(slotIndex: number): string {
  const startMinutes = parseTimeToMinutes(RESERVATION_TIME_POLICY.startTime);
  return formatMinutesToTime(
    startMinutes + slotIndex * RESERVATION_TIME_POLICY.slotMinutes,
  );
}
