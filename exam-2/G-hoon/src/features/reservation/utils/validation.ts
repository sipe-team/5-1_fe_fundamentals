import dayjs from 'dayjs';
import type { CreateReservationRequest, Room } from '@/types/reservation';

interface ValidationContext {
  rooms: Room[];
}

export interface ValidationErrors {
  roomId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  organizer?: string;
  attendees?: string;
}

export function validateReservation(
  values: CreateReservationRequest,
  context: ValidationContext,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.roomId) {
    errors.roomId = '회의실을 선택해주세요.';
  }

  if (!values.date) {
    errors.date = '날짜를 선택해주세요.';
  } else if (dayjs(values.date).isBefore(dayjs(), 'day')) {
    errors.date = '과거 날짜에는 예약할 수 없습니다.';
  }

  if (!values.startTime) {
    errors.startTime = '시작 시간을 선택해주세요.';
  }

  if (!values.endTime) {
    errors.endTime = '종료 시간을 선택해주세요.';
  }

  if (
    values.startTime &&
    values.endTime &&
    values.startTime >= values.endTime
  ) {
    errors.endTime = '종료 시간은 시작 시간 이후여야 합니다.';
  }

  if (values.date && values.startTime) {
    const selected = dayjs(`${values.date} ${values.startTime}`);
    const currentSlotStart = dayjs()
      .minute(dayjs().minute() < 30 ? 0 : 30)
      .second(0)
      .millisecond(0);
    if (selected.isBefore(currentSlotStart)) {
      errors.startTime = '과거 시간에는 예약할 수 없습니다.';
    }
  }

  if (!values.title.trim()) {
    errors.title = '회의 제목을 입력해주세요.';
  }

  if (!values.organizer.trim()) {
    errors.organizer = '예약자명을 입력해주세요.';
  }

  if (values.attendees < 1) {
    errors.attendees = '참석 인원은 1명 이상이어야 합니다.';
  } else if (values.roomId) {
    const room = context.rooms.find((r) => r.id === values.roomId);
    if (room && values.attendees > room.capacity) {
      errors.attendees = `선택한 회의실의 최대 수용 인원은 ${room.capacity}명입니다.`;
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
