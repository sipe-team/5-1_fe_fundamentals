import { useNavigate } from 'react-router-dom';
import type { Room } from '@/types/reservation';
import { useFilteredRooms, useReservations } from '../hooks';
import { useTimelineSlots } from '../hooks/useTimelineSlots';
import TimelineRow from './TimelineRow';

interface TimelineBodyProps {
  date: string;
  filterRooms: (room: Room) => boolean;
}

export default function TimelineBody({ date, filterRooms }: TimelineBodyProps) {
  const navigate = useNavigate();
  const { data: rooms } = useFilteredRooms(filterRooms);
  const { data: reservations } = useReservations(date);
  const { getCellsForRoom } = useTimelineSlots(reservations);

  const handleReservationClick = (id: string) => {
    navigate(`/reservations/${id}`);
  };

  const handleEmptyClick = (roomId: string, startTime: string) => {
    const params = new URLSearchParams({ roomId, date, startTime });
    navigate(`/reservations/new?${params}`);
  };

  if (rooms.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={19} className="text-sm text-slate-500 text-center py-12">
            조건에 맞는 회의실이 없습니다.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rooms.map((room) => (
        <TimelineRow
          key={room.id}
          room={room}
          cells={getCellsForRoom(room.id)}
          onReservationClick={handleReservationClick}
          onEmptyClick={handleEmptyClick}
        />
      ))}
    </tbody>
  );
}
