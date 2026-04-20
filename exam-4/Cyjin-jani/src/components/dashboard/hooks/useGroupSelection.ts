import { useCallback, useMemo } from 'react';
import { countSelectedChips } from '@/components/dashboard/utils/chipSelection';
import { useChipSelectionActions, useChipSelectionState } from '@/contexts/ChipSelectionContext';

interface UseGroupSelectionParams {
  chipIds: number[];
}

export function useGroupSelection({ chipIds }: UseGroupSelectionParams) {
  const { selectedChipIds } = useChipSelectionState();
  const { setChipSelection } = useChipSelectionActions();

  const totalCount = chipIds.length;
  const selectedCount = useMemo(
    () => countSelectedChips(chipIds, selectedChipIds),
    [chipIds, selectedChipIds],
  );
  const checked = totalCount > 0 && selectedCount === totalCount;
  const indeterminate = selectedCount > 0 && selectedCount < totalCount;

  const setGroupSelected = useCallback(
    (nextChecked: boolean) => {
      setChipSelection(chipIds, nextChecked);
    },
    [chipIds, setChipSelection],
  );

  return {
    totalCount,
    selectedCount,
    checked,
    indeterminate,
    setGroupSelected,
  };
}
