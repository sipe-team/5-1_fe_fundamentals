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
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${PROFICIENCY_STYLE[chip.proficiency]}`}
    >
      {chip.frequent ? (
        <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700">
          빈출
        </span>
      ) : null}
      <span>{chip.problemTypeName}</span>
    </span>
  );
}
