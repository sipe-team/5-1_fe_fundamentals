import { css } from "@emotion/react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { color, fontSize, radius, spacing } from "@/styles/tokens";

interface ReservationTimeFieldProps {
  field: UseFormRegisterReturn;
  options: string[];
  disabled: boolean;
  guide?: string;
  error?: string;
}

interface ReservationTimeFieldsProps {
  startTime: ReservationTimeFieldProps;
  endTime: ReservationTimeFieldProps;
}

export function ReservationTimeFields({
  startTime,
  endTime,
}: ReservationTimeFieldsProps) {
  return (
    <>
      <div css={fieldStyle}>
        <label htmlFor="startTime">시작 시간</label>
        <select id="startTime" {...startTime.field} disabled={startTime.disabled}>
          <option value="">선택하세요</option>
          {startTime.options.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {startTime.guide && <p css={helperTextStyle}>{startTime.guide}</p>}
        {startTime.error && <p css={errorMsgStyle}>{startTime.error}</p>}
      </div>

      <div css={fieldStyle}>
        <label htmlFor="endTime">종료 시간</label>
        <select id="endTime" {...endTime.field} disabled={endTime.disabled}>
          <option value="">선택하세요</option>
          {endTime.options.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {endTime.guide && <p css={helperTextStyle}>{endTime.guide}</p>}
        {endTime.error && <p css={errorMsgStyle}>{endTime.error}</p>}
      </div>
    </>
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

  select {
    padding: 6px ${spacing.sm};
    border: 1px solid ${color.borderInput};
    border-radius: ${radius.sm};
  }
`;

const helperTextStyle = css`
  color: ${color.textSecondary};
  font-size: ${fontSize.sm};
  margin-top: 2px;
`;

const errorMsgStyle = css`
  color: ${color.danger};
  font-size: ${fontSize.md};
  margin-top: 2px;
`;
