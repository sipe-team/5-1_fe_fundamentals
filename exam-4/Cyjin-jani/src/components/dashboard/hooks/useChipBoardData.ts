import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getProblemTypesQueryOptions,
  getProficiencyQueryOptions,
} from '@/data/queries';
import {
  buildProblemTypeTree,
  buildProficiencyMap,
  mergeChipsWithProficiency,
} from '@/domain/chipModel';
import type { LevelKey, ProblemTypeTree } from '@/types';

type UseChipBoardDataParams = {
  memberId: number;
  levelKey: LevelKey;
};

export function useChipBoardData({
  memberId,
  levelKey,
}: UseChipBoardDataParams): ProblemTypeTree {
  const { data: problemTypes } = useSuspenseQuery(
    getProblemTypesQueryOptions(levelKey),
  );
  const { data: proficiencies } = useSuspenseQuery(
    getProficiencyQueryOptions(memberId, levelKey),
  );

  return useMemo(() => {
    const proficiencyMap = buildProficiencyMap(proficiencies);
    const mergedChips = mergeChipsWithProficiency(problemTypes, proficiencyMap);
    return buildProblemTypeTree(mergedChips);
  }, [problemTypes, proficiencies]);
}
