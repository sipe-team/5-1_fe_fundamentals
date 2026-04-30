export type Member = {
  id: number;
  name: string;
};

export type ApiErrorResponse = {
  error: string;
  message: string;
};

export type Level = {
  key: string;
  name: string;
};

export type LevelOption = {
  label: string;
  value: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export type ProblemTypeChip = {
  chipId: number;
  problemTypeId: number;
  problemTypeName: string;
  difficulty: Difficulty;
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
  | "UNSEEN"
  | "FAILED"
  | "PARTIAL"
  | "PASSED"
  | "MASTERED";

export type ChipWithProficiency = ProblemTypeChip & {
  proficiency: ProficiencyLevel;
};

export type TopicSection = {
  topicId: number;
  topicName: string;
  chips: ChipWithProficiency[];
};

export type FieldSection = {
  fieldId: number;
  fieldName: string;
  topics: TopicSection[];
};

export type ProblemTypeTree = FieldSection[];

export type FilterState = {
  onlyFrequent: boolean;
  selectedProficiencies: ProficiencyLevel[];
};
