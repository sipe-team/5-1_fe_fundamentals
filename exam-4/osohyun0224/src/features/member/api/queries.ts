import { useSuspenseQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Member } from '@/types';

export function useMembers() {
  return useSuspenseQuery({
    queryKey: queryKeys.members,
    queryFn: () => http<Member[]>('/api/members'),
  });
}
