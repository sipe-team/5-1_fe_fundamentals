import type { Room } from '@/types/reservation';
import type { SlotCell } from '../utils/timelineSlots';
import EmptySlot from './EmptySlot';
import ReservationBlock from './ReservationBlock';

interface TimelineRowProps {
  room: Room;
  cells: SlotCell[];
  selectedSlotIndexes: Set<number>;
  onReservationClick: (id: string) => void;
  onEmptyClick: (roomId: string, startTime: string) => void;
  onSelectionStart: (roomId: string, slotIdx: number) => void;
  onSelectionEnter: (roomId: string, slotIdx: number) => void;
  onSelectionEnd: (roomId: string, slotIdx: number) => void;
}

export default function TimelineRow({
  room,
  cells,
  selectedSlotIndexes,
  onReservationClick,
  onEmptyClick,
  onSelectionStart,
  onSelectionEnter,
  onSelectionEnd,
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
            isSelected={selectedSlotIndexes.has(cell.slotIdx)}
            onClick={() => onEmptyClick(room.id, cell.time)}
            onMouseDown={() => onSelectionStart(room.id, cell.slotIdx)}
            onMouseEnter={() => onSelectionEnter(room.id, cell.slotIdx)}
            onMouseUp={() => onSelectionEnd(room.id, cell.slotIdx)}
          />
        ),
      )}
    </tr>
  );
}
