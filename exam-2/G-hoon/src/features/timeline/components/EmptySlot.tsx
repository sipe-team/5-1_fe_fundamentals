interface EmptySlotProps {
  slotIdx: number;
  time: string;
  roomName: string;
  onClick: () => void;
}

export default function EmptySlot({
  slotIdx,
  time,
  roomName,
  onClick,
}: EmptySlotProps) {
  return (
    <td key={slotIdx} className="h-0 px-1 border-b border-slate-200">
      <button
        type="button"
        onClick={onClick}
        aria-label={`${roomName} ${time} 예약하기`}
        className="w-full h-full rounded border border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 focus:bg-blue-50"
      />
    </td>
  );
}
