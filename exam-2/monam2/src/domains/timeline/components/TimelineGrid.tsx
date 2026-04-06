import { Link } from "wouter";
import { useEffect } from "react";
import { css } from "@emotion/react";
import { ko } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import { format, isValid, parseISO } from "date-fns";

import useTimelineFilters, {
  filterRoomsByTimelineFilters,
} from "@/domains/timeline/hooks/useTimelineFilters";
import { useRooms } from "@/domains/timeline/hooks";
import { useReservations } from "@/domains/reservations/hooks";

import { Input } from "@/shared/ui";
import type { Reservation, Room } from "@/shared/types";

const DEFAULT_DATE = "2026-04-07";
const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 18;
const SLOT_MINUTES = 30;
const SLOT_WIDTH = 76;
const ROOM_LABEL_WIDTH = 180;

const TIME_SLOTS = createTimeSlots();

/**
 *  ********** AI로 생성한 코드입니다. **********
 */

export default function TimelineGrid() {
  const { data: rooms } = useRooms();
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(DEFAULT_DATE),
  );
  const normalizedDate = normalizeTimelineDate(date);
  const { data: reservationsData } = useReservations(normalizedDate);

  const { filters } = useTimelineFilters();

  useEffect(() => {
    if (date !== normalizedDate) {
      void setDate(normalizedDate, { history: "replace" });
    }
  }, [date, normalizedDate, setDate]);

  const filteredRooms = rooms
    ? filterRoomsByTimelineFilters(rooms, filters)
    : [];
  const reservations = reservationsData?.reservations ?? [];
  const hasFilteredRooms = filteredRooms.length > 0;
  const formattedDate = formatTimelineDate(normalizedDate);

  return (
    <section
      css={css`
        margin-top: 32px;
      `}
    >
      <div css={headerStyle}>
        <div css={titleGroupStyle}>
          <h2 css={sectionTitleStyle}>회의실 타임라인</h2>
          <p css={dateLabelStyle}>날짜: {formattedDate}</p>
        </div>
        <div css={dateInputStyle}>
          <Input
            type="date"
            label="조회 날짜"
            value={normalizedDate}
            onChange={(event) => setDate(event.target.value || DEFAULT_DATE)}
          />
        </div>
      </div>

      {hasFilteredRooms ? (
        <div css={timelineWrapperStyle}>
          <div css={timelineHeaderStyle}>
            <div css={roomHeaderCellStyle}>회의실</div>
            <div css={timelineTrackStyle}>
              {TIME_SLOTS.map((slot) => (
                <div key={slot} css={timeCellStyle}>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <div css={timelineRowsStyle}>
            {filteredRooms.map((room) => (
              <TimelineRow
                key={room.id}
                room={room}
                date={normalizedDate}
                reservations={reservations.filter(
                  (reservation) => reservation.roomId === room.id,
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyMessage />
      )}
    </section>
  );
}

function TimelineRow({
  room,
  date,
  reservations,
}: {
  room: Room;
  date: string;
  reservations: Reservation[];
}) {
  return (
    <div css={timelineRowStyle}>
      <div css={roomCellStyle}>
        <strong css={roomNameStyle}>{room.name}</strong>
        <span css={roomMetaStyle}>
          {room.floor}F · {room.capacity}명
        </span>
      </div>

      <div css={timelineLaneStyle}>
        <div css={timelineGridStyle}>
          {TIME_SLOTS.map((slot) => (
            <Link
              key={`${room.id}-${slot}`}
              href={buildReservationCreateHref({
                roomId: room.id,
                date,
                startTime: slot,
              })}
              css={slotLinkStyle}
              aria-label={`${room.name} ${date} ${slot} 예약 생성`}
            >
              <span css={visuallyHiddenStyle}>
                {room.name} {date} {slot} 예약 생성
              </span>
            </Link>
          ))}
        </div>

        {reservations.map((reservation) => {
          const placement = getVisibleReservationPlacement(
            reservation.startTime,
            reservation.endTime,
          );

          if (!placement) {
            return null;
          }

          return (
            <Link
              key={reservation.id}
              href={`/reservations/${reservation.id}`}
              css={reservationBlockStyle(placement)}
            >
              <span css={reservationTitleStyle}>{reservation.title}</span>
              <span css={reservationMetaStyle}>
                {reservation.startTime} - {reservation.endTime}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function EmptyMessage() {
  return (
    <p css={emptyTextStyle}>
      선택한 수용인원/장비 조건에 맞는 회의실이 없습니다.
    </p>
  );
}

const sectionTitleStyle = css`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
`;

const headerStyle = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
`;

const titleGroupStyle = css`
  display: grid;
  gap: 6px;
`;

const dateLabelStyle = css`
  margin: 0;
  color: #4b5563;
  font-size: 0.9375rem;
`;

const dateInputStyle = css`
  min-width: 220px;
`;

const timelineWrapperStyle = css`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
`;

const timelineHeaderStyle = css`
  display: grid;
  grid-template-columns: ${ROOM_LABEL_WIDTH}px minmax(
      ${TIME_SLOTS.length * SLOT_WIDTH}px,
      1fr
    );
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const roomHeaderCellStyle = css`
  display: flex;
  align-items: center;
  padding: 16px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
`;

const timelineTrackStyle = css`
  display: grid;
  grid-template-columns: repeat(${TIME_SLOTS.length}, ${SLOT_WIDTH}px);
`;

const timeCellStyle = css`
  padding: 14px 8px;
  border-left: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: #6b7280;
`;

const timelineRowsStyle = css`
  display: grid;
`;

const timelineRowStyle = css`
  display: grid;
  grid-template-columns: ${ROOM_LABEL_WIDTH}px minmax(
      ${TIME_SLOTS.length * SLOT_WIDTH}px,
      1fr
    );
  min-height: 92px;
  border-bottom: 1px solid #f1f5f9;
`;

const roomCellStyle = css`
  display: grid;
  align-content: center;
  gap: 4px;
  padding: 16px;
  border-right: 1px solid #e5e7eb;
  background: #fcfcfd;
`;

const roomNameStyle = css`
  font-size: 0.9375rem;
  color: #111827;
`;

const roomMetaStyle = css`
  font-size: 0.8125rem;
  color: #6b7280;
`;

const timelineLaneStyle = css`
  position: relative;
`;

const timelineGridStyle = css`
  display: grid;
  grid-template-columns: repeat(${TIME_SLOTS.length}, ${SLOT_WIDTH}px);
  height: 100%;
`;

const slotLinkStyle = css`
  border-left: 1px solid #f1f5f9;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: rgba(249, 115, 22, 0.08);
    box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.14);
  }

  &:focus-visible {
    outline: 2px solid #f97316;
    outline-offset: -2px;
    background: rgba(249, 115, 22, 0.1);
  }
`;

const reservationBlockStyle = (placement: ReservationPlacement) => {
  return css`
    position: absolute;
    top: 12px;
    left: ${placement.left}px;
    width: ${placement.width}px;
    min-height: 68px;
    display: grid;
    align-content: center;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ea580c, #f97316);
    color: #ffffff;
    text-decoration: none;
    box-shadow: 0 10px 24px rgba(249, 115, 22, 0.22);
    overflow: hidden;
  `;
};

const reservationTitleStyle = css`
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const reservationMetaStyle = css`
  font-size: 0.75rem;
  opacity: 0.88;
`;

const emptyTextStyle = css`
  margin: 0;
  color: #6b7280;
  font-size: 0.9375rem;
`;

const visuallyHiddenStyle = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

function createTimeSlots() {
  const slots: string[] = [];

  for (let hour = TIMELINE_START_HOUR; hour < TIMELINE_END_HOUR; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    slots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  return slots;
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function formatTimelineDate(date: string) {
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return date;
  }

  return format(parsedDate, "yyyy-MM-dd (EEE)", { locale: ko });
}

function normalizeTimelineDate(date: string) {
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return DEFAULT_DATE;
  }

  return format(parsedDate, "yyyy-MM-dd");
}

function buildReservationCreateHref({
  roomId,
  date,
  startTime,
}: {
  roomId: string;
  date: string;
  startTime: string;
}) {
  const searchParams = new URLSearchParams({
    roomId,
    date,
    startTime,
  });

  return `/reservations/new?${searchParams.toString()}`;
}

interface ReservationPlacement {
  left: number;
  width: number;
}

function getVisibleReservationPlacement(
  startTime: string,
  endTime: string,
): ReservationPlacement | null {
  const timelineStartMinutes = TIMELINE_START_HOUR * 60;
  const timelineEndMinutes = TIMELINE_END_HOUR * 60;
  const reservationStartMinutes = toMinutes(startTime);
  const reservationEndMinutes = toMinutes(endTime);

  const visibleStartMinutes = Math.max(
    reservationStartMinutes,
    timelineStartMinutes,
  );
  const visibleEndMinutes = Math.min(reservationEndMinutes, timelineEndMinutes);

  if (visibleStartMinutes >= visibleEndMinutes) {
    return null;
  }

  const startOffset =
    (visibleStartMinutes - timelineStartMinutes) / SLOT_MINUTES;
  const durationSlots =
    (visibleEndMinutes - visibleStartMinutes) / SLOT_MINUTES;

  return {
    left: startOffset * SLOT_WIDTH + 4,
    width: Math.max(durationSlots * SLOT_WIDTH - 8, SLOT_WIDTH - 8),
  };
}
