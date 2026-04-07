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

  const reservationsByDate = groupReservationsByDate(reservations);

  return (
    <div css={groupListStyle}>
      {reservationsByDate.map(([date, reservations]) => (
        <section key={date}>
          <h2 css={groupTitleStyle}>{date}</h2>
          <ul css={listStyle}>
            {reservations.map((reservation) => (
              <ReservationListItem
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ReservationListItem({ reservation }: { reservation: Reservation }) {
  return (
    <li>
      <Link
        to={`/reservations/${reservation.id}`}
        state={{ from: "/my-reservations" }}
        aria-label={`${reservation.title}, ${reservation.date} ${reservation.startTime}부터 ${reservation.endTime}까지 상세 보기`}
        css={itemStyle}
      >
        <strong>{reservation.title}</strong>
        <span css={css`margin-left: ${spacing.md}; color: ${color.textSecondary};`}>
          {reservation.startTime}~{reservation.endTime}
        </span>
      </Link>
    </li>
  );
}

function groupReservationsByDate(reservations: Reservation[]) {
  const grouped = new Map<string, Reservation[]>();
  const sortedReservations = [...reservations].sort((left, right) => {
    if (left.date !== right.date) {
      return left.date.localeCompare(right.date);
    }

    return left.startTime.localeCompare(right.startTime);
  });

  for (const reservation of sortedReservations) {
    const group = grouped.get(reservation.date);

    if (group) {
      group.push(reservation);
      continue;
    }

    grouped.set(reservation.date, [reservation]);
  }

  return Array.from(grouped.entries());
}

const groupListStyle = css`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const groupTitleStyle = css`
  margin-bottom: ${spacing.sm};
`;

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

  &:focus-visible {
    outline: 2px solid ${color.primaryFocus};
    outline-offset: 2px;
  }
`;
