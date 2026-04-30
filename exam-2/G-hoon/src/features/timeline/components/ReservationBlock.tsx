import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReservationBlock as ReservationBlockType } from '../utils/timelineSlots';

const TOOLTIP_WIDTH = 240;
const TOOLTIP_MARGIN = 12;
const TOOLTIP_OFFSET = 8;

interface ReservationBlockProps {
  block: ReservationBlockType;
  onClick: (id: string) => void;
}

interface TooltipPosition {
  left: number;
  top: number;
  placement: 'top' | 'bottom';
}

export default function ReservationBlock({
  block,
  onClick,
}: ReservationBlockProps) {
  const { reservation } = block;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const updateTooltipPosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const left = Math.min(
      window.innerWidth - TOOLTIP_MARGIN - TOOLTIP_WIDTH / 2,
      Math.max(TOOLTIP_MARGIN + TOOLTIP_WIDTH / 2, rect.left + rect.width / 2),
    );
    const shouldPlaceOnTop =
      rect.bottom + TOOLTIP_OFFSET + 110 > window.innerHeight;

    setTooltipPosition({
      left,
      top: shouldPlaceOnTop
        ? rect.top - TOOLTIP_OFFSET
        : rect.bottom + TOOLTIP_OFFSET,
      placement: shouldPlaceOnTop ? 'top' : 'bottom',
    });
  }, []);

  const openTooltip = () => {
    updateTooltipPosition();
    setIsTooltipOpen(true);
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  useEffect(() => {
    if (!isTooltipOpen) return;

    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [isTooltipOpen, updateTooltipPosition]);

  return (
    <td
      colSpan={block.span}
      className="h-0 min-w-0 px-1 border-b border-slate-200"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onClick(reservation.id)}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
        aria-label={`${reservation.title} (${reservation.startTime}~${reservation.endTime}) 상세 보기`}
        aria-describedby={isTooltipOpen ? tooltipId : undefined}
        className="block w-full h-full overflow-hidden text-ellipsis whitespace-nowrap bg-blue-500 text-white text-xs font-medium rounded px-2 py-1.5 hover:bg-blue-600 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        {reservation.title}
      </button>
      {isTooltipOpen &&
        tooltipPosition &&
        createPortal(
          <ReservationTooltip
            id={tooltipId}
            block={block}
            position={tooltipPosition}
          />,
          document.body,
        )}
    </td>
  );
}

function ReservationTooltip({
  id,
  block,
  position,
}: {
  id: string;
  block: ReservationBlockType;
  position: TooltipPosition;
}) {
  const { reservation } = block;
  const translateY = position.placement === 'top' ? 'calc(-100% - 4px)' : '0';

  return (
    <div
      id={id}
      role="tooltip"
      className="pointer-events-none fixed z-50 rounded-md border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 shadow-xl"
      style={{
        left: position.left,
        top: position.top,
        width: TOOLTIP_WIDTH,
        transform: `translate(-50%, ${translateY})`,
      }}
    >
      <p className="truncate font-semibold text-slate-900">
        {reservation.title}
      </p>
      <dl className="mt-2 grid grid-cols-[48px_1fr] gap-x-2 gap-y-1">
        <dt className="text-slate-400">시간</dt>
        <dd className="text-slate-700">
          {reservation.startTime} ~ {reservation.endTime}
        </dd>
        <dt className="text-slate-400">예약자</dt>
        <dd className="truncate text-slate-700">{reservation.organizer}</dd>
        <dt className="text-slate-400">참석</dt>
        <dd className="text-slate-700">{reservation.attendees}명</dd>
      </dl>
    </div>
  );
}
