import { Link } from "wouter";
import { css } from "@emotion/react";

import { useMyReservations } from "@/domains/my-reservations/hooks";

import {
  isEmpty,
  formatCreatedAt,
  formatReservationDate,
} from "@/shared/utils";
import { Card } from "@/shared/ui";

export default function MyReservationsList() {
  const { data: reservations } = useMyReservations();

  if (isEmpty(reservations)) {
    return <EmptyReservations />;
  }

  return (
    <section css={listStyle}>
      {reservations.map((reservation) => (
        <Link
          key={reservation.id}
          href={`/reservations/${reservation.id}`}
          css={linkResetStyle}
        >
          <Card interactive>
            <Card.Header>
              <Card.TitleGroup>
                <Card.Title>{reservation.title}</Card.Title>
                <Card.Subtitle>{reservation.organizer}</Card.Subtitle>
              </Card.TitleGroup>
            </Card.Header>

            <Card.Content>
              <Card.MetaGrid>
                <ReservationMetaItem
                  label="예약 날짜"
                  value={formatReservationDate(reservation.date)}
                />
                <ReservationMetaItem
                  label="예약 시간"
                  value={`${reservation.startTime} - ${reservation.endTime}`}
                />
                <ReservationMetaItem
                  label="참석 인원"
                  value={`${reservation.attendees}명`}
                />
                <ReservationMetaItem
                  label="생성 일시"
                  value={formatCreatedAt(reservation.createdAt)}
                />
              </Card.MetaGrid>
            </Card.Content>
          </Card>
        </Link>
      ))}
    </section>
  );
}

function EmptyReservations() {
  return (
    <section css={emptyStateStyle}>
      <h2 css={emptyTitleStyle}>아직 생성한 예약이 없습니다.</h2>
      <p css={emptyDescriptionStyle}>
        타임라인에서 빈 시간대를 선택하거나 상단의 예약 생성 버튼으로 새 예약을
        만들어보세요.
      </p>
    </section>
  );
}

function ReservationMetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card.MetaItem>
      <Card.MetaLabel>{label}</Card.MetaLabel>
      <Card.MetaValue>{value}</Card.MetaValue>
    </Card.MetaItem>
  );
}

const listStyle = css({
  display: "grid",
  gap: "16px",
  marginTop: "24px",
});

const linkResetStyle = css({
  textDecoration: "none",
  color: "inherit",
});

const emptyStateStyle = css({
  display: "grid",
  gap: "12px",
  marginTop: "24px",
  padding: "28px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  backgroundColor: "#f8fafc",
});

const emptyTitleStyle = css({
  margin: 0,
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#0f172a",
});

const emptyDescriptionStyle = css({
  margin: 0,
  color: "#475569",
  lineHeight: 1.6,
});
