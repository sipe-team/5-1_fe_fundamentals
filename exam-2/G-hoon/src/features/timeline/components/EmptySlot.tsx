interface EmptySlotProps {
  slotIdx: number;
  time: string;
  roomName: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}

export default function EmptySlot({
  slotIdx,
  time,
  roomName,
  isSelected,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: EmptySlotProps) {
  return (
    <td key={slotIdx} className="h-0 px-1 border-b border-slate-200">
      <button
        type="button"
        onClick={(event) => {
          if (event.detail === 0) onClick();
        }}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          onMouseDown();
        }}
        onMouseEnter={onMouseEnter}
        onMouseUp={(event) => {
          event.stopPropagation();
          onMouseUp();
        }}
        aria-label={`${roomName} ${time} 예약하기`}
        className={`w-full h-full rounded border border-dashed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 focus:bg-blue-50 ${
          isSelected
            ? 'border-blue-400 bg-blue-100'
            : 'border-transparent hover:border-blue-300 hover:bg-blue-50'
        }`}
      />
    </td>
  );
}
