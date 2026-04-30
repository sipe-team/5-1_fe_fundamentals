import type {
  ChipWithProficiency,
  FieldSection,
  ProblemTypeChip,
  ProficiencyLevel,
  TopicRow,
} from '@/types';

export function buildTree(
  chips: ProblemTypeChip[],
  proficiencyMap: Map<number, ProficiencyLevel>,
): FieldSection[] {
  const fieldMap = new Map<
    number,
    { fieldName: string; topicMap: Map<number, TopicRow> }
  >();

  for (const chip of chips) {
    const proficiency = proficiencyMap.get(chip.chipId) ?? 'UNSEEN';
    const chipWithProf: ChipWithProficiency = { ...chip, proficiency };

    let field = fieldMap.get(chip.fieldId);
    if (!field) {
      field = { fieldName: chip.fieldName, topicMap: new Map() };
      fieldMap.set(chip.fieldId, field);
    }

    let topic = field.topicMap.get(chip.topicId);
    if (!topic) {
      topic = {
        topicId: chip.topicId,
        topicName: chip.topicName,
        easy: [],
        medium: [],
        hard: [],
      };
      field.topicMap.set(chip.topicId, topic);
    }

    topic[chip.difficulty].push(chipWithProf);
  }

  return [...fieldMap.entries()].map(([fieldId, { fieldName, topicMap }]) => ({
    fieldId,
    fieldName,
    topics: [...topicMap.values()],
  }));
}
