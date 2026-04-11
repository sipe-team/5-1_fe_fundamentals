import { useNavigate } from 'react-router-dom';

import { TimelineTableHeader } from '@/features/reservations/components/TimelineTableHeader';
import { TimelineRoomRow } from '@/features/reservations/components/TimelineRoomRow';
import type { Reservation } from '@/features/reservations/types';
import type { Room } from '@/features/rooms/types';

interface TimelineTableViewProps {
  date: string;
  filteredRooms: Room[];
  byRoom: Map<string, Reservation[]>;
  totalReservationCount: number;
}

export function TimelineTableView({
  date,
  filteredRooms,
  byRoom,
  totalReservationCount,
}: TimelineTableViewProps) {
  const navigate = useNavigate();

  const handleReservationClick = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
  };

  const handleEmptySlotClick = (roomId: string, slotLabel: string) => {
    navigate(`/reservations/new?roomId=${roomId}&date=${date}&startTime=${slotLabel}`);
  };

  return (
    <section className="flex flex-col items-center min-h-0 flex-1 w-full max-w-[1370px]">
      <p className="mb-2 text-sm text-gray-600 self-start">
        {date} 예약된 회의실 : {totalReservationCount}건
      </p>
      <div className="w-fit max-w-full overflow-y-auto overflow-x-auto overscroll-none rounded-lg border border-slate-200 border-r-0 bg-white">
        <table className="w-fit border-separate border-spacing-0 text-sm">
          <TimelineTableHeader />
          <tbody>
            {filteredRooms.map((room) => (
              <TimelineRoomRow
                key={room.id}
                room={room}
                roomReservations={byRoom.get(room.id) ?? []}
                onReservationClick={handleReservationClick}
                onEmptySlotClick={handleEmptySlotClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
