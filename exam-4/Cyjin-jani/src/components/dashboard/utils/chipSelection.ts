import type { ProblemTypeTree } from '@/types';

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
