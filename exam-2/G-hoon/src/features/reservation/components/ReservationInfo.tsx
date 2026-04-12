import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import type { Reservation, Room } from '@/types/reservation';

interface ReservationInfoProps {
  reservation: Reservation;
  room?: Room;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="size-4 text-slate-400 shrink-0" />
      <span className="text-sm text-slate-500 w-16 shrink-0">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}

export default function ReservationInfo({
  reservation,
  room,
}: ReservationInfoProps) {
  const roomLabel = room
    ? `${room.name} (${room.floor}F · ${room.capacity}인)`
    : reservation.roomId;

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        {reservation.title}
      </h3>
      <p className="text-xs text-slate-400 mb-4">예약 ID: {reservation.id}</p>

      <div className="divide-y divide-slate-100">
        <InfoRow icon={MapPin} label="회의실" value={roomLabel} />
        <InfoRow icon={Calendar} label="날짜" value={reservation.date} />
        <InfoRow
          icon={Clock}
          label="시간"
          value={`${reservation.startTime} ~ ${reservation.endTime}`}
        />
        <InfoRow icon={User} label="예약자" value={reservation.organizer} />
        <InfoRow
          icon={Users}
          label="참석"
          value={`${reservation.attendees}명`}
        />
      </div>
    </div>
  );
}
