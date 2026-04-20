import type {
  ChipWithProficiency,
  FieldSection,
  FilterState,
  ProblemTypeTree,
  ProficiencyLevel,
  TopicRow,
} from '@/types';

export function filterTree(
  tree: ProblemTypeTree,
  filters: FilterState,
): ProblemTypeTree {
  const result: FieldSection[] = [];

  for (const field of tree) {
    const filteredTopics: TopicRow[] = [];

    for (const topic of field.topics) {
      const filteredChips = filterChips(topic.chips, filters);
      if (filteredChips.length > 0) {
        filteredTopics.push({ ...topic, chips: filteredChips });
      }
    }

    if (filteredTopics.length > 0) {
      result.push({ ...field, topics: filteredTopics });
    }
  }

  return result;
}

function filterChips(
  chips: ChipWithProficiency[],
  filters: FilterState,
): ChipWithProficiency[] {
  return chips.filter((chip) => {
    if (filters.onlyFrequent && !chip.frequent) return false;
    if (
      filters.selectedProficiencies.length > 0 &&
      !filters.selectedProficiencies.includes(chip.proficiency)
    )
      return false;
    return true;
  });
}

export function countChipsByProficiency(
  tree: ProblemTypeTree,
  onlyFrequent: boolean,
): Record<ProficiencyLevel, number> {
  const counts: Record<ProficiencyLevel, number> = {
    UNSEEN: 0,
    FAILED: 0,
    PARTIAL: 0,
    PASSED: 0,
    MASTERED: 0,
  };

  for (const field of tree) {
    for (const topic of field.topics) {
      for (const chip of topic.chips) {
        if (onlyFrequent && !chip.frequent) continue;
        counts[chip.proficiency]++;
      }
    }
  }

  return counts;
}

export function countSelectedInFilteredTree(
  filteredTree: ProblemTypeTree,
  selectedChipIds: Set<number>,
): number {
  let count = 0;
  for (const field of filteredTree) {
    for (const topic of field.topics) {
      for (const chip of topic.chips) {
        if (selectedChipIds.has(chip.chipId)) count++;
      }
    }
  }
  return count;
}
