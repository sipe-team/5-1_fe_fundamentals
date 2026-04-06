import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRooms } from '@/features/rooms/hooks/queries/useRooms';
import { useReservations } from '@/features/reservations/hooks/queries/useReservations';
import {
  groupReservationsByRoomId,
  sortRoomsByFloorAndName,
} from '@/features/reservations/lib/timelineTableUtils';
import {
  reservationsOverlappingSlot,
  parseTimeToMinutes,
  TIMELINE_SLOTS,
  TIMELINE_HOURS,
} from '@/features/reservations/lib/timelineSlots';
import { cn } from '@/lib/utils';
import type { Equipment } from '@/features/rooms/types';

interface TimelineTableProps {
  date: string;
  capacity?: number | null;
  equipment?: Equipment[];
}

export function TimelineTable({ date, capacity = null, equipment = [] }: TimelineTableProps) {
  const navigate = useNavigate();
  const { data: rooms } = useRooms();
  const { data: reservations } = useReservations(date);

  const sortedRooms = useMemo(() => {
    const sorted = sortRoomsByFloorAndName(rooms);
    return sorted.filter((room) => {
      if (capacity !== null && room.capacity < capacity) return false;
      if (equipment.length > 0 && !equipment.every((e) => room.equipment.includes(e))) return false;
      return true;
    });
  }, [rooms, capacity, equipment]);
  const byRoom = useMemo(() => groupReservationsByRoomId(reservations), [reservations]);

  const handleReservationClick = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
  };

  const handleEmptySlotClick = (roomId: string, startTime: string) => {
    navigate(`/reservations/new?roomId=${roomId}&date=${date}&startTime=${startTime}`);
  };

  return (
    <section className="flex flex-col min-h-0 flex-1 w-full">
      <p className="mb-2 text-sm text-gray-600">
        {date} 예약된 회의실 : {reservations.length}건
      </p>
      <div className="w-fit max-w-full overflow-y-auto overflow-x-auto overscroll-none rounded-lg border border-slate-200 border-r-0 bg-white">
        <table className="w-fit border-separate border-spacing-0  text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 left-0 z-30 w-36 min-w-36 border-r border-r-slate-300 bg-slate-50 border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold text-slate-600"
              >
                회의실
              </th>
              {TIMELINE_HOURS.map((hour) => (
                <th
                  key={hour}
                  scope="colgroup"
                  colSpan={2}
                  className="sticky top-0 z-20 bg-slate-50 border-b border-r border-slate-200 px-1 py-2 text-center text-sm font-semibold text-slate-800"
                >
                  {hour}시
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRooms.map((room) => {
              const roomReservations = byRoom.get(room.id) ?? [];
              return (
                <tr key={room.id}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-36 min-w-36 border-r border-r-slate-300 border-b border-slate-100 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800"
                  >
                    <span className="block">{room.name}</span>
                    <span className="mt-[4px] block text-xs font-normal text-slate-500">
                      {room.floor}F
                    </span>
                  </th>
                  {TIMELINE_SLOTS.map((slot, index) => {
                    const overlapping = reservationsOverlappingSlot(
                      roomReservations,
                      slot.startMinutes,
                      slot.endMinutes,
                    );
                    const isReservationStart = overlapping.some(
                      (r) => parseTimeToMinutes(r.startTime) === slot.startMinutes,
                    );
                    const isHalfHourBorder = index % 2 === 0;
                    return (
                      <td
                        key={`${room.id}-${slot.startMinutes}`}
                        className={cn(
                          'max-w-17 min-w-17 border-b border-slate-100 px-1.5 py-2 align-top text-xs text-slate-700 cursor-pointer',
                          isHalfHourBorder
                            ? '[border-right-style:dashed] border-r border-slate-200'
                            : 'border-r border-slate-200',
                          overlapping.length > 0 ? 'bg-blue-300' : '',
                        )}
                        onClick={() =>
                          overlapping.length > 0
                            ? handleReservationClick(overlapping[0].id)
                            : handleEmptySlotClick(room.id, slot.label)
                        }
                      >
                        {isReservationStart ? (
                          <span className="overflow-visible whitespace-nowrap bg-blue-300">
                            {overlapping[0]?.title}
                          </span>
                        ) : (
                          <span className="text-slate-300"> </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
