export type Member = {
  id: number;
  name: string;
};

export type Level = {
  key: string;
  name: string;
};

export type ProblemTypeChip = {
  chipId: number;
  problemTypeId: number;
  problemTypeName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: number;
  topicName: string;
  fieldId: number;
  fieldName: string;
  frequent: boolean;
};

export type Proficiency = {
  chipId: number;
  proficiency: ProficiencyLevel;
};

export type ProficiencyLevel =
  | 'UNSEEN'
  | 'FAILED'
  | 'PARTIAL'
  | 'PASSED'
  | 'MASTERED';

export type ChipWithProficiency = ProblemTypeChip & {
  proficiency: ProficiencyLevel;
};

export type TopicRow = {
  topicId: number;
  topicName: string;
  easy: ChipWithProficiency[];
  medium: ChipWithProficiency[];
  hard: ChipWithProficiency[];
};

export type FieldSection = {
  fieldId: number;
  fieldName: string;
  topics: TopicRow[];
};

export type ProblemTypeTree = FieldSection[];

export type FilterState = {
  onlyFrequent: boolean;
  selectedProficiencies: ProficiencyLevel[];
};
