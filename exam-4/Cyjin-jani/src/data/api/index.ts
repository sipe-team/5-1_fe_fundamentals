import type { Level, Member, ProblemTypeChip, Proficiency } from '@/types';
import type { LevelKey } from '@/types';
import { api } from './ky';

export function fetchMembers(): Promise<Member[]> {
  return api.get('members').json<Member[]>();
}

export function fetchLevels(): Promise<Level[]> {
  return api.get('levels').json<Level[]>();
}

export function fetchProblemTypes(
  levelKey: LevelKey,
): Promise<ProblemTypeChip[]> {
  return api
    .get('problem-types', { searchParams: { levelKey } })
    .json<ProblemTypeChip[]>();
}

export function fetchProficiency(
  memberId: number,
  levelKey: LevelKey,
): Promise<Proficiency[]> {
  return api
    .get('proficiency', {
      searchParams: { memberId, levelKey },
    })
    .json<Proficiency[]>();
}
