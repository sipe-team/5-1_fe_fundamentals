import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useReservations } from '@/domains/reservations/hooks';
import { useRooms } from '@/domains/rooms/hooks';
import useTimelineFilters, {
  filterRoomsByTimelineFilters,
} from '@/domains/timeline/hooks/useTimelineFilters';

import type { Reservation, Room } from '@/shared/types';
import { Input } from '@/shared/ui';

import {
  dateInputStyle,
  dateLabelStyle,
  emptyTextStyle,
  headerStyle,
  reservationBlockStyle,
  reservationMetaStyle,
  reservationTitleStyle,
  roomCellStyle,
  roomHeaderCellStyle,
  roomMetaStyle,
  roomNameStyle,
  sectionStyle,
  sectionTitleStyle,
  slotLinkStyle,
  timeCellStyle,
  timelineGridStyle,
  timelineHeaderStyle,
  timelineLaneStyle,
  timelineRowStyle,
  timelineRowsStyle,
  timelineTrackStyle,
  timelineWrapperStyle,
  titleGroupStyle,
  visuallyHiddenStyle,
} from './TimelineGrid.styles';
import {
  buildReservationCreateHref,
  DEFAULT_DATE,
  formatTimelineDate,
  getVisibleReservationPlacement,
  groupReservationsByRoom,
  normalizeTimelineDate,
  TIME_SLOTS,
} from './TimelineGrid.utils';

export default function TimelineGrid() {
  const { data: rooms } = useRooms();
  const [date, setDate] = useQueryState(
    'date',
    parseAsString.withDefault(DEFAULT_DATE),
  );
  const normalizedDate = normalizeTimelineDate(date);
  const { data: reservations } = useReservations(normalizedDate);

  const { filters } = useTimelineFilters();

  useEffect(() => {
    if (date !== normalizedDate) {
      void setDate(normalizedDate, { history: 'replace' });
    }
  }, [date, normalizedDate, setDate]);

  const filteredRooms = filterRoomsByTimelineFilters(rooms, filters);
  const reservationsByRoom = useMemo(() => {
    return groupReservationsByRoom(reservations);
  }, [reservations]);
  const hasFilteredRooms = filteredRooms.length > 0;
  const formattedDate = formatTimelineDate(normalizedDate);

  return (
    <section css={sectionStyle}>
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
                reservations={reservationsByRoom.get(room.id) ?? []}
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
