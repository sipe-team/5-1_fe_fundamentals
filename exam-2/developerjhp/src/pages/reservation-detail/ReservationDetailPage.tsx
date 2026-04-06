import { css } from "@emotion/react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import { HttpError } from "@/reservation/api/client";
import { reservationQueryOptions } from "@/reservation/api/reservations";
import { useDeleteReservation } from "@/reservation/hooks/useDeleteReservation";
import { color, spacing, radius } from "@/styles/tokens";

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error, refetch } = useQuery(
    reservationQueryOptions(id!),
  );
  const deleteMutation = useDeleteReservation();

  const returnTo = (location.state as { from?: string } | null)?.from ?? "/";
  const roomsQuery = useQuery(roomsQueryOptions());

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error instanceof HttpError && error.status === 404) {
    return (
      <div css={centerStyle}>
        <h2>존재하지 않는 예약입니다</h2>
        <p>예약이 삭제되었거나 잘못된 주소입니다.</p>
        <button type="button" onClick={() => navigate(returnTo)} css={btnStyle}>
          타임라인으로 돌아가기
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div css={centerStyle}>
        <h2>오류가 발생했습니다</h2>
        <p>{error.message}</p>
        <button type="button" onClick={() => refetch()} css={btnStyle}>
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) return null;

  const reservation = data.reservation;
  const roomName =
    roomsQuery.data?.rooms.find((r) => r.id === reservation.roomId)?.name ??
    reservation.roomId;

  const handleDelete = () => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;

    deleteMutation.mutate(
      { id: reservation.id, date: reservation.date },
      {
        onSuccess: () => navigate(returnTo),
      },
    );
  };

  return (
    <div css={detailStyle}>
      <h1
        css={css`
          margin-bottom: ${spacing.lg};
        `}
      >
        예약 상세
      </h1>
      <dl>
        <dt>회의실</dt>
        <dd>{roomName}</dd>
        <dt>날짜</dt>
        <dd>{reservation.date}</dd>
        <dt>시간</dt>
        <dd>
          {reservation.startTime} ~ {reservation.endTime}
        </dd>
        <dt>제목</dt>
        <dd>{reservation.title}</dd>
        <dt>예약자</dt>
        <dd>{reservation.organizer}</dd>
        <dt>참석 인원</dt>
        <dd>{reservation.attendees}명</dd>
      </dl>

      {deleteMutation.error && (
        <div css={errorBannerStyle}>
          삭제 실패: 서버 오류가 발생했습니다. 다시 시도해주세요.
        </div>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        css={dangerBtnStyle}
      >
        {deleteMutation.isPending ? "취소 중..." : "예약 취소"}
      </button>
    </div>
  );
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

const centerStyle = css`
  text-align: center;
  padding: ${spacing.xxl};
`;
const btnStyle = css`
  margin-top: ${spacing.md};
  padding: ${spacing.sm} ${spacing.lg};
  cursor: pointer;
`;

const dangerBtnStyle = css`
  padding: ${spacing.sm} ${spacing.xl};
  cursor: pointer;
  background: ${color.danger};
  color: white;
  border: none;
  border-radius: ${radius.sm};
`;

const errorBannerStyle = css`
  color: ${color.danger};
  background: ${color.dangerBg};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  margin-bottom: ${spacing.md};
`;
