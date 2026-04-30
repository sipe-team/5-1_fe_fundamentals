import type { ReservationBlock as ReservationBlockType } from '../utils/timelineSlots';

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
        className="group relative w-full h-full bg-blue-500 text-white text-xs font-medium rounded px-2 py-1.5 truncate hover:bg-blue-600 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        {reservation.title}
        <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-56 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 shadow-lg group-hover:block group-focus-visible:block">
          <span className="block truncate font-semibold text-slate-900">
            {reservation.title}
          </span>
          <span className="mt-1 block">
            {reservation.startTime} ~ {reservation.endTime}
          </span>
          <span className="mt-1 block">
            예약자 {reservation.organizer} · {reservation.attendees}명
          </span>
        </span>
      </button>
    </td>
  );
}
