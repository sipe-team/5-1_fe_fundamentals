import { useMemo } from 'react';
import type { Reservation } from '@/types/reservation';
import { TIME_SLOTS } from '../constants';

export interface ReservationBlock {
  reservation: Reservation;
  startIdx: number;
  span: number;
}

export type SlotCell =
  | { type: 'reservation'; block: ReservationBlock }
  | { type: 'empty'; slotIdx: number; time: string };

function timeToSlotIndex(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - 9) * 2 + (m >= 30 ? 1 : 0);
}

export function useTimelineSlots(reservations: Reservation[]) {
  return useMemo(() => {
    const reservationsByRoom = new Map<string, Reservation[]>();
    for (const r of reservations) {
      const list = reservationsByRoom.get(r.roomId) ?? [];
      list.push(r);
      reservationsByRoom.set(r.roomId, list);
    }

    function getCellsForRoom(roomId: string): SlotCell[] {
      const roomReservations = reservationsByRoom.get(roomId) ?? [];
      const occupied = new Set<number>();
      const blocks: ReservationBlock[] = [];

      for (const r of roomReservations) {
        const startIdx = timeToSlotIndex(r.startTime);
        const endIdx = timeToSlotIndex(r.endTime);
        blocks.push({ reservation: r, startIdx, span: endIdx - startIdx });
        for (let i = startIdx; i < endIdx; i++) {
          occupied.add(i);
        }
      }

      const cells: SlotCell[] = [];
      let slotIdx = 0;

      while (slotIdx < TIME_SLOTS.length) {
        const block = blocks.find((b) => b.startIdx === slotIdx);
        if (block) {
          cells.push({ type: 'reservation', block });
          slotIdx += block.span;
        } else if (occupied.has(slotIdx)) {
          slotIdx++;
        } else {
          cells.push({ type: 'empty', slotIdx, time: TIME_SLOTS[slotIdx] });
          slotIdx++;
        }
      }

      return cells;
    }

    return { getCellsForRoom };
  }, [reservations]);
}
