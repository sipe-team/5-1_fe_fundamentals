import { useChipSelectionActions, useChipSelectionState } from '@/contexts/ChipSelectionContext';
import type { ChipWithProficiency } from '@/types';

type ChipBadgeProps = {
  chip: ChipWithProficiency;
};

const PROFICIENCY_STYLE: Record<ChipWithProficiency['proficiency'], string> = {
  UNSEEN: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
  PARTIAL: 'border-amber-200 bg-amber-50 text-amber-700',
  PASSED: 'border-sky-200 bg-sky-50 text-sky-700',
  MASTERED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function ChipBadge({ chip }: ChipBadgeProps) {
  const { selectedChipIds } = useChipSelectionState();
  const { toggleChipSelection } = useChipSelectionActions();
  const isSelected = selectedChipIds.has(chip.chipId);

  return (
    <button
      type="button"
      onClick={() => toggleChipSelection(chip.chipId)}
      aria-pressed={isSelected}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        PROFICIENCY_STYLE[chip.proficiency]
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:shadow-sm'}`}
    >
      {chip.frequent ? (
        <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700">
          빈출
        </span>
      ) : null}
      <span>{chip.problemTypeName}</span>
    </button>
  );
}
