import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCallback } from 'react';

const DEFAULT_LEVEL_KEY = 'basic';

export function useDashboardSearchParams() {
  const [{ memberId, level }, setParams] = useQueryStates({
    memberId: parseAsInteger,
    level: parseAsString.withDefault(DEFAULT_LEVEL_KEY),
  });

  const selectMember = useCallback(
    (nextMemberId: number) => {
      void setParams({
        memberId: nextMemberId,
        level: DEFAULT_LEVEL_KEY,
      });
    },
    [setParams],
  );

  const changeLevel = useCallback(
    (nextLevel: string) => {
      void setParams({ level: nextLevel });
    },
    [setParams],
  );

  return {
    selectedMemberId: memberId,
    selectedLevelKey: level,
    selectMember,
    changeLevel,
  };
}
