import {
  useChipSelectionActions,
  useChipSelectionState,
} from '@/contexts/dashboard/ChipSelectionContext';
import { Check } from 'lucide-react';
import { PROFICIENCY_STYLE } from '@/components/dashboard/DashboardFilters';
import type { ChipWithProficiency } from '@/types';

interface ChipBadgeProps {
  chip: ChipWithProficiency;
}

export function ChipBadge({ chip }: ChipBadgeProps) {
  const { selectedChipIds } = useChipSelectionState();
  const { toggleChipSelection } = useChipSelectionActions();
  const isSelected = selectedChipIds.has(chip.chipId);

  return (
    <button
      type="button"
      onClick={() => toggleChipSelection(chip.chipId)}
      aria-pressed={isSelected}
      className={`relative inline-flex items-center gap-1 rounded-full border px-2 py-2 text-xs font-medium transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        PROFICIENCY_STYLE[chip.proficiency]
      } ${isSelected ? '' : 'hover:shadow-sm'}`}
    >
      {chip.frequent ? (
        <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700">
          빈출
        </span>
      ) : null}
      <span>{chip.problemTypeName}</span>
      {isSelected ? (
        <span className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-black/50 text-white">
          <Check
            size={16}
            strokeWidth={3}
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            aria-hidden="true"
          />
        </span>
      ) : null}
    </button>
  );
}
