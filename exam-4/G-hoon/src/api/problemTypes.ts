import { queryOptions } from '@tanstack/react-query';
import type { ProblemTypeChip } from '@/types';
import { api } from './client';

function fetchProblemTypes(levelKey: string): Promise<ProblemTypeChip[]> {
  return api
    .get('problem-types', { searchParams: { levelKey } })
    .json<ProblemTypeChip[]>();
}

export function problemTypesQueryOptions(levelKey: string) {
  return queryOptions({
    queryKey: ['problem-types', levelKey] as const,
    queryFn: () => fetchProblemTypes(levelKey),
    staleTime: 5 * 60 * 1000,
  });
}
