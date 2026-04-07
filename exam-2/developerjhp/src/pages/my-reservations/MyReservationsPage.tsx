import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { Link } from "react-router";
import { myReservationsQueryOptions } from "@/reservation/api/reservations";
import type { Reservation } from "@/reservation/types";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { EmptyState } from "@/components/EmptyState";
import { color, spacing } from "@/styles/tokens";

export function MyReservationsPage() {
  return (
    <div>
      <h1 css={css`margin-bottom: ${spacing.lg};`}>내 예약</h1>
      <AsyncBoundary>
        <SuspenseQuery {...myReservationsQueryOptions()}>
          {({ data: { reservations } }) => <MyReservationsList reservations={reservations} />}
        </SuspenseQuery>
      </AsyncBoundary>
    </div>
  );
}

function MyReservationsList({ reservations }: { reservations: Reservation[] }) {
  if (reservations.length === 0) {
    return <EmptyState title="예약이 없습니다." />;
  }

  return (
    <ul css={listStyle}>
      {reservations.map((reservation) => (
        <ReservationListItem key={reservation.id} reservation={reservation} />
      ))}
    </ul>
  );
}

function ReservationListItem({ reservation }: { reservation: Reservation }) {
  return (
    <li>
      <Link
        to={`/reservations/${reservation.id}`}
        state={{ from: "/my-reservations" }}
        css={itemStyle}
      >
        <strong>{reservation.title}</strong>
        <span css={css`margin-left: ${spacing.md}; color: ${color.textSecondary};`}>
          {reservation.date} {reservation.startTime}~{reservation.endTime}
        </span>
      </Link>
    </li>
  );
}

const listStyle = css`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const itemStyle = css`
  display: block;
  padding: ${spacing.md} ${spacing.lg};
  border: 1px solid ${color.border};
  border-radius: 4px;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: ${color.bgHeader};
  }
`;
