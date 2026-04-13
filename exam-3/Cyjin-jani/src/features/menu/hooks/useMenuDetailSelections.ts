import { useCallback, useState } from 'react';

import type { OptionSelection } from '@/features/menu/types';

export function useMenuDetailSelections() {
  const [optionSelections, setOptionSelections] = useState<OptionSelection[]>(
    [],
  );

  const updateOptionLabels = useCallback(
    (optionId: number, labels: string[]) => {
      setOptionSelections((prev) => {
        const rest = prev.filter((s) => s.optionId !== optionId);
        if (labels.length === 0) return rest;
        return [...rest, { optionId, labels }];
      });
    },
    [],
  );

  const getLabelsForOption = useCallback(
    (optionId: number) =>
      optionSelections.find((s) => s.optionId === optionId)?.labels ?? [],
    [optionSelections],
  );

  return {
    optionSelections,
    updateOptionLabels,
    getLabelsForOption,
  };
}
