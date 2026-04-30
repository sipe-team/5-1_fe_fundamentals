import {
  slotIndexToTime,
  TIME_SLOTS,
  timeToSlotIndex,
} from '@/shared/constants/timePolicy';
import type { Reservation } from '@/types/reservation';

export interface ReservationBlock {
  reservation: Reservation;
  startIdx: number;
  span: number;
}

export type SlotCell =
  | { type: 'reservation'; block: ReservationBlock }
  | { type: 'empty'; slotIdx: number; time: string };

export function createTimelineCells(reservations: Reservation[]) {
  const reservationsByRoom = new Map<string, Reservation[]>();

  for (const reservation of reservations) {
    const roomReservations = reservationsByRoom.get(reservation.roomId) ?? [];
    roomReservations.push(reservation);
    reservationsByRoom.set(reservation.roomId, roomReservations);
  }

  return {
    getCellsForRoom(roomId: string): SlotCell[] {
      const roomReservations = reservationsByRoom.get(roomId) ?? [];
      const occupied = new Set<number>();
      const blockByStartIndex = new Map<number, ReservationBlock>();

      for (const reservation of roomReservations) {
        const startIdx = timeToSlotIndex(reservation.startTime);
        const endIdx = timeToSlotIndex(reservation.endTime);
        const block = { reservation, startIdx, span: endIdx - startIdx };

        blockByStartIndex.set(startIdx, block);

        for (let index = startIdx; index < endIdx; index++) {
          occupied.add(index);
        }
      }

      const cells: SlotCell[] = [];
      let slotIdx = 0;

      while (slotIdx < TIME_SLOTS.length) {
        const block = blockByStartIndex.get(slotIdx);

        if (block) {
          cells.push({ type: 'reservation', block });
          slotIdx += block.span;
          continue;
        }

        if (!occupied.has(slotIdx)) {
          cells.push({
            type: 'empty',
            slotIdx,
            time: slotIndexToTime(slotIdx),
          });
        }

        slotIdx++;
      }

      return cells;
    },
  };
}
