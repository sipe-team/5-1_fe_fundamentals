import { css } from "@emotion/react";
import { ReservationFormError } from "@/pages/create-reservation/ReservationFormError";
import { ReservationTimeFields } from "@/pages/create-reservation/ReservationTimeFields";
import { useReservationForm } from "@/pages/create-reservation/useReservationForm";
import { useReservationTimeFields } from "@/pages/create-reservation/useReservationTimeFields";
import type { CreateReservationRequest, Room } from "@/reservation/types";
import { color, spacing, fontSize, radius } from "@/styles/tokens";

interface ReservationFormProps {
  rooms: Room[];
  initialValues: {
    roomId: string;
    date: string;
    startTime: string;
  };
  onSubmit: (data: CreateReservationRequest) => void;
  isPending: boolean;
  error: Error | null;
}

export function ReservationForm({
  rooms,
  initialValues,
  onSubmit,
  isPending,
  error,
}: ReservationFormProps) {
  const { form, fields, state } = useReservationForm({
    rooms,
    initialValues,
  });
  const timeFieldView = useReservationTimeFields({
    roomId: state.roomId,
    date: state.date,
    startTime: state.startTime,
    errors: form.errors,
    startTimeField: fields.startTime,
    endTimeField: fields.endTime,
  });

  const attendeesGuide = state.selectedRoom
    ? `최대 ${state.selectedRoom.capacity}명까지 입력할 수 있습니다.`
    : "회의실 선택 후 최대 인원을 확인하세요.";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <ReservationFormError error={error} />

      <div css={fieldStyle}>
        <label htmlFor="roomId">회의실</label>
        <select id="roomId" {...fields.roomId}>
          <option value="">선택하세요</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.capacity}인, {room.floor}F)
            </option>
          ))}
        </select>
        {form.errors.roomId && (
          <p css={errorMsgStyle}>{form.errors.roomId.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="date">날짜</label>
        <input id="date" type="date" {...fields.date} />
        {form.errors.date && (
          <p css={errorMsgStyle}>{form.errors.date.message}</p>
        )}
      </div>

      <ReservationTimeFields
        startTime={timeFieldView.fields.startTime}
        endTime={timeFieldView.fields.endTime}
      />

      <div css={fieldStyle}>
        <label htmlFor="title">회의 제목</label>
        <input id="title" type="text" {...fields.title} />
        {form.errors.title && (
          <p css={errorMsgStyle}>{form.errors.title.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="organizer">예약자명</label>
        <input id="organizer" type="text" {...fields.organizer} />
        {form.errors.organizer && (
          <p css={errorMsgStyle}>{form.errors.organizer.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="attendees">참석 인원</label>
        <input
          id="attendees"
          type="number"
          min={1}
          max={state.selectedRoom?.capacity}
          {...fields.attendees}
        />
        <p css={helperTextStyle}>{attendeesGuide}</p>
        {form.errors.attendees && (
          <p css={errorMsgStyle}>{form.errors.attendees.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || timeFieldView.isAvailabilityPending}
        css={css`
          padding: ${spacing.sm} ${spacing.xl};
          cursor: pointer;
        `}
      >
        {isPending ? "예약 중..." : "예약 생성"}
      </button>
    </form>
  );
}

const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.md};

  label {
    font-weight: bold;
    font-size: ${fontSize.base};
  }

  input,
  select {
    padding: 6px ${spacing.sm};
    border: 1px solid ${color.borderInput};
    border-radius: ${radius.sm};
  }
`;

const errorMsgStyle = css`
  color: ${color.danger};
  font-size: ${fontSize.md};
  margin-top: 2px;
`;

const helperTextStyle = css`
  color: ${color.textSecondary};
  font-size: ${fontSize.sm};
  margin-top: 2px;
`;
