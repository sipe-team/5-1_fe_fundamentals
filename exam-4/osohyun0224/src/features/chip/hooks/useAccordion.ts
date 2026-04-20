import { useCallback, useMemo, useState } from 'react';
import type { FieldSection } from '@/types';

export function useAccordion(chipTree: FieldSection[]) {
  const [expandedFieldIds, setExpandedFieldIds] = useState<Set<number> | null>(
    null,
  );

  const currentExpandedFieldIds = useMemo(() => {
    if (expandedFieldIds !== null) return expandedFieldIds;
    return new Set(chipTree.map((field) => field.fieldId));
  }, [expandedFieldIds, chipTree]);

  const toggleField = useCallback((fieldId: number) => {
    setExpandedFieldIds((prev) => {
      const current = prev ?? new Set<number>();
      const next = new Set(current);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  }, []);

  const resetAccordion = useCallback(() => {
    setExpandedFieldIds(null);
  }, []);

  return {
    expandedFieldIds: currentExpandedFieldIds,
    toggleField,
    resetAccordion,
  };
}
