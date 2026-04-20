import { filterByFrequent } from '@/lib/filtering';
import type { ChipWithProficiency, ProficiencyLevel } from '@/types';

export type ProficiencyCountMap = Record<ProficiencyLevel, number>;

const EMPTY_PROFICIENCY_COUNTS: ProficiencyCountMap = {
  UNSEEN: 0,
  FAILED: 0,
  PARTIAL: 0,
  PASSED: 0,
  MASTERED: 0,
};

export function countByProficiencyForFilterUI(
  chips: ChipWithProficiency[],
  frequentOnly: boolean,
): ProficiencyCountMap {
  const filteredByFrequent = filterByFrequent(chips, frequentOnly);
  const counts: ProficiencyCountMap = { ...EMPTY_PROFICIENCY_COUNTS };

  for (const chip of filteredByFrequent) {
    counts[chip.proficiency] += 1;
  }

  return counts;
}
