import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { TIME_SLOTS } from "@/reservation/constants";
import type { Reservation, Room } from "@/reservation/types";
import { timeToSlotIndex } from "@/reservation/utils/reservationTime";
import { ClickableCell } from "@/components/ClickableCell";
import { EmptyState } from "@/components/EmptyState";
import { color, spacing, fontSize } from "@/styles/tokens";

interface TimelineProps {
  rooms: Room[];
  reservations: Reservation[];
  onReservationClick: (id: string) => void;
  onEmptySlotClick: (roomId: string, startTime: string) => void;
}

export function Timeline({
  rooms,
  reservations,
  onReservationClick,
  onEmptySlotClick,
}: TimelineProps) {
  if (rooms.length === 0) {
    return <EmptyState title="필터 조건에 맞는 회의실이 없습니다." />;
  }

  const reservationsByRoom = groupReservationsByRoom(reservations);

  return (
    <div css={css`overflow-x: auto;`} role="region" aria-label="회의실 예약 타임라인">
      <table css={tableStyle}>
        <thead>
          <tr>
            <th css={roomNameStyle}>회의실</th>
            {TIME_SLOTS.map((slot) => (
              <th key={slot}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <RoomRow
              key={room.id}
              room={room}
              slotMap={reservationsByRoom.get(room.id) ?? EMPTY_SLOT_MAP}
              onReservationClick={onReservationClick}
              onEmptySlotClick={(startTime) => onEmptySlotClick(room.id, startTime)}
            />
          ))}
        </tbody>
      </table>
      {reservations.length === 0 && (
        <p
          css={css`
            text-align: center;
            color: ${color.textMuted};
            margin-top: ${spacing.lg};
          `}
        >
          이 날짜에 예약이 없습니다.
        </p>
      )}
    </div>
  );
}

const EMPTY_SLOT_MAP = new Map<string, Reservation>();

function groupReservationsByRoom(
  reservations: Reservation[],
): Map<string, Map<string, Reservation>> {
  const grouped = new Map<string, Map<string, Reservation>>();

  for (const reservation of reservations) {
    let roomMap = grouped.get(reservation.roomId);
    if (!roomMap) {
      roomMap = new Map();
      grouped.set(reservation.roomId, roomMap);
    }
    roomMap.set(reservation.startTime, reservation);
  }

  return grouped;
}

interface RoomRowProps {
  room: Room;
  slotMap: Map<string, Reservation>;
  onReservationClick: (id: string) => void;
  onEmptySlotClick: (startTime: string) => void;
}

function RoomRow({
  room,
  slotMap,
  onReservationClick,
  onEmptySlotClick,
}: RoomRowProps) {
  return (
    <tr>
      <td css={roomNameStyle}>{room.name}</td>
      {buildRowCells({ room, slotMap, onReservationClick, onEmptySlotClick })}
    </tr>
  );
}

function buildRowCells({
  room,
  slotMap,
  onReservationClick,
  onEmptySlotClick,
}: RoomRowProps): ReactNode[] {
  const cells: ReactNode[] = [];
  let skipUntil = -1;

  for (let i = 0; i < TIME_SLOTS.length; i++) {
    if (i < skipUntil) continue;

    const slotTime = TIME_SLOTS[i];
    const reservation = slotMap.get(slotTime);

    if (reservation) {
      const endIdx = timeToSlotIndex(reservation.endTime);
      const span = endIdx - i;
      skipUntil = i + span;

      cells.push(
        <ClickableCell
          key={slotTime}
          colSpan={span}
          css={reservedStyle}
          ariaLabel={`${reservation.title}, ${reservation.startTime}부터 ${reservation.endTime}까지`}
          onActivate={() => onReservationClick(reservation.id)}
        >
          {reservation.title}
        </ClickableCell>,
      );
    } else {
      cells.push(
        <ClickableCell
          key={slotTime}
          css={emptyStyle}
          ariaLabel={`${room.name} ${slotTime} 빈 시간대, 클릭하여 예약`}
          onActivate={() => onEmptySlotClick(slotTime)}
        />,
      );
    }
  }

  return cells;
}

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    border: 1px solid ${color.border};
    padding: ${spacing.xs};
    font-size: ${fontSize.sm};
    text-align: center;
    height: 40px;
  }

  th {
    background: ${color.bgHeader};
    position: sticky;
    top: 0;
  }
`;

const reservedStyle = css`
  background: ${color.primary};
  color: white;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;

  &:hover,
  &:focus-visible {
    background: ${color.primaryHover};
    outline: 2px solid ${color.primaryFocus};
    outline-offset: -2px;
  }
`;

const emptyStyle = css`
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: ${color.bgEmptyHover};
    outline: 2px solid ${color.bgEmptyFocus};
    outline-offset: -2px;
  }
`;

const roomNameStyle = css`
  && {
    text-align: left;
  }
  min-width: 120px;
  font-weight: bold;
  background: ${color.bgRow};
`;
