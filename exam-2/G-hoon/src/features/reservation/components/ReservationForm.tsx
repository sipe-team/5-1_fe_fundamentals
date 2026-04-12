import { HTTPError } from 'ky';
import { type FormEvent, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type {
  ConflictError,
  CreateReservationRequest,
  Room,
} from '@/types/reservation';
import { TIME_OPTIONS } from '../constants';
import {
  hasErrors,
  type ValidationErrors,
  validateReservation,
} from '../utils/validation';

const inputBase =
  'w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2';
const inputNormal = `${inputBase} border-slate-300 focus:ring-blue-500`;
const inputError = `${inputBase} border-red-400 focus:ring-red-500`;

interface ReservationFormProps {
  rooms: Room[];
  defaultValues: Partial<CreateReservationRequest>;
  onSubmit: (values: CreateReservationRequest) => Promise<void>;
  isPending: boolean;
}

export default function ReservationForm({
  rooms,
  defaultValues,
  onSubmit,
  isPending,
}: ReservationFormProps) {
  const [values, setValues] = useState<CreateReservationRequest>({
    roomId: defaultValues.roomId ?? '',
    date: defaultValues.date ?? '',
    startTime: defaultValues.startTime ?? '',
    endTime: defaultValues.endTime ?? '',
    title: '',
    organizer: '',
    attendees: 1,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [conflictError, setConflictError] = useState<ConflictError | null>(
    null,
  );

  const updateField = <K extends keyof CreateReservationRequest>(
    key: K,
    value: CreateReservationRequest[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setConflictError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const validationErrors = validateReservation(values, { rooms });
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 409) {
        const data = (await error.response.json()) as ConflictError;
        setConflictError(data);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-2xl"
    >
      <Field label="회의실" error={errors.roomId}>
        <Select
          value={values.roomId}
          onValueChange={(v) => updateField('roomId', v)}
        >
          <SelectTrigger className={errors.roomId ? 'border-red-400' : ''}>
            <SelectValue placeholder="회의실을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} ({room.floor}F · {room.capacity}인)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="날짜" error={errors.date}>
        <input
          type="date"
          value={values.date}
          onChange={(e) => updateField('date', e.target.value)}
          className={errors.date ? inputError : inputNormal}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="시작 시간" error={errors.startTime}>
          <Select
            value={values.startTime}
            onValueChange={(v) => updateField('startTime', v)}
          >
            <SelectTrigger className={errors.startTime ? 'border-red-400' : ''}>
              <SelectValue placeholder="시작 시간" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.slice(0, -1).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="종료 시간" error={errors.endTime}>
          <Select
            value={values.endTime}
            onValueChange={(v) => updateField('endTime', v)}
          >
            <SelectTrigger className={errors.endTime ? 'border-red-400' : ''}>
              <SelectValue placeholder="종료 시간" />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.slice(1).map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="회의 제목" error={errors.title}>
        <input
          type="text"
          value={values.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="예: 주간 스크럼"
          className={errors.title ? inputError : inputNormal}
        />
      </Field>

      <Field label="예약자명" error={errors.organizer}>
        <input
          type="text"
          value={values.organizer}
          onChange={(e) => updateField('organizer', e.target.value)}
          placeholder="예: 김철수"
          className={errors.organizer ? inputError : inputNormal}
        />
      </Field>

      <Field label="참석 인원" error={errors.attendees}>
        <input
          type="number"
          min={1}
          value={values.attendees}
          onChange={(e) => updateField('attendees', Number(e.target.value))}
          className={errors.attendees ? inputError : inputNormal}
        />
      </Field>

      {conflictError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm">
          <p className="font-medium text-red-800">{conflictError.message}</p>
          <p className="mt-1 text-red-600">
            충돌 예약: {conflictError.conflictWith.title} (
            {conflictError.conflictWith.startTime} ~{' '}
            {conflictError.conflictWith.endTime})
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? '예약 중...' : '예약 생성'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: children contain dynamic form controls (input, Select)
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
}
