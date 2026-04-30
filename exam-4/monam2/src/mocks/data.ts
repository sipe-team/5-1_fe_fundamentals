import levelsJson from '@/data/levels';
import membersJson from '@/data/members';
import problemTypesJson from '@/data/problem-types';
import proficiencyJson from '@/data/proficiency';
import type {
  Level,
  Member,
  ProblemTypeChip,
  Proficiency,
} from '@/shared/types';

export const initialMembers: Member[] = membersJson as Member[];
export const initialLevels: Level[] = levelsJson as Level[];
export const initialProblemTypes: Record<string, ProblemTypeChip[]> =
  problemTypesJson as Record<string, ProblemTypeChip[]>;
export const initialProficiency: Record<string, Proficiency[]> =
  proficiencyJson as Record<string, Proficiency[]>;
