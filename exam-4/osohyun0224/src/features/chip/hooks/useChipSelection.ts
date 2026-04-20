import { useCallback, useState } from 'react';
import type { ChipWithProficiency } from '@/types';

function collectChipIds(
  topics: {
    easy: ChipWithProficiency[];
    medium: ChipWithProficiency[];
    hard: ChipWithProficiency[];
  }[],
): number[] {
  const ids: number[] = [];
  for (const topic of topics) {
    for (const chip of [...topic.easy, ...topic.medium, ...topic.hard]) {
      ids.push(chip.chipId);
    }
  }
  return ids;
}

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
    (
      fieldId: number,
      filteredFields: {
        fieldId: number;
        topics: {
          easy: ChipWithProficiency[];
          medium: ChipWithProficiency[];
          hard: ChipWithProficiency[];
        }[];
      }[],
    ) => {
      const field = filteredFields.find((f) => f.fieldId === fieldId);
      if (!field) return;
      const chipIds = collectChipIds(field.topics);
      setSelectedChipIds((prev) => toggleBulk(prev, chipIds));
    },
    [],
  );

  const toggleTopicChips = useCallback(
    (
      topicId: number,
      filteredFields: {
        topics: {
          topicId: number;
          easy: ChipWithProficiency[];
          medium: ChipWithProficiency[];
          hard: ChipWithProficiency[];
        }[];
      }[],
    ) => {
      for (const field of filteredFields) {
        const topic = field.topics.find((t) => t.topicId === topicId);
        if (!topic) continue;
        const chipIds = collectChipIds([topic]);
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
