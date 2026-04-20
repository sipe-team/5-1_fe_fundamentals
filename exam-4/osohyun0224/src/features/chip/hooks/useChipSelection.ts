import { useCallback, useState } from 'react';
import type { FieldSection } from '@/types';
import { collectAllChips } from '../utils/checkState';

function toggleBulk(prev: Set<number>, chipIds: number[]): Set<number> {
  const allSelected = chipIds.every((id) => prev.has(id));
  const next = new Set(prev);
  if (allSelected) {
    for (const id of chipIds) next.delete(id);
  } else {
    for (const id of chipIds) next.add(id);
  }
  return next;
}

export function useChipSelection() {
  const [selectedChipIds, setSelectedChipIds] = useState<Set<number>>(
    new Set(),
  );

  const clearSelection = useCallback(() => {
    setSelectedChipIds(new Set());
  }, []);

  const toggleChip = useCallback((chipId: number) => {
    setSelectedChipIds((prev) => {
      const next = new Set(prev);
      if (next.has(chipId)) {
        next.delete(chipId);
      } else {
        next.add(chipId);
      }
      return next;
    });
  }, []);

  const toggleFieldChips = useCallback(
    (fieldId: number, filteredFields: FieldSection[]) => {
      const field = filteredFields.find((f) => f.fieldId === fieldId);
      if (!field) return;
      const chipIds = collectAllChips(field.topics).map((c) => c.chipId);
      setSelectedChipIds((prev) => toggleBulk(prev, chipIds));
    },
    [],
  );

  const toggleTopicChips = useCallback(
    (topicId: number, filteredFields: FieldSection[]) => {
      for (const field of filteredFields) {
        const topic = field.topics.find((t) => t.topicId === topicId);
        if (!topic) continue;
        const chipIds = collectAllChips([topic]).map((c) => c.chipId);
        setSelectedChipIds((prev) => toggleBulk(prev, chipIds));
        return;
      }
    },
    [],
  );

  return {
    selectedChipIds,
    clearSelection,
    toggleChip,
    toggleFieldChips,
    toggleTopicChips,
  };
}
