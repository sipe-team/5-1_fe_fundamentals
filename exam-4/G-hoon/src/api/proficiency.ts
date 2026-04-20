import { queryOptions } from '@tanstack/react-query';
import type { Proficiency } from '@/types';
import { api } from './client';

function fetchProficiency(
  memberId: number,
  levelKey: string,
): Promise<Proficiency[]> {
  return api
    .get('proficiency', { searchParams: { memberId, levelKey } })
    .json<Proficiency[]>();
}

export function proficiencyQueryOptions(memberId: number, levelKey: string) {
  return queryOptions({
    queryKey: ['proficiency', memberId, levelKey] as const,
    queryFn: () => fetchProficiency(memberId, levelKey),
  });
}
