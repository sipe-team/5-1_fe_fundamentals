import type {
  Level,
  Member,
  ProblemTypeChip,
  Proficiency,
} from "@/shared/types";
import levelsJson from "@/shared/levels";
import membersJson from "@/shared/members";
import problemTypesJson from "@/shared/problem-types";
import proficiencyJson from "@/shared/proficiency";

export const initialMembers: Member[] = membersJson as Member[];
export const initialLevels: Level[] = levelsJson as Level[];
export const initialProblemTypes: Record<string, ProblemTypeChip[]> =
  problemTypesJson as Record<string, ProblemTypeChip[]>;
export const initialProficiency: Record<string, Proficiency[]> =
  proficiencyJson as Record<string, Proficiency[]>;
