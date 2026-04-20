import { queryOptions } from '@tanstack/react-query';
import type { ProblemTypeChip } from '@/types';
import { api } from './client';
import { queryKeys } from './queryKeys';

function fetchProblemTypes(levelKey: string): Promise<ProblemTypeChip[]> {
  return api
    .get('problem-types', { searchParams: { levelKey } })
    .json<ProblemTypeChip[]>();
}

export function problemTypesQueryOptions(levelKey: string) {
  return queryOptions({
    queryKey: queryKeys.problemTypes(levelKey),
    queryFn: () => fetchProblemTypes(levelKey),
    staleTime: 5 * 60 * 1000,
  });
}
