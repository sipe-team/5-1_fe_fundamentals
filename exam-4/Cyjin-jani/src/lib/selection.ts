import type { FieldSection, TopicRow } from '@/types';

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

export function countSelectedChips(
  chipIds: number[],
  selectedChipIds: ReadonlySet<number>,
) {
  let selectedCount = 0;
  for (const chipId of chipIds) {
    if (selectedChipIds.has(chipId)) selectedCount += 1;
  }

  return selectedCount;
}

export function countSelectedFromVisibleSet(
  visibleChipIds: ReadonlySet<number>,
  selectedChipIds: ReadonlySet<number>,
) {
  let selectedVisibleCount = 0;

  for (const chipId of selectedChipIds) {
    if (visibleChipIds.has(chipId)) selectedVisibleCount += 1;
  }

  return selectedVisibleCount;
}
