import { z } from 'zod';
import type { Room } from '@/reservation/types';

const requiredTrimmedString = (message: string) =>
  z.string().trim().min(1, message);

const attendeesSchema = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '참석 인원을 입력해주세요',
      });
      return z.NEVER;
    }

    const parsed = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(parsed)) {
      ctx.addIssue({
        code: 'custom',
        message: '참석 인원을 입력해주세요',
      });
      return z.NEVER;
    }

    return parsed;
  })
  .pipe(
    z.number().int().min(1, '최소 1명 이상이어야 합니다'),
  );

export function createReservationFormSchema(rooms: Room[]) {
  return z
    .object({
      roomId: z.string().min(1, '회의실을 선택해주세요'),
      date: z.string().min(1, '날짜를 선택해주세요'),
      startTime: z.string().min(1, '시작 시간을 선택해주세요'),
      endTime: z.string().min(1, '종료 시간을 선택해주세요'),
      title: requiredTrimmedString('회의 제목을 입력해주세요'),
      organizer: requiredTrimmedString('예약자명을 입력해주세요'),
      attendees: attendeesSchema,
    })
    .superRefine((data, ctx) => {
      const selectedRoom = rooms.find((room) => room.id === data.roomId);

      if (!selectedRoom) {
        return;
      }

      if (data.startTime >= data.endTime) {
        ctx.addIssue({
          code: 'custom',
          path: ['endTime'],
          message: '종료 시간은 시작 시간보다 이후여야 합니다',
        });
      }

      const reservationStart = new Date(`${data.date}T${data.startTime}`);

      if (!Number.isNaN(reservationStart.getTime()) && reservationStart < new Date()) {
        ctx.addIssue({
          code: 'custom',
          path: ['date'],
          message: '과거 시간에는 예약할 수 없습니다',
        });
      }

      if (data.attendees > selectedRoom.capacity) {
        ctx.addIssue({
          code: 'custom',
          path: ['attendees'],
          message: `참석 인원은 ${selectedRoom.capacity}명을 초과할 수 없습니다`,
        });
      }
    });
}

export type ReservationFormValues = z.infer<
  ReturnType<typeof createReservationFormSchema>
>;
export type ReservationFormInputValues = z.input<
  ReturnType<typeof createReservationFormSchema>
>;
