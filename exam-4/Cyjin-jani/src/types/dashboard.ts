export type LevelKey = 'beginner' | 'basic' | 'advanced' | 'expert';

export interface Level {
  key: LevelKey;
  name: string;
}

export interface ProblemTypeChip {
  chipId: number;
  problemTypeId: number;
  problemTypeName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: number;
  topicName: string;
  fieldId: number;
  fieldName: string;
  frequent: boolean;
}

export interface Proficiency {
  chipId: number;
  proficiency: ProficiencyLevel;
}

export type ProficiencyLevel =
  | 'UNSEEN'
  | 'FAILED'
  | 'PARTIAL'
  | 'PASSED'
  | 'MASTERED';

export interface ChipWithProficiency extends ProblemTypeChip {
  proficiency: ProficiencyLevel;
}

export interface TopicRow {
  topicId: number;
  topicName: string;
  easy: ChipWithProficiency[];
  medium: ChipWithProficiency[];
  hard: ChipWithProficiency[];
}

export interface FieldSection {
  fieldId: number;
  fieldName: string;
  topics: TopicRow[];
}

export type ProblemTypeTree = FieldSection[];

export interface FilterState {
  onlyFrequent: boolean;
  selectedProficiencies: ProficiencyLevel[];
}
