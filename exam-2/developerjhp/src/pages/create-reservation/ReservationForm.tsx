import { css } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HttpError } from "@/reservation/api/client";
import { TIME_SLOTS } from "@/reservation/constants";
import { useAvailableTimeSlots } from "@/reservation/hooks/useAvailableTimeSlots";
import {
  createReservationFormSchema,
  type ReservationFormInputValues,
  type ReservationFormValues,
} from "@/reservation/schemas/reservation";
import type {
  ConflictError,
  CreateReservationRequest,
  Room,
} from "@/reservation/types";
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

const START_TIME_GUIDE = {
  blocked: "날짜와 회의실을 먼저 선택하세요.",
  loading: "예약 가능한 시작 시간을 확인하는 중입니다.",
  ready: undefined,
  empty: "선택한 날짜와 회의실에는 예약 가능한 시작 시간이 없습니다.",
} as const;

const END_TIME_GUIDE = {
  blocked: "시작 시간을 먼저 선택하세요.",
  loading: "예약 가능한 종료 시간을 확인하는 중입니다.",
  ready: undefined,
  empty: "선택한 시작 시간으로 예약 가능한 종료 시간이 없습니다.",
} as const;

function isValidSlot(time: string): boolean {
  return TIME_SLOTS.includes(time);
}

export function ReservationForm({
  rooms,
  initialValues,
  onSubmit,
  isPending,
  error,
}: ReservationFormProps) {
  const schema = createReservationFormSchema(rooms);
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<ReservationFormInputValues, undefined, ReservationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomId: initialValues.roomId || "",
      date: initialValues.date || "",
      startTime: isValidSlot(initialValues.startTime)
        ? initialValues.startTime
        : "",
      endTime: "",
      title: "",
      organizer: "",
      attendees: 1,
    },
  });

  const roomId = watch("roomId");
  const date = watch("date");
  const startTime = watch("startTime");
  const selectedRoom = rooms.find((room) => room.id === roomId);

  const {
    availableStartTimes,
    availableEndTimes,
    startTimeStatus,
    endTimeStatus,
    isPending: isAvailabilityPending,
  } = useAvailableTimeSlots(roomId, date, startTime);

  const clearTimeRange = () => {
    resetField("startTime", { defaultValue: "" });
    resetField("endTime", { defaultValue: "" });
  };

  const roomField = register("roomId", { onChange: clearTimeRange });
  const dateField = register("date", { onChange: clearTimeRange });
  const startTimeField = register("startTime", {
    onChange: () => resetField("endTime", { defaultValue: "" }),
  });
  const endTimeField = register("endTime");

  const conflictInfo =
    error instanceof HttpError && error.status === 409
      ? (error.body as ConflictError).conflictWith
      : null;

  const serverError =
    error instanceof HttpError && error.status >= 500
      ? "서버 오류가 발생했습니다. 다시 시도해주세요."
      : null;

  const attendeesGuide = selectedRoom
    ? `최대 ${selectedRoom.capacity}명까지 입력할 수 있습니다.`
    : "회의실 선택 후 최대 인원을 확인하세요.";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {conflictInfo && (
        <div css={errorBannerStyle}>
          해당 시간대에 &apos;{conflictInfo.title}&apos; 예약이 존재합니다 (
          {conflictInfo.startTime}~{conflictInfo.endTime})
        </div>
      )}
      {serverError && <div css={errorBannerStyle}>{serverError}</div>}

      <div css={fieldStyle}>
        <label htmlFor="roomId">회의실</label>
        <select id="roomId" {...roomField}>
          <option value="">선택하세요</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.capacity}인, {room.floor}F)
            </option>
          ))}
        </select>
        {errors.roomId?.message && (
          <p css={errorMsgStyle}>{errors.roomId.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="date">날짜</label>
        <input id="date" type="date" {...dateField} />
        {errors.date?.message && (
          <p css={errorMsgStyle}>{errors.date.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="startTime">시작 시간</label>
        <select
          id="startTime"
          {...startTimeField}
          disabled={startTimeStatus !== "ready"}
        >
          <option value="">선택하세요</option>
          {availableStartTimes.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {START_TIME_GUIDE[startTimeStatus] && (
          <p css={helperTextStyle}>{START_TIME_GUIDE[startTimeStatus]}</p>
        )}
        {errors.startTime?.message && (
          <p css={errorMsgStyle}>{errors.startTime.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="endTime">종료 시간</label>
        <select
          id="endTime"
          {...endTimeField}
          disabled={endTimeStatus !== "ready"}
        >
          <option value="">선택하세요</option>
          {availableEndTimes.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {END_TIME_GUIDE[endTimeStatus] && (
          <p css={helperTextStyle}>{END_TIME_GUIDE[endTimeStatus]}</p>
        )}
        {errors.endTime?.message && (
          <p css={errorMsgStyle}>{errors.endTime.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="title">회의 제목</label>
        <input id="title" type="text" {...register("title")} />
        {errors.title?.message && (
          <p css={errorMsgStyle}>{errors.title.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="organizer">예약자명</label>
        <input id="organizer" type="text" {...register("organizer")} />
        {errors.organizer?.message && (
          <p css={errorMsgStyle}>{errors.organizer.message}</p>
        )}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="attendees">참석 인원</label>
        <input
          id="attendees"
          type="number"
          min={1}
          max={selectedRoom?.capacity}
          {...register("attendees")}
        />
        <p css={helperTextStyle}>{attendeesGuide}</p>
        {errors.attendees?.message && (
          <p css={errorMsgStyle}>{errors.attendees.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || isAvailabilityPending}
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

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
