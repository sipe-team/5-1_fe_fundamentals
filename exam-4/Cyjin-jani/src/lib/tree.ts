import type { ChipWithProficiency, ProblemTypeTree, TopicRow } from '@/types';

export function buildVisibleChipIdSet(chips: ChipWithProficiency[]): Set<number> {
  return new Set(chips.map((chip) => chip.chipId));
}

export function buildProblemTypeTree(chips: ChipWithProficiency[]): ProblemTypeTree {
  const fieldMap = new Map<number, ProblemTypeTree[number]>();

  for (const chip of chips) {
    const field =
      fieldMap.get(chip.fieldId) ??
      (() => {
        const nextField = {
          fieldId: chip.fieldId,
          fieldName: chip.fieldName,
          topics: [],
        };
        fieldMap.set(chip.fieldId, nextField);
        return nextField;
      })();

    let topic = field.topics.find((row) => row.topicId === chip.topicId);

    if (!topic) {
      topic = {
        topicId: chip.topicId,
        topicName: chip.topicName,
        easy: [],
        medium: [],
        hard: [],
      } satisfies TopicRow;
      field.topics.push(topic);
    }

    topic[chip.difficulty].push(chip);
  }

  return Array.from(fieldMap.values());
}
