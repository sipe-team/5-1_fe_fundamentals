import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  slotIndexToTime,
  TIME_SLOTS_LENGTH,
  timeToSlotIndex,
} from '@/shared/constants/timePolicy';
import type { Room } from '@/types/reservation';
import { useFilteredRooms, useReservations } from '../hooks';
import { createTimelineCells } from '../utils/timelineSlots';
import TimelineRow from './TimelineRow';

const TOTAL_COLUMNS = TIME_SLOTS_LENGTH + 1;

interface TimelineBodyProps {
  date: string;
  filterRooms: (room: Room) => boolean;
}

interface SlotSelection {
  roomId: string;
  startIdx: number;
  endIdx: number;
}

export default function TimelineBody({ date, filterRooms }: TimelineBodyProps) {
  const navigate = useNavigate();
  const { data: rooms } = useFilteredRooms(filterRooms);
  const { data: reservations } = useReservations(date);
  const { getCellsForRoom } = createTimelineCells(reservations);
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const selectionRef = useRef<SlotSelection | null>(null);

  const clearSelection = useCallback(() => {
    selectionRef.current = null;
    setSelection(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', clearSelection);
    return () => window.removeEventListener('mouseup', clearSelection);
  }, [clearSelection]);

  const handleReservationClick = (id: string) => {
    navigate(`/reservations/${id}`);
  };

  const navigateToNewReservation = (
    roomId: string,
    startSlotIdx: number,
    endSlotIdx: number,
  ) => {
    const startTime = slotIndexToTime(Math.min(startSlotIdx, endSlotIdx));
    const endTime = slotIndexToTime(Math.max(startSlotIdx, endSlotIdx) + 1);
    const params = new URLSearchParams({ roomId, date, startTime, endTime });
    navigate(`/reservations/new?${params}`);
  };

  const handleEmptyClick = (roomId: string, startTime: string) => {
    const startSlotIdx = Math.max(0, timeToSlotIndex(startTime));
    navigateToNewReservation(roomId, startSlotIdx, startSlotIdx);
  };

  const handleSelectionStart = (roomId: string, slotIdx: number) => {
    const nextSelection = { roomId, startIdx: slotIdx, endIdx: slotIdx };
    selectionRef.current = nextSelection;
    setSelection(nextSelection);
  };

  const handleSelectionEnter = (
    roomId: string,
    slotIdx: number,
    emptySlotIndexes: Set<number>,
  ) => {
    setSelection((current) => {
      if (!current || current.roomId !== roomId) return current;

      const start = Math.min(current.startIdx, slotIdx);
      const end = Math.max(current.startIdx, slotIdx);

      for (let index = start; index <= end; index++) {
        if (!emptySlotIndexes.has(index)) return current;
      }

      const nextSelection = { ...current, endIdx: slotIdx };
      selectionRef.current = nextSelection;
      return nextSelection;
    });
  };

  const handleSelectionEnd = (
    roomId: string,
    slotIdx: number,
    emptySlotIndexes: Set<number>,
  ) => {
    const currentSelection = selectionRef.current;

    if (!currentSelection || currentSelection.roomId !== roomId) {
      clearSelection();
      return;
    }

    const start = Math.min(currentSelection.startIdx, slotIdx);
    const end = Math.max(currentSelection.startIdx, slotIdx);

    for (let index = start; index <= end; index++) {
      if (!emptySlotIndexes.has(index)) {
        clearSelection();
        return;
      }
    }

    clearSelection();
    navigateToNewReservation(roomId, start, end);
  };

  if (rooms.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={TOTAL_COLUMNS}
            className="text-sm text-slate-500 text-center py-12"
          >
            조건에 맞는 회의실이 없습니다.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {reservations.length === 0 && (
        <tr>
          <td
            colSpan={TOTAL_COLUMNS}
            className="bg-blue-50 px-4 py-3 text-center text-sm text-blue-700"
          >
            이 날짜에는 예약이 없습니다. 빈 슬롯을 클릭하거나 드래그해서 예약할
            시간을 선택하세요.
          </td>
        </tr>
      )}

      {rooms.map((room) => {
        const cells = getCellsForRoom(room.id);
        const emptySlotIndexes = new Set(
          cells
            .filter((cell) => cell.type === 'empty')
            .map((cell) => cell.slotIdx),
        );
        const selectedSlotIndexes = getSelectedSlotIndexes(selection, room.id);

        return (
          <TimelineRow
            key={room.id}
            room={room}
            cells={cells}
            selectedSlotIndexes={selectedSlotIndexes}
            onReservationClick={handleReservationClick}
            onEmptyClick={handleEmptyClick}
            onSelectionStart={handleSelectionStart}
            onSelectionEnter={(roomId, slotIdx) =>
              handleSelectionEnter(roomId, slotIdx, emptySlotIndexes)
            }
            onSelectionEnd={(roomId, slotIdx) =>
              handleSelectionEnd(roomId, slotIdx, emptySlotIndexes)
            }
          />
        );
      })}
    </tbody>
  );
}

function getSelectedSlotIndexes(
  selection: SlotSelection | null,
  roomId: string,
): Set<number> {
  if (!selection || selection.roomId !== roomId) return new Set();

  const start = Math.min(selection.startIdx, selection.endIdx);
  const end = Math.max(selection.startIdx, selection.endIdx);
  const indexes = new Set<number>();

  for (let index = start; index <= end; index++) {
    indexes.add(index);
  }

  return indexes;
}
