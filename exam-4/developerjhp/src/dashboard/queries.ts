import { queryOptions } from '@tanstack/react-query';
import {
  fetchLevels,
  fetchMembers,
  fetchProblemTypes,
  fetchProficiency,
} from './api';

export function membersQueryOptions() {
  return queryOptions({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 3,
  });
}

export function levelsQueryOptions() {
  return queryOptions({
    queryKey: ['levels'],
    queryFn: fetchLevels,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 3,
  });
}

export function problemTypesQueryOptions(levelKey: string) {
  return queryOptions({
    queryKey: ['problemTypes', levelKey],
    queryFn: () => fetchProblemTypes(levelKey),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 3,
  });
}

export function proficiencyQueryOptions(memberId: number, levelKey: string) {
  return queryOptions({
    queryKey: ['proficiency', memberId, levelKey],
    queryFn: () => fetchProficiency(memberId, levelKey),
    retry: 3,
  });
}
