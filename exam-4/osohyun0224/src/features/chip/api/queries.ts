import { useSuspenseQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Level, ProblemTypeChip, Proficiency } from '@/types';

export function useLevels() {
  return useSuspenseQuery({
    queryKey: queryKeys.levels,
    queryFn: () => http<Level[]>('/api/levels'),
  });
}

export function useProblemTypes(levelKey: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.problemTypes(levelKey),
    queryFn: () =>
      http<ProblemTypeChip[]>(
        `/api/problem-types?levelKey=${encodeURIComponent(levelKey)}`,
      ),
  });
}

export function useProficiency(memberId: number, levelKey: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.proficiency(memberId, levelKey),
    queryFn: () =>
      http<Proficiency[]>(
        `/api/proficiency?memberId=${memberId}&levelKey=${encodeURIComponent(levelKey)}`,
      ),
  });
}
