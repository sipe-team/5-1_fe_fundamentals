import { css } from '@emotion/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'wouter';

import {
  useCreateReservationMutation,
  useReservationPrefill,
} from '@/domains/reservations/hooks';
import {
  type NewReservationFormInput,
  type NewReservationFormOutput,
  newReservationFormSchema,
} from '@/domains/reservations/schemas';
import { useRooms } from '@/domains/rooms/hooks';

import { Button, RHFInput, RHFSelect } from '@/shared/ui';
import { getApiErrorMessage } from '@/shared/utils';

const baseDefaultValues: NewReservationFormInput = {
  title: '',
  organizer: '',
  roomId: '',
  date: '',
  attendees: '',
  startTime: '',
  endTime: '',
};

export default function NewReservationForm() {
  const { data: rooms } = useRooms();
  const [, setLocation] = useLocation();
  const {
    attendees: prefillAttendees,
    date: prefillDate,
    endTime: prefillEndTime,
    organizer: prefillOrganizer,
    reservationId,
    roomId: prefillRoomId,
    startTime: prefillStartTime,
    title: prefillTitle,
  } = useReservationPrefill();
  const isEditMode = reservationId.length > 0;

  const roomOptions = rooms.map((room) => ({
    value: room.id,
    label: `${room.name} · ${room.floor}F · 최대 ${room.capacity}명`,
  }));

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<NewReservationFormInput, undefined, NewReservationFormOutput>({
    resolver: zodResolver(newReservationFormSchema),
    defaultValues: baseDefaultValues,
    mode: 'onBlur', // 필드에서 빠져나올 때 검증
    reValidateMode: 'onChange', // 입력값이 변경될 때 재검증
  });

  const { mutateAsync, isPending } = useCreateReservationMutation();

  useEffect(() => {
    reset({
      title: prefillTitle,
      organizer: prefillOrganizer,
      roomId: prefillRoomId,
      date: prefillDate,
      attendees: prefillAttendees,
      startTime: prefillStartTime,
      endTime: prefillEndTime,
    });
  }, [
    prefillAttendees,
    prefillDate,
    prefillEndTime,
    prefillOrganizer,
    prefillRoomId,
    prefillStartTime,
    prefillTitle,
    reset,
  ]);

  const onSubmit = handleSubmit(async (values) => {
    if (isEditMode) {
      setError('root', {
        type: 'manual',
        message: '수정 기능은 아직 API가 없습니다.',
      });
      return;
    }

    try {
      const { type, data } = await mutateAsync(values);

      if (type === 'conflict') {
        setError('startTime', {
          type: 'conflict',
          message: `${data.message} (${data.conflictWith.title})`,
        });
        setError('endTime', {
          type: 'conflict',
          message: `${data.message} (${data.conflictWith.title})`,
        });
        return;
      }

      reset(baseDefaultValues);
      setLocation('/');
    } catch (error) {
      setError('root', {
        type: 'server',
        message: await getApiErrorMessage(
          error,
          '예약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
        ),
      });
    }
  });

  const hasRootError = !!errors.root?.message;

  return (
    <form css={formStyle} onSubmit={onSubmit}>
      <FormSection
        title={isEditMode ? '예약 수정 정보' : '회의 정보'}
        description="회의실, 날짜, 시간, 참석 인원을 입력하는 영역입니다."
      >
        <div css={singleFieldStackStyle}>
          <RHFInput
            control={control}
            name="title"
            label="회의 제목"
            placeholder="예: 디자인 리뷰"
            fullWidth
          />

          <div css={fieldGridStyle}>
            <RHFInput
              control={control}
              name="organizer"
              label="예약자명"
              placeholder="예: 김철수"
              fullWidth
            />

            <RHFSelect
              control={control}
              name="roomId"
              label="회의실"
              options={roomOptions}
              placeholder="회의실을 선택하세요"
              fullWidth
            />
          </div>
        </div>

        <div css={fieldGridStyle}>
          <RHFInput
            control={control}
            name="date"
            label="날짜"
            type="date"
            fullWidth
          />

          <RHFInput
            control={control}
            name="attendees"
            label="참석 인원"
            type="number"
            min={1}
            placeholder="예: 6"
            fullWidth
          />

          <RHFInput
            control={control}
            name="startTime"
            label="시작 시간"
            type="time"
            fullWidth
          />

          <RHFInput
            control={control}
            name="endTime"
            label="종료 시간"
            type="time"
            fullWidth
          />
        </div>
      </FormSection>

      <div css={actionBarStyle}>
        {hasRootError && <ErrorMessage message={errors?.root?.message || ''} />}
        <Button
          type="button"
          size="lg"
          variant="secondary"
          onClick={() =>
            setLocation(isEditMode ? `/reservations/${reservationId}` : '/')
          }
        >
          취소
        </Button>
        <Button type="submit" size="lg" isLoading={isSubmitting || isPending}>
          {isEditMode ? '수정 저장' : '예약'}
        </Button>
      </div>
    </form>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p css={formErrorStyle}>{message}</p>;
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset css={sectionStyle}>
      <legend css={sectionTitleStyle}>{title}</legend>
      <div css={sectionHeaderStyle}>
        <p css={sectionDescriptionStyle}>{description}</p>
      </div>
      {children}
    </fieldset>
  );
}

const formStyle = css({
  display: 'grid',
  width: '100%',
  gap: '24px',
  marginTop: '24px',
  alignItems: 'start',
});

const sectionStyle = css({
  display: 'grid',
  gap: '20px',
  padding: '24px',
  margin: 0,
  border: '1px solid #e5e7eb',
  borderRadius: '18px',
  backgroundColor: '#ffffff',
  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.05)',
});

const sectionHeaderStyle = css({
  display: 'grid',
  gap: '6px',
});

const sectionTitleStyle = css({
  padding: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: '#111827',
});

const sectionDescriptionStyle = css({
  margin: 0,
  fontSize: '0.9375rem',
  color: '#6b7280',
  lineHeight: 1.5,
});

const fieldGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  '@media (max-width: 720px)': {
    gridTemplateColumns: '1fr',
  },
});

const singleFieldStackStyle = css({
  display: 'grid',
  gap: '16px',
});

const actionBarStyle = css({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  padding: '4px 4px 0',
  '@media (max-width: 720px)': {
    flexDirection: 'column-reverse',
  },
});

const formErrorStyle = css({
  color: '#ef4444',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.5,
});
