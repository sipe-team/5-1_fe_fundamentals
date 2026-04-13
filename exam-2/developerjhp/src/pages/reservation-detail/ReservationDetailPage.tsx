import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { SuspenseQueries } from "@suspensive/react-query-5";
import { ReservationTimelinePreview } from "@/pages/reservation-detail/ReservationTimelinePreview";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import { HttpError } from "@/reservation/api/client";
import { reservationQueryOptions } from "@/reservation/api/reservations";
import { useDeleteReservation } from "@/reservation/hooks/useDeleteReservation";
import type { Reservation, Room } from "@/reservation/types";
import { color, radius, spacing } from "@/styles/tokens";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Match, Switch } from "@/components/Switch";

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = parseReturnTo(location.state);

  return (
    <AsyncBoundary
      pendingFallback={<p>예약 상세를 불러오는 중입니다.</p>}
      errorFallback={({ error, reset }) => (
        <Switch fallback={<ErrorFallback error={error} reset={reset} />}>
          <Match when={isNotFound(error)}>
            <EmptyState
              title="존재하지 않는 예약입니다"
              description="예약이 삭제되었거나 잘못된 주소입니다."
              action={<Button onClick={() => navigate(returnTo)}>돌아가기</Button>}
            />
          </Match>
        </Switch>
      )}
    >
      <SuspenseQueries
        queries={[reservationQueryOptions(id!), roomsQueryOptions()]}
      >
        {([{ data: { reservation } }, { data: { rooms } }]) => {
          const room = rooms.find((item) => item.id === reservation.roomId) ?? null;

          return (
            <ReservationDetail
              reservation={reservation}
              returnTo={returnTo}
              roomName={room?.name ?? reservation.roomId}
              room={room}
            />
          );
        }}
      </SuspenseQueries>
    </AsyncBoundary>
  );
}

function ReservationDetail({
  reservation,
  returnTo,
  roomName,
  room,
}: {
  reservation: Reservation;
  returnTo: string;
  roomName: string;
  room: Room | null;
}) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteReservation();

  return (
    <div css={detailStyle}>
      <h1 css={css`margin-bottom: ${spacing.lg};`}>예약 상세</h1>
      <dl>
        <DetailItem label="회의실" value={roomName} />
        <DetailItem label="날짜" value={reservation.date} />
        <DetailItem label="시간" value={`${reservation.startTime} ~ ${reservation.endTime}`} />
        <DetailItem label="제목" value={reservation.title} />
        <DetailItem label="예약자" value={reservation.organizer} />
        <DetailItem label="참석 인원" value={`${reservation.attendees}명`} />
      </dl>

      <ReservationTimelinePreview reservation={reservation} room={room} />

      <Switch>
        <Match when={isNotFound(deleteMutation.error)}>
          <div css={errorBannerStyle}>
            이미 삭제된 예약입니다.
            <Button
              variant="secondary"
              onClick={() => navigate(returnTo)}
              css={css`margin-left: ${spacing.sm};`}
            >
              돌아가기
            </Button>
          </div>
        </Match>
        <Match when={deleteMutation.error != null}>
          <div css={errorBannerStyle}>
            삭제 실패: 서버 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        </Match>
      </Switch>

      <Button
        variant="danger"
        onClick={() => {
          if (!window.confirm("예약을 취소하시겠습니까?")) return;

          deleteMutation.mutate(
            { id: reservation.id, date: reservation.date },
            { onSuccess: () => navigate(returnTo) },
          );
        }}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "취소 중..." : "예약 취소"}
      </Button>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}

function parseReturnTo(state: unknown): string {
  if (
    state != null &&
    typeof state === "object" &&
    "from" in state &&
    typeof state.from === "string"
  ) {
    return state.from;
  }
  return "/";
}

const detailStyle = css`
  dl {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: ${spacing.sm} ${spacing.lg};
    margin-bottom: ${spacing.xl};
  }
  dt {
    font-weight: bold;
  }
`;

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
