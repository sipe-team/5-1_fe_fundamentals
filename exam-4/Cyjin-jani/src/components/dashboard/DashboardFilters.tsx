import type { ProficiencyCountMap } from '@/lib';
import { Check } from 'lucide-react';
import type { ProficiencyLevel } from '@/types';

interface DashboardFiltersProps {
  frequentOnly: boolean;
  selectedProficiencies: ReadonlySet<ProficiencyLevel>;
  proficiencyCounts: ProficiencyCountMap;
  onToggleFrequent: () => void;
  onToggleProficiency: (proficiency: ProficiencyLevel) => void;
  onResetFilters: () => void;
}

const PROFICIENCY_OPTIONS: Array<{ key: ProficiencyLevel; label: string }> = [
  { key: 'UNSEEN', label: '미도전' },
  { key: 'FAILED', label: '오답' },
  { key: 'PARTIAL', label: '부분 통과' },
  { key: 'PASSED', label: '통과' },
  { key: 'MASTERED', label: '완전 정복' },
];

export const PROFICIENCY_STYLE: Record<ProficiencyLevel, string> = {
  UNSEEN: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
  PARTIAL: 'border-amber-200 bg-amber-50 text-amber-700',
  PASSED: 'border-sky-200 bg-sky-50 text-sky-700',
  MASTERED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function DashboardFilters({
  frequentOnly,
  selectedProficiencies,
  proficiencyCounts,
  onToggleFrequent,
  onToggleProficiency,
  onResetFilters,
}: DashboardFiltersProps) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 mb-3">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onToggleFrequent}
          aria-pressed={frequentOnly}
          className={`relative inline-flex h-9 w-36 items-center justify-center rounded-full border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition-colors ${
            frequentOnly ? '' : 'opacity-70 hover:opacity-100'
          }`}
        >
          빈출 유형만 보기
          {frequentOnly ? (
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

        <div className="flex flex-wrap items-center gap-2">
          {PROFICIENCY_OPTIONS.map((option) => {
            const isActive = selectedProficiencies.has(option.key);

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onToggleProficiency(option.key)}
                aria-pressed={isActive}
                className={`relative inline-flex h-9 w-30 items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? `${PROFICIENCY_STYLE[option.key]}`
                    : `${PROFICIENCY_STYLE[option.key]} opacity-70 hover:opacity-100`
                }`}
              >
                <span className="flex-1 text-left">{option.label}</span>
                <span className="w-9 text-right tabular-nums text-neutral-500">
                  ({proficiencyCounts[option.key]})
                </span>
                {isActive ? (
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
          })}
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="ml-auto rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          필터 초기화
        </button>
      </div>
    </section>
  );
}
