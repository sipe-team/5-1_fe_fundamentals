import { useCallback, useMemo } from 'react';
import type {
  ChipWithProficiency,
  FieldSection,
  FilterState,
  ProficiencyLevel,
} from '@/types';

export function useFilteredTree(
  chipTree: FieldSection[],
  filters: FilterState,
  selectedChipIds: Set<number>,
) {
  const filterChips = useCallback(
    (chips: ChipWithProficiency[]): ChipWithProficiency[] => {
      return chips.filter((chip) => {
        if (filters.onlyFrequent && !chip.frequent) return false;
        if (
          filters.selectedProficiencies.length > 0 &&
          !filters.selectedProficiencies.includes(chip.proficiency)
        ) {
          return false;
        }
        return true;
      });
    },
    [filters],
  );

  const filteredTree = useMemo((): FieldSection[] => {
    return chipTree
      .map((field) => ({
        ...field,
        topics: field.topics
          .map((topic) => ({
            ...topic,
            easy: filterChips(topic.easy),
            medium: filterChips(topic.medium),
            hard: filterChips(topic.hard),
          }))
          .filter(
            (topic) =>
              topic.easy.length + topic.medium.length + topic.hard.length > 0,
          ),
      }))
      .filter((field) => field.topics.length > 0);
  }, [chipTree, filterChips]);

  const proficiencyCounts = useMemo(() => {
    const counts: Record<ProficiencyLevel, number> = {
      UNSEEN: 0,
      FAILED: 0,
      PARTIAL: 0,
      PASSED: 0,
      MASTERED: 0,
    };

    for (const field of chipTree) {
      for (const topic of field.topics) {
        for (const chip of [...topic.easy, ...topic.medium, ...topic.hard]) {
          if (filters.onlyFrequent && !chip.frequent) continue;
          counts[chip.proficiency]++;
        }
      }
    }

    return counts;
  }, [chipTree, filters.onlyFrequent]);

  const selectedVisibleCount = useMemo(() => {
    let count = 0;
    for (const field of filteredTree) {
      for (const topic of field.topics) {
        for (const chip of [...topic.easy, ...topic.medium, ...topic.hard]) {
          if (selectedChipIds.has(chip.chipId)) count++;
        }
      }
    }
    return count;
  }, [filteredTree, selectedChipIds]);

  return { filteredTree, proficiencyCounts, selectedVisibleCount };
}
