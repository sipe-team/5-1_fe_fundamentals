import { useEffect, useRef, useState } from 'react';
import type { ProblemTypeTree } from '@/types';

interface UseExpandedFieldsParams {
  chipBoardDataTree: ProblemTypeTree;
  resetSeed?: number;
}

export function useExpandedFields({
  chipBoardDataTree,
  resetSeed,
}: UseExpandedFieldsParams) {
  const [expandedFieldIds, setExpandedFieldIds] = useState<Set<number>>(new Set());
  const isHydratedRef = useRef(false);

  useEffect(() => {
    const fieldIds = chipBoardDataTree.map((section) => section.fieldId);

    setExpandedFieldIds((prev) => {
      if (!isHydratedRef.current) {
        isHydratedRef.current = true;
        return new Set(fieldIds);
      }

      const next = new Set<number>();
      for (const id of fieldIds) {
        if (prev.has(id)) next.add(id);
      }
      return next;
    });
  }, [chipBoardDataTree]);

  useEffect(() => {
    if (resetSeed == null) return;
    setExpandedFieldIds(new Set(chipBoardDataTree.map((section) => section.fieldId)));
  }, [chipBoardDataTree, resetSeed]);

  const toggleField = (fieldId: number) => {
    setExpandedFieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  };

  return {
    expandedFieldIds,
    toggleField,
  };
}
