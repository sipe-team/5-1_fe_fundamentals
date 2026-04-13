import { css } from "@emotion/react";
import { SuspenseQuery } from "@suspensive/react-query-5";
import { TimelinePreview } from "@/pages/timeline/Timeline";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import type { Reservation, Room } from "@/reservation/types";
import { color, radius, spacing } from "@/styles/tokens";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { Button } from "@/components/Button";

interface ReservationTimelinePreviewProps {
  reservation: Reservation;
  room: Room | null;
}

export function ReservationTimelinePreview({
  reservation,
  room,
}: ReservationTimelinePreviewProps) {
  if (room == null) {
    return (
      <section css={previewSectionStyle}>
        <h2 css={previewTitleStyle}>해당 날짜 타임라인 미리보기</h2>
        <div css={errorBannerStyle}>
          회의실 정보를 찾을 수 없어 타임라인 미리보기를 표시할 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section css={previewSectionStyle}>
      <h2 css={previewTitleStyle}>해당 날짜 타임라인 미리보기</h2>
      <AsyncBoundary
        pendingFallback={<p>타임라인 미리보기를 불러오는 중입니다.</p>}
        errorFallback={({ reset }) => (
          <div css={errorBannerStyle}>
            타임라인 미리보기를 불러올 수 없습니다.
            <Button
              variant="secondary"
              onClick={reset}
              css={css`
                margin-left: ${spacing.sm};
              `}
            >
              다시 시도
            </Button>
          </div>
        )}
      >
        <SuspenseQuery {...reservationsQueryOptions(reservation.date)}>
          {({ data: { reservations } }) => (
            <TimelinePreview
              rooms={[room]}
              reservations={reservations.filter(
                (item) => item.roomId === reservation.roomId,
              )}
              highlightedReservationId={reservation.id}
            />
          )}
        </SuspenseQuery>
      </AsyncBoundary>
    </section>
  );
}

const previewSectionStyle = css`
  margin-bottom: ${spacing.xl};
`;

const previewTitleStyle = css`
  margin-bottom: ${spacing.md};
`;

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
