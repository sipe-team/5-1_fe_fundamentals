import type { ChipWithProficiency, ProficiencyLevel } from '@/types';

export function filterByFrequent(
  chips: ChipWithProficiency[],
  frequentOnly: boolean,
): ChipWithProficiency[] {
  if (!frequentOnly) return chips;
  return chips.filter((chip) => chip.frequent);
}

export function filterByProficiency(
  chips: ChipWithProficiency[],
  selectedProficiencies: ReadonlySet<ProficiencyLevel>,
): ChipWithProficiency[] {
  if (selectedProficiencies.size === 0) return chips;
  return chips.filter((chip) => selectedProficiencies.has(chip.proficiency));
}
