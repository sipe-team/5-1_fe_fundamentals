import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod/v3';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import { useCreateReservation } from '@/features/reservations/hooks/queries/useCreateReservation';
import { reservationsQueryKeys } from '@/features/reservations/hooks/queries/querykeys';
import {
  TIMELINE_SLOTS,
  formatMinutesAsTime,
  TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES,
  TIMELINE_SLOT_MINUTES,
  parseTimeToMinutes,
} from '@/features/reservations/lib/timelineSlots';
import type { ConflictError } from '@/features/reservations/types';
import { useRooms } from '@/features/rooms/hooks/queries/useRooms';

const reservationSchema = z
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

export type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  defaultRoomId: string;
  defaultDate: string;
  defaultStartTime: string;
}

const END_TIME_SLOTS = TIMELINE_SLOTS.map((slot) => ({
  label: formatMinutesAsTime(slot.endMinutes),
  value: formatMinutesAsTime(slot.endMinutes),
})).filter((slot) => {
  const [h, m] = slot.value.split(':').map(Number);
  return h * 60 + m <= TIMELINE_BUSINESS_LAST_SLOT_START_MINUTES + TIMELINE_SLOT_MINUTES;
});

export function ReservationForm({
  defaultRoomId,
  defaultDate,
  defaultStartTime,
}: ReservationFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rooms } = useRooms();
  const [conflictError, setConflictError] = useState<ConflictError | null>(null);

  const { mutate: createReservation, isPending } = useCreateReservation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.allByDate(data.reservation.date),
      });
      toast.success('예약이 생성되었습니다.');
      navigate(`/?date=${data.reservation.date}`);
    },
    onError: async (error) => {
      if (error instanceof HTTPError && error.response.status === 409) {
        const conflict = await error.response.json<ConflictError>();
        setConflictError(conflict);
        return;
      }
      toast.error('예약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      roomId: defaultRoomId,
      date: defaultDate,
      startTime: defaultStartTime,
      endTime: '',
      title: '',
      organizer: '',
      attendees: 1,
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    createReservation(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-[480px]">
        <div className="flex flex-col gap-1">
          <Label htmlFor="roomId">회의실</Label>
          <Controller
            name="roomId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="roomId" className="w-full">
                  <SelectValue placeholder="회의실을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.roomId?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="date">날짜</Label>
          <Input id="date" type="date" {...register('date')} />
          <p className="min-h-4 text-xs text-destructive">{errors.date?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="startTime">시작 시간</Label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue placeholder="시작 시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_SLOTS.map((slot) => (
                    <SelectItem key={slot.label} value={slot.label}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.startTime?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="endTime">종료 시간</Label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="endTime" className="w-full">
                  <SelectValue placeholder="종료 시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {END_TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.endTime?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="title">회의 제목</Label>
          <Input id="title" type="text" {...register('title')} />
          <p className="min-h-4 text-xs text-destructive">{errors.title?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="organizer">예약자명</Label>
          <Input id="organizer" type="text" {...register('organizer')} />
          <p className="min-h-4 text-xs text-destructive">{errors.organizer?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="attendees">참석 인원</Label>
          <Input
            id="attendees"
            type="number"
            min={1}
            {...register('attendees', { valueAsNumber: true })}
          />
          <p className="min-h-4 text-xs text-destructive">{errors.attendees?.message}</p>
        </div>

        <Button type="submit" className="mt-2" disabled={isPending}>
          {isPending ? '예약 중...' : '예약 생성'}
        </Button>
      </form>

      <Dialog open={conflictError !== null} onOpenChange={() => setConflictError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 시간 충돌</DialogTitle>
            <DialogDescription>{conflictError?.message}</DialogDescription>
          </DialogHeader>
          {conflictError?.conflictWith && (
            <div className="rounded-md bg-muted px-4 py-3 text-sm">
              <p className="font-medium">{conflictError.conflictWith.title}</p>
              <p className="text-muted-foreground">
                {conflictError.conflictWith.startTime} ~ {conflictError.conflictWith.endTime}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setConflictError(null)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
