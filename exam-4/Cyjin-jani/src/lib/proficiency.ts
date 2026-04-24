import type {
  ChipWithProficiency,
  ProblemTypeChip,
  Proficiency,
  ProficiencyLevel,
} from '@/types';

export function buildProficiencyMap(rows: Proficiency[]): Map<number, ProficiencyLevel> {
  return new Map(rows.map((row) => [row.chipId, row.proficiency]));
}

export function mergeChipsWithProficiency(
  problemTypes: ProblemTypeChip[],
  proficiencyMap: Map<number, ProficiencyLevel>,
): ChipWithProficiency[] {
  return problemTypes.map((chip) => ({
    ...chip,
    proficiency: proficiencyMap.get(chip.chipId) ?? 'UNSEEN',
  }));
}
