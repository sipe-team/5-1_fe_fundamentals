import { css } from "@emotion/react";
import { HttpError } from "@/reservation/api/client";
import { color, radius, spacing } from "@/styles/tokens";
import type { ConflictError } from "@/reservation/types";

interface ReservationFormErrorProps {
  error: Error | null;
}

export function ReservationFormError({
  error,
}: ReservationFormErrorProps) {
  const conflictInfo =
    error instanceof HttpError && error.status === 409
      ? (error.body as ConflictError).conflictWith
      : null;
  const serverError =
    error instanceof HttpError && error.status >= 500
      ? "서버 오류가 발생했습니다. 다시 시도해주세요."
      : null;

  if (!conflictInfo && !serverError) {
    return null;
  }

  return (
    <>
      {conflictInfo && (
        <div css={errorBannerStyle}>
          해당 시간대에 &apos;{conflictInfo.title}&apos; 예약이 존재합니다 (
          {conflictInfo.startTime}~{conflictInfo.endTime})
        </div>
      )}
      {serverError && <div css={errorBannerStyle}>{serverError}</div>}
    </>
  );
}

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
