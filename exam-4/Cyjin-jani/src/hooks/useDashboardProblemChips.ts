import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getProblemTypesQueryOptions, getProficiencyQueryOptions } from '@/api/queryOptions';
import {
  buildVisibleChipIdSet,
  buildProblemTypeTree,
  buildProficiencyMap,
  countByProficiencyForFilterUI,
  filterByFrequent,
  filterByProficiency,
  mergeChipsWithProficiency,
  type ProficiencyCountMap,
} from '@/lib';
import type { LevelKey, ProblemTypeTree, ProficiencyLevel } from '@/types';

interface UseDashboardProblemChipsParams {
  memberId: number;
  levelKey: LevelKey;
  frequentOnly: boolean;
  selectedProficiencies: ReadonlySet<ProficiencyLevel>;
}

export interface ProblemTypeChipsData {
  problemTypeChipsTree: ProblemTypeTree;
  visibleChipIds: Set<number>;
  proficiencyCounts: ProficiencyCountMap;
}

export function useDashboardProblemChips({
  memberId,
  levelKey,
  frequentOnly,
  selectedProficiencies,
}: UseDashboardProblemChipsParams): ProblemTypeChipsData {
  const { data: problemTypes } = useSuspenseQuery(getProblemTypesQueryOptions(levelKey));
  const { data: proficiencies } = useSuspenseQuery(getProficiencyQueryOptions(memberId, levelKey));

  return useMemo<ProblemTypeChipsData>(() => {
    const proficiencyMap = buildProficiencyMap(proficiencies);
    const mergedChips = mergeChipsWithProficiency(problemTypes, proficiencyMap);
    const frequentFiltered = filterByFrequent(mergedChips, frequentOnly);
    const visibleChips = filterByProficiency(frequentFiltered, selectedProficiencies);

    return {
      problemTypeChipsTree: buildProblemTypeTree(visibleChips),
      visibleChipIds: buildVisibleChipIdSet(visibleChips),
      proficiencyCounts: countByProficiencyForFilterUI(mergedChips, frequentOnly),
    };
  }, [problemTypes, proficiencies, frequentOnly, selectedProficiencies]);
}
