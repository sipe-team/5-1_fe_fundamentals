import { css } from "@emotion/react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";

import {
  useReservation,
  generateReservationParams,
  useDeleteReservationMutation,
} from "@/domains/reservations/hooks";
import { useRooms } from "@/domains/timeline/hooks";

import type {
  ApiErrorResponse,
  ReservationResponse,
  Room,
} from "@/shared/types";
import { Button, Card } from "@/shared/ui";
import { formatCreatedAt, formatReservationDate } from "@/shared/utils";

function isApiErrorResponse(
  value: ReservationResponse | ApiErrorResponse,
): value is ApiErrorResponse {
  return "error" in value;
}

function isNotFoundError(value: ApiErrorResponse) {
  return value.error === "Not Found";
}

export default function ReservationDetailCard() {
  const { id } = useParams<{ id: string }>();

  const [, setLocation] = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data: reservationResult } = useReservation(id);
  const { data: rooms } = useRooms();
  const { mutateAsync, isPending } = useDeleteReservationMutation(id);

  if (isApiErrorResponse(reservationResult)) {
    if (isNotFoundError(reservationResult)) {
      return (
        <StatusCard
          title="예약을 찾을 수 없습니다."
          description="이미 취소되었거나 잘못된 예약 ID일 수 있습니다."
          actionLabel="타임라인으로 이동"
          onAction={() => setLocation("/")}
        />
      );
    }

    return (
      <StatusCard
        title="예약 상세를 불러오지 못했습니다."
        description={reservationResult.message}
        actionLabel="이전 화면으로 이동"
        onAction={() => setLocation("/my-reservations")}
      />
    );
  }

  const reservation = reservationResult.reservation;
  const room = rooms.find((item: Room) => item.id === reservation.roomId);

  const handleDelete = async () => {
    const shouldDelete = window.confirm("이 예약을 취소하시겠습니까?");
    if (!shouldDelete) return;

    try {
      const result = await mutateAsync();

      if (result.type === "error") {
        setSubmitError(result.data.message);
        return;
      }

      setLocation("/my-reservations");
    } catch {
      setSubmitError("예약 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.TitleGroup>
          <Card.Title>{reservation.title}</Card.Title>
          <Card.Subtitle>{reservation.organizer}</Card.Subtitle>
        </Card.TitleGroup>
      </Card.Header>

      <Card.Content>
        <Card.MetaGrid>
          <DetailMetaItem
            label="회의실"
            value={room ? `${room.name} · ${room.floor}F` : reservation.roomId}
          />
          <DetailMetaItem
            label="예약 날짜"
            value={formatReservationDate(reservation.date)}
          />
          <DetailMetaItem
            label="예약 시간"
            value={`${reservation.startTime} - ${reservation.endTime}`}
          />
          <DetailMetaItem
            label="참석 인원"
            value={`${reservation.attendees}명`}
          />
          <DetailMetaItem
            label="생성 일시"
            value={formatCreatedAt(reservation.createdAt)}
          />
          <DetailMetaItem label="상태" value="예약 완료" />
        </Card.MetaGrid>

        {submitError ? <p css={errorTextStyle}>{submitError}</p> : null}

        <div css={actionBarStyle}>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={() => setLocation(generateReservationParams(reservation))}
          >
            수정
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={() => setLocation("/my-reservations")}
          >
            목록으로
          </Button>
          <Button
            type="button"
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isPending}
          >
            예약 취소
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function DetailMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Card.MetaItem>
      <Card.MetaLabel>{label}</Card.MetaLabel>
      <Card.MetaValue>{value}</Card.MetaValue>
    </Card.MetaItem>
  );
}

function StatusCard({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card>
      <Card.Content>
        <div css={statusContentStyle}>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle>{description}</Card.Subtitle>
        </div>
        <div css={statusActionStyle}>
          <Button type="button" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}

const statusContentStyle = css({
  display: "grid",
  gap: "10px",
});

const statusActionStyle = css({
  display: "flex",
  justifyContent: "flex-end",
});

const actionBarStyle = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  "@media (max-width: 720px)": {
    flexDirection: "column-reverse",
  },
});

const errorTextStyle = css({
  margin: 0,
  color: "#b91c1c",
  fontSize: "0.875rem",
  lineHeight: 1.5,
});
