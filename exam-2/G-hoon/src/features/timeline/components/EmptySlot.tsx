interface EmptySlotProps {
  slotIdx: number;
  onClick: () => void;
}

export default function EmptySlot({ slotIdx, onClick }: EmptySlotProps) {
  return (
    <td key={slotIdx} className="h-0 px-1 border-b border-slate-200">
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full rounded border border-dashed border-transparent hover:border-blue-300 hover:bg-blue-50 transition-colors"
      />
    </td>
  );
}
