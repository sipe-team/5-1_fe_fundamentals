import type {
  ChipWithProficiency,
  FieldSection,
  ProblemTypeChip,
  Proficiency,
  TopicRow,
} from '@/types';

export function buildChipTree(
  chips: ProblemTypeChip[],
  proficiencies: Proficiency[],
): FieldSection[] {
  const proficiencyMap = new Map(
    proficiencies.map((proficiency) => [
      proficiency.chipId,
      proficiency.proficiency,
    ]),
  );

  const fieldMap = new Map<
    number,
    { fieldId: number; fieldName: string; topicMap: Map<number, TopicRow> }
  >();

  for (const chip of chips) {
    if (!fieldMap.has(chip.fieldId)) {
      fieldMap.set(chip.fieldId, {
        fieldId: chip.fieldId,
        fieldName: chip.fieldName,
        topicMap: new Map(),
      });
    }

    const field = fieldMap.get(chip.fieldId)!;

    if (!field.topicMap.has(chip.topicId)) {
      field.topicMap.set(chip.topicId, {
        topicId: chip.topicId,
        topicName: chip.topicName,
        easy: [],
        medium: [],
        hard: [],
      });
    }

    const topic = field.topicMap.get(chip.topicId)!;

    const chipWithProficiency: ChipWithProficiency = {
      ...chip,
      proficiency: proficiencyMap.get(chip.chipId) ?? 'UNSEEN',
    };

    topic[chip.difficulty].push(chipWithProficiency);
  }

  return Array.from(fieldMap.values()).map((field) => ({
    fieldId: field.fieldId,
    fieldName: field.fieldName,
    topics: Array.from(field.topicMap.values()),
  }));
}
