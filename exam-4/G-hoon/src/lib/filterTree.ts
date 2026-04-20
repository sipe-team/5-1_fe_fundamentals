import type {
  ChipWithProficiency,
  FieldSection,
  FilterState,
  ProficiencyLevel,
  TopicRow,
} from '@/types';

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  'UNSEEN',
  'FAILED',
  'PARTIAL',
  'PASSED',
  'MASTERED',
];

function getTopicChips(topic: TopicRow): ChipWithProficiency[] {
  return [...topic.easy, ...topic.medium, ...topic.hard];
}

function getTreeChips(tree: FieldSection[]): ChipWithProficiency[] {
  return tree.flatMap((field) => field.topics.flatMap(getTopicChips));
}

function createEmptyProficiencyCounts(): Record<ProficiencyLevel, number> {
  return Object.fromEntries(
    PROFICIENCY_LEVELS.map((level) => [level, 0]),
  ) as Record<ProficiencyLevel, number>;
}

function filterChips(
  chips: ChipWithProficiency[],
  filter: FilterState,
): ChipWithProficiency[] {
  return chips.filter((chip) => {
    if (filter.onlyFrequent && !chip.frequent) return false;
    if (
      filter.selectedProficiencies.length > 0 &&
      !filter.selectedProficiencies.includes(chip.proficiency)
    )
      return false;
    return true;
  });
}

function filterTopic(topic: TopicRow, filter: FilterState): TopicRow | null {
  const easy = filterChips(topic.easy, filter);
  const medium = filterChips(topic.medium, filter);
  const hard = filterChips(topic.hard, filter);
  if (easy.length === 0 && medium.length === 0 && hard.length === 0)
    return null;
  return { ...topic, easy, medium, hard };
}

export function filterTree(
  tree: FieldSection[],
  filter: FilterState,
): FieldSection[] {
  const result: FieldSection[] = [];

  for (const field of tree) {
    const topics: TopicRow[] = [];
    for (const topic of field.topics) {
      const filtered = filterTopic(topic, filter);
      if (filtered) topics.push(filtered);
    }
    if (topics.length > 0) {
      result.push({ ...field, topics });
    }
  }

  return result;
}

export function countByProficiency(
  tree: FieldSection[],
  onlyFrequent: boolean,
): Record<ProficiencyLevel, number> {
  const counts = createEmptyProficiencyCounts();

  for (const chip of getTreeChips(tree)) {
    if (onlyFrequent && !chip.frequent) continue;
    counts[chip.proficiency]++;
  }

  return counts;
}

export function countSelectedInTree(
  tree: FieldSection[],
  selectedChipIds: Set<number>,
): number {
  return getTreeChips(tree).filter((chip) => selectedChipIds.has(chip.chipId))
    .length;
}
