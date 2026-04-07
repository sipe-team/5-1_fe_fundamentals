import type { ReservationBlock as ReservationBlockType } from '../hooks/useTimelineSlots';

interface ReservationBlockProps {
  block: ReservationBlockType;
  onClick: (id: string) => void;
}

export default function ReservationBlock({
  block,
  onClick,
}: ReservationBlockProps) {
  const { reservation } = block;

  return (
    <td
      colSpan={block.span}
      className="relative h-0 px-1 border-b border-slate-200"
    >
      <button
        type="button"
        onClick={() => onClick(reservation.id)}
        aria-label={`${reservation.title} (${reservation.startTime}~${reservation.endTime}) 상세 보기`}
        className="w-full h-full bg-blue-500 text-white text-xs font-medium rounded px-2 py-1.5 truncate hover:bg-blue-600 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        {reservation.title}
      </button>
    </td>
  );
}
