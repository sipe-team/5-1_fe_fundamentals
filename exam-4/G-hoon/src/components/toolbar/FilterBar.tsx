import type { FilterState, ProficiencyLevel } from '@/types';

const PROFICIENCY_OPTIONS: {
  value: ProficiencyLevel;
  label: string;
  color: string;
}[] = [
  { value: 'UNSEEN', label: '미도전', color: 'bg-gray-200 text-gray-700' },
  { value: 'FAILED', label: '오답', color: 'bg-red-100 text-red-700' },
  {
    value: 'PARTIAL',
    label: '부분 통과',
    color: 'bg-yellow-100 text-yellow-700',
  },
  { value: 'PASSED', label: '통과', color: 'bg-green-100 text-green-700' },
  { value: 'MASTERED', label: '완전 정복', color: 'bg-blue-100 text-blue-700' },
];

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (filter: FilterState) => void;
  proficiencyCounts: Record<ProficiencyLevel, number>;
}

export function FilterBar({
  filter,
  onChangeFilter,
  proficiencyCounts,
}: FilterBarProps) {
  const toggleFrequent = () => {
    onChangeFilter({ ...filter, onlyFrequent: !filter.onlyFrequent });
  };

  const toggleProficiency = (prof: ProficiencyLevel) => {
    const selected = filter.selectedProficiencies;
    const next = selected.includes(prof)
      ? selected.filter((p) => p !== prof)
      : [...selected, prof];
    onChangeFilter({ ...filter, selectedProficiencies: next });
  };

  const resetFilter = () => {
    onChangeFilter({ onlyFrequent: false, selectedProficiencies: [] });
  };

  const isDefault =
    !filter.onlyFrequent && filter.selectedProficiencies.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filter.onlyFrequent}
          onChange={toggleFrequent}
          className="rounded"
        />
        <span>빈출 유형만 보기</span>
      </label>

      <div className="h-4 w-px bg-gray-300" />

      <div className="flex flex-wrap items-center gap-1.5">
        {PROFICIENCY_OPTIONS.map(({ value, label, color }) => {
          const isSelected = filter.selectedProficiencies.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleProficiency(value)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all border ${
                isSelected
                  ? `${color} border-current`
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
              }`}
            >
              {label} {proficiencyCounts[value]}
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-gray-300" />

      <button
        type="button"
        onClick={resetFilter}
        disabled={isDefault}
        className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        필터 초기화
      </button>
    </div>
  );
}
