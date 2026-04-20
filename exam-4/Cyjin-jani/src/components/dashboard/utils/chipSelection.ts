import type { FieldSection, ProblemTypeTree, TopicRow } from '@/types';

export function getTopicChipIds(topic: TopicRow) {
  return [...topic.easy, ...topic.medium, ...topic.hard].map((chip) => chip.chipId);
}

export function getFieldChipIds(section: FieldSection) {
  const chipIds: number[] = [];

  for (const topic of section.topics) {
    chipIds.push(...getTopicChipIds(topic));
  }

  return chipIds;
}

export function countSelectedChips(chipIds: number[], selectedChipIds: Set<number>) {
  let selectedCount = 0;
  for (const chipId of chipIds) {
    if (selectedChipIds.has(chipId)) selectedCount += 1;
  }

  return selectedCount;
}

export function countVisibleSelectedChips(
  tree: ProblemTypeTree,
  selectedChipIds: Set<number>,
) {
  const visibleChipIds = new Set<number>();

  for (const field of tree) {
    for (const topic of field.topics) {
      for (const chip of topic.easy) visibleChipIds.add(chip.chipId);
      for (const chip of topic.medium) visibleChipIds.add(chip.chipId);
      for (const chip of topic.hard) visibleChipIds.add(chip.chipId);
    }
  }

  let selectedVisibleCount = 0;
  for (const chipId of selectedChipIds) {
    if (visibleChipIds.has(chipId)) selectedVisibleCount += 1;
  }

  return selectedVisibleCount;
}
