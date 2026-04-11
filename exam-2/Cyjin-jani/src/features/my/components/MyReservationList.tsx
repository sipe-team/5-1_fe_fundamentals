import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, BuildingIcon } from 'lucide-react';

import { useMyReservations } from '@/features/my/hooks/queries/useMyReservations';
import { useRooms } from '@/features/rooms/hooks/queries/useRooms';
import { Button } from '@/shared/components/ui/button';
import type { Reservation } from '@/features/reservations/types';

export function MyReservationList() {
  const navigate = useNavigate();
  const { data: reservations } = useMyReservations();
  const { data: rooms } = useRooms();

  const roomNameMap = Object.fromEntries(rooms.map((room) => [room.id, room.name]));

  const isEmpty = reservations.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-medium">예약 내역이 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          타임라인에서 빈 시간대를 클릭해 예약을 만들어보세요.
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          타임라인으로 이동
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {reservations.map((reservation) => (
        <MyReservationItem
          key={reservation.id}
          reservation={reservation}
          roomName={roomNameMap[reservation.roomId] ?? reservation.roomId}
          onClick={() => navigate(`/reservations/${reservation.id}`)}
        />
      ))}
    </ul>
  );
}

interface MyReservationItemProps {
  reservation: Reservation;
  roomName: string;
  onClick: () => void;
}

function MyReservationItem({ reservation, roomName, onClick }: MyReservationItemProps) {
  return (
    <li>
      <button
        type="button"
        className="w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent"
        onClick={onClick}
      >
        <p className="mb-3 font-semibold">{reservation.title}</p>
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BuildingIcon className="h-3.5 w-3.5 shrink-0" />
            <dd>{roomName}</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
            <dd>{reservation.date}</dd>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-3.5 w-3.5 shrink-0" />
            <dd>
              {reservation.startTime} ~ {reservation.endTime}
            </dd>
          </div>
        </dl>
      </button>
    </li>
  );
}
