import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from 'nuqs';

import type { ProficiencyLevel } from '@/shared/types';

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  'UNSEEN',
  'FAILED',
  'PARTIAL',
  'PASSED',
  'MASTERED',
];

const proficienciesParser = parseAsArrayOf(
  parseAsStringLiteral(PROFICIENCY_LEVELS),
).withDefault([]);

export default function useProficienciesQueryParams() {
  const [selectedProficiencies, setSelectedProficiencies] = useQueryState(
    'selectedProficiencies',
    proficienciesParser,
  );

  const toggleProficiency = (proficiencyLevel: ProficiencyLevel) => {
    setSelectedProficiencies((prev) => {
      if (prev.includes(proficiencyLevel)) {
        return prev.filter((selected) => selected !== proficiencyLevel);
      }
      return [...prev, proficiencyLevel];
    });
  };

  const resetProficiencies = () => {
    setSelectedProficiencies([]);
  };

  const isProficiencySelected = (proficiencyLevel: ProficiencyLevel) =>
    selectedProficiencies.includes(proficiencyLevel);

  return {
    selectedProficiencies,
    toggleProficiency,
    resetProficiencies,
    isProficiencySelected,
  };
}
