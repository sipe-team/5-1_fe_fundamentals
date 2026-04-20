import { queryOptions } from '@tanstack/react-query';
import type { Level } from '@/types';
import { api } from './client';

function fetchLevels(): Promise<Level[]> {
  return api.get('levels').json<Level[]>();
}

export function levelsQueryOptions() {
  return queryOptions({
    queryKey: ['levels'] as const,
    queryFn: fetchLevels,
    staleTime: 5 * 60 * 1000,
  });
}
