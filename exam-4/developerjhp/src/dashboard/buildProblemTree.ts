import type {
  ChipWithProficiency,
  ProblemTypeChip,
  ProblemTypeTree,
  Proficiency,
  ProficiencyLevel,
  TopicRow,
} from '@/types';

const DEFAULT_PROFICIENCY: ProficiencyLevel = 'UNSEEN';

export function buildProblemTree(
  chips: ProblemTypeChip[],
  proficiencyList: Proficiency[],
): ProblemTypeTree {
  const proficiencyMap = new Map(
    proficiencyList.map((p) => [p.chipId, p.proficiency]),
  );

  const fieldMap = new Map<
    number,
    {
      fieldName: string;
      topicMap: Map<
        number,
        { topicName: string; chips: ChipWithProficiency[] }
      >;
    }
  >();

  for (const chip of chips) {
    const enriched: ChipWithProficiency = {
      ...chip,
      proficiency: proficiencyMap.get(chip.chipId) ?? DEFAULT_PROFICIENCY,
    };

    let field = fieldMap.get(chip.fieldId);
    if (!field) {
      field = { fieldName: chip.fieldName, topicMap: new Map() };
      fieldMap.set(chip.fieldId, field);
    }

    let topic = field.topicMap.get(chip.topicId);
    if (!topic) {
      topic = { topicName: chip.topicName, chips: [] };
      field.topicMap.set(chip.topicId, topic);
    }

    topic.chips.push(enriched);
  }

  const tree: ProblemTypeTree = [];

  for (const [fieldId, field] of fieldMap) {
    const topics: TopicRow[] = [];

    for (const [topicId, topic] of field.topicMap) {
      topics.push({ topicId, topicName: topic.topicName, chips: topic.chips });
    }

    tree.push({ fieldId, fieldName: field.fieldName, topics });
  }

  return tree;
}
