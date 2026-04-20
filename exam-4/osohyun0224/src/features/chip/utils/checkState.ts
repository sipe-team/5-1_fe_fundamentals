import type { ChipWithProficiency } from '@/types';

export type CheckState = 'checked' | 'unchecked' | 'indeterminate';

export function getCheckState(
  selectedCount: number,
  totalCount: number,
): CheckState {
  if (selectedCount === 0) return 'unchecked';
  if (selectedCount === totalCount) return 'checked';
  return 'indeterminate';
}

export function collectAllChips(
  topics: {
    easy: ChipWithProficiency[];
    medium: ChipWithProficiency[];
    hard: ChipWithProficiency[];
  }[],
): ChipWithProficiency[] {
  const chips: ChipWithProficiency[] = [];
  for (const topic of topics) {
    chips.push(...topic.easy, ...topic.medium, ...topic.hard);
  }
  return chips;
}
