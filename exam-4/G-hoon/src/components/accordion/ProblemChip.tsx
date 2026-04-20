import { Check, Star } from 'lucide-react';
import type { ChipWithProficiency } from '@/types';

const PROFICIENCY_COLORS: Record<string, string> = {
  UNSEEN: 'bg-gray-100 text-gray-600 border-gray-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  PARTIAL: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PASSED: 'bg-green-50 text-green-700 border-green-200',
  MASTERED: 'bg-blue-50 text-blue-700 border-blue-200',
};

interface ProblemChipProps {
  chip: ChipWithProficiency;
  isSelected: boolean;
  onToggle: (chipId: number) => void;
}

export function ProblemChip({ chip, isSelected, onToggle }: ProblemChipProps) {
  const colorClass = PROFICIENCY_COLORS[chip.proficiency];

  return (
    <button
      type="button"
      onClick={() => onToggle(chip.chipId)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-all ${colorClass} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      }`}
    >
      {isSelected && <Check aria-hidden="true" className="w-3 h-3" />}
      {chip.frequent && (
        <Star
          aria-label="빈출 유형"
          className="w-3 h-3 fill-orange-500 text-orange-500"
        />
      )}
      <span>{chip.problemTypeName}</span>
    </button>
  );
}
