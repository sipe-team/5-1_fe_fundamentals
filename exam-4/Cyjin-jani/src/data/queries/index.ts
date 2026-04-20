import { queryOptions } from '@tanstack/react-query';
import { fetchLevels, fetchMembers, fetchProblemTypes, fetchProficiency } from '@/data/api';

export function getMembersQueryOptions() {
  return queryOptions({
    queryKey: ['members'] as const,
    queryFn: fetchMembers,
  });
}

export function getLevelsQueryOptions() {
  return queryOptions({
    queryKey: ['levels'] as const,
    queryFn: fetchLevels,
  });
}

export function getProblemTypesQueryOptions(levelKey: string) {
  return queryOptions({
    queryKey: ['problem-types', levelKey] as const,
    queryFn: () => fetchProblemTypes(levelKey),
    enabled: !!levelKey,
  });
}

export function getProficiencyQueryOptions(memberId: number, levelKey: string) {
  return queryOptions({
    queryKey: ['proficiency', memberId, levelKey] as const,
    queryFn: () => fetchProficiency(memberId, levelKey),
    enabled: !!memberId && !!levelKey,
  });
}
