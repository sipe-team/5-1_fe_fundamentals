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
      {isSelected && (
        <svg
          aria-hidden="true"
          className="w-3 h-3"
          fill="currentColor"
          focusable="false"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {chip.frequent && <span className="text-orange-500">★</span>}
      <span>{chip.problemTypeName}</span>
    </button>
  );
}
