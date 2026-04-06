import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { TIMELINE_SLOTS, END_TIME_SLOTS } from '@/features/reservations/lib/timelineSlots';
import { useRooms } from '@/features/rooms/hooks/queries/useRooms';
import { ConflictErrorDialog } from './ConflictErrorDialog';
import { FormFieldWithLabel } from './FormFieldWithLabel';
import { TimeSelectField } from './TimeSelectField';
import { useReservationForm } from '../../hooks/useReservationForm';

interface ReservationFormProps {
  defaultRoomId: string;
  defaultDate: string;
  defaultStartTime: string;
}

export function ReservationForm({
  defaultRoomId,
  defaultDate,
  defaultStartTime,
}: ReservationFormProps) {
  const { data: rooms } = useRooms();
  const {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    isPending,
    conflictError,
    clearConflictError,
  } = useReservationForm({ defaultRoomId, defaultDate, defaultStartTime });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-[480px]">
        {/* 회의실 선택 */}
        <FormFieldWithLabel htmlFor="roomId" label="회의실" errorMessage={errors.roomId?.message}>
          <TimeSelectField
            id="roomId"
            name="roomId"
            control={control}
            slots={rooms.map((room) => ({ label: room.name, value: room.id }))}
            placeholder="회의실을 선택하세요"
          />
        </FormFieldWithLabel>
        {/* 날짜 선택 */}
        <FormFieldWithLabel htmlFor="date" label="날짜" errorMessage={errors.date?.message}>
          <Input id="date" type="date" {...register('date')} />
        </FormFieldWithLabel>
        {/* 시작 시간 선택 */}
        <FormFieldWithLabel
          htmlFor="startTime"
          label="시작 시간"
          errorMessage={errors.startTime?.message}
        >
          <TimeSelectField
            id="startTime"
            name="startTime"
            control={control}
            slots={TIMELINE_SLOTS.map((slot) => ({ label: slot.label, value: slot.label }))}
            placeholder="시작 시간을 선택하세요"
          />
        </FormFieldWithLabel>
        {/* 종료 시간 선택 */}
        <FormFieldWithLabel
          htmlFor="endTime"
          label="종료 시간"
          errorMessage={errors.endTime?.message}
        >
          <TimeSelectField
            id="endTime"
            name="endTime"
            control={control}
            slots={END_TIME_SLOTS}
            placeholder="종료 시간을 선택하세요"
          />
        </FormFieldWithLabel>
        {/* 회의 제목 입력 */}
        <FormFieldWithLabel htmlFor="title" label="회의 제목" errorMessage={errors.title?.message}>
          <Input id="title" type="text" {...register('title')} />
        </FormFieldWithLabel>
        {/* 예약자명 입력 */}
        <FormFieldWithLabel
          htmlFor="organizer"
          label="예약자명"
          errorMessage={errors.organizer?.message}
        >
          <Input id="organizer" type="text" {...register('organizer')} />
        </FormFieldWithLabel>
        {/* 참석 인원 입력 */}
        <FormFieldWithLabel
          htmlFor="attendees"
          label="참석 인원"
          errorMessage={errors.attendees?.message}
        >
          <Input
            id="attendees"
            type="number"
            min={1}
            {...register('attendees', { valueAsNumber: true })}
          />
        </FormFieldWithLabel>

        <Button type="submit" className="mt-2" disabled={isPending}>
          {isPending ? '예약 중...' : '예약 생성'}
        </Button>
      </form>

      <ConflictErrorDialog conflictError={conflictError} onClose={clearConflictError} />
    </>
  );
}
