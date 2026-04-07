import type { Room } from '@/types/reservation';
import type { SlotCell } from '../hooks/useTimelineSlots';
import EmptySlot from './EmptySlot';
import ReservationBlock from './ReservationBlock';

interface TimelineRowProps {
  room: Room;
  cells: SlotCell[];
  onReservationClick: (id: string) => void;
  onEmptyClick: (roomId: string, startTime: string) => void;
}

export default function TimelineRow({
  room,
  cells,
  onReservationClick,
  onEmptyClick,
}: TimelineRowProps) {
  return (
    <tr className="h-full">
      <td className="sticky left-0 z-10 bg-white text-xs text-slate-700 px-3 py-2 border-b border-r border-slate-200 font-medium whitespace-nowrap">
        <div>{room.name}</div>
        <div className="text-slate-400 font-normal">
          {room.floor}F · {room.capacity}인
        </div>
      </td>
      {cells.map((cell) =>
        cell.type === 'reservation' ? (
          <ReservationBlock
            key={cell.block.startIdx}
            block={cell.block}
            onClick={onReservationClick}
          />
        ) : (
          <EmptySlot
            key={cell.slotIdx}
            slotIdx={cell.slotIdx}
            time={cell.time}
            roomName={room.name}
            onClick={() => onEmptyClick(room.id, cell.time)}
          />
        ),
      )}
    </tr>
  );
}
