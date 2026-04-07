import { css } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { TIME_SLOTS } from "@/reservation/constants";
import { useAvailableTimeSlots } from "@/reservation/hooks/useAvailableTimeSlots";
import {
  createReservationFormSchema,
  type ReservationFormInputValues,
  type ReservationFormValues,
} from "@/reservation/schemas/reservation";
import type {
  CreateReservationRequest,
  Room,
  SubmitError,
} from "@/reservation/types";
import { Match, Switch } from "@/components/Switch";
import { Button } from "@/components/Button";
import { ErrorText, HelperText } from "@/components/Text";
import { color, fontSize, radius, spacing } from "@/styles/tokens";

interface ReservationFormProps {
  rooms: Room[];
  initialValues: {
    roomId: string;
    date: string;
    startTime: string;
  };
  onSubmit: (data: CreateReservationRequest) => void;
  isPending: boolean;
  submitError: SubmitError | null;
}

export function ReservationForm({
  rooms,
  initialValues,
  onSubmit,
  isPending,
  submitError,
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
      startTime: TIME_SLOTS.includes(initialValues.startTime) ? initialValues.startTime : "",
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
  const availability = useAvailableTimeSlots(roomId, date, startTime);
  const canSelectStart = availability.status === "ready";
  const canSelectEnd = canSelectStart && !!startTime && availability.availableEndTimes.length > 0;

  const clearTimeRange = () => {
    resetField("startTime", { defaultValue: "" });
    resetField("endTime", { defaultValue: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SubmitErrorBanner error={submitError} />

      <FormField label="회의실" error={errors.roomId?.message}>
        <select id="roomId" {...register("roomId", { onChange: clearTimeRange })}>
          <option value="">선택하세요</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.capacity}인, {room.floor}F)
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="날짜" error={errors.date?.message}>
        <input id="date" type="date" {...register("date", { onChange: clearTimeRange })} />
      </FormField>

      <FormField label="시작 시간" error={errors.startTime?.message}>
        <select
          id="startTime"
          {...register("startTime", {
            onChange: () => resetField("endTime", { defaultValue: "" }),
          })}
          disabled={!canSelectStart}
        >
          <option value="">선택하세요</option>
          {canSelectStart && availability.availableStartTimes.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
        <Switch>
          <Match when={availability.status === "idle"}>
            <HelperText>날짜와 회의실을 먼저 선택하세요.</HelperText>
          </Match>
          <Match when={availability.status === "loading"}>
            <HelperText>확인 중...</HelperText>
          </Match>
          <Match when={availability.status === "error"}>
            <ErrorText>예약 현황을 불러올 수 없습니다.</ErrorText>
          </Match>
          <Match when={availability.status === "empty"}>
            <HelperText>예약 가능한 시작 시간이 없습니다.</HelperText>
          </Match>
        </Switch>
      </FormField>

      <FormField label="종료 시간" error={errors.endTime?.message}>
        <select id="endTime" {...register("endTime")} disabled={!canSelectEnd}>
          <option value="">선택하세요</option>
          {availability.availableEndTimes.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
        <Switch>
          <Match when={!startTime}>
            <HelperText>시작 시간을 먼저 선택하세요.</HelperText>
          </Match>
          <Match when={availability.status === "loading"}>
            <HelperText>확인 중...</HelperText>
          </Match>
          <Match when={availability.status === "error"}>
            <ErrorText>예약 현황을 불러올 수 없습니다.</ErrorText>
          </Match>
          <Match when={availability.availableEndTimes.length === 0}>
            <HelperText>예약 가능한 종료 시간이 없습니다.</HelperText>
          </Match>
        </Switch>
      </FormField>

      <FormField label="회의 제목" error={errors.title?.message}>
        <input id="title" type="text" {...register("title")} />
      </FormField>

      <FormField label="예약자명" error={errors.organizer?.message}>
        <input id="organizer" type="text" {...register("organizer")} />
      </FormField>

      <FormField
        label="참석 인원"
        error={errors.attendees?.message}
        guide={selectedRoom
          ? `최대 ${selectedRoom.capacity}명까지 입력할 수 있습니다.`
          : "회의실 선택 후 최대 인원을 확인하세요."}
      >
        <input
          id="attendees"
          type="number"
          min={1}
          max={selectedRoom?.capacity}
          {...register("attendees")}
        />
      </FormField>

      <Button type="submit" disabled={isPending || !canSelectStart}>
        {isPending ? "예약 중..." : "예약 생성"}
      </Button>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  guide?: string;
  children: ReactNode;
}

function FormField({ label, error, guide, children }: FormFieldProps) {
  return (
    <div css={fieldStyle}>
      <label>{label}</label>
      {children}
      {guide && <HelperText>{guide}</HelperText>}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function SubmitErrorBanner({ error }: { error: SubmitError | null }) {
  if (!error) return null;

  if (error.type === "conflict" && error.conflict) {
    return (
      <div css={errorBannerStyle}>
        해당 시간대에 &apos;{error.conflict.title}&apos; 예약이 존재합니다
        ({error.conflict.startTime}~{error.conflict.endTime})
      </div>
    );
  }

  return <div css={errorBannerStyle}>{error.message}</div>;
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

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
