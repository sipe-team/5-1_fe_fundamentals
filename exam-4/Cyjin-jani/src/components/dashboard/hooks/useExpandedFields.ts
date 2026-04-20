import { useEffect, useRef, useState } from 'react';
import type { ProblemTypeTree } from '@/types';

type UseExpandedFieldsParams = {
  chipBoardDataTree: ProblemTypeTree;
};

export function useExpandedFields({ chipBoardDataTree }: UseExpandedFieldsParams) {
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
