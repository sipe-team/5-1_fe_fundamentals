import type {
  ChipWithProficiency,
  ProblemTypeChip,
  ProblemTypeTree,
  Proficiency,
  ProficiencyLevel,
  TopicRow,
} from '@/types';

export function buildProficiencyMap(rows: Proficiency[]): Map<number, ProficiencyLevel> {
  return new Map(rows.map((row) => [row.chipId, row.proficiency]));
}

export function mergeChipsWithProficiency(
  problemTypes: ProblemTypeChip[],
  proficiencyMap: Map<number, ProficiencyLevel>,
): ChipWithProficiency[] {
  return problemTypes.map((chip) => ({
    ...chip,
    proficiency: proficiencyMap.get(chip.chipId) ?? 'UNSEEN',
  }));
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
