import { z } from 'zod/v3';

import { parseTimeToMinutes } from '@/features/reservations/lib/timelineSlots';

export const reservationFormSchema = z
  .object({
    roomId: z.string().min(1, '회의실을 선택해주세요.'),
    date: z
      .string()
      .min(1, '날짜를 입력해주세요.')
      .refine((val) => val >= new Date().toISOString().slice(0, 10), {
        message: '오늘 이후 날짜를 선택해주세요.',
      }),
    startTime: z.string().min(1, '시작 시간을 선택해주세요.'),
    endTime: z.string().min(1, '종료 시간을 선택해주세요.'),
    title: z.string().min(1, '회의 제목을 입력해주세요.'),
    organizer: z.string().min(1, '예약자명을 입력해주세요.'),
    attendees: z
      .number({ invalid_type_error: '참석 인원을 입력해주세요.' })
      .min(1, '1명 이상이어야 합니다.'),
  })
  .refine((data) => parseTimeToMinutes(data.endTime) > parseTimeToMinutes(data.startTime), {
    message: '종료 시간은 시작 시간보다 늦어야 합니다.',
    path: ['endTime'],
  });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
