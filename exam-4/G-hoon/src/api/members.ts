import { queryOptions } from '@tanstack/react-query';
import type { Member } from '@/types';
import { api } from './client';
import { queryKeys } from './queryKeys';

function fetchMembers(): Promise<Member[]> {
  return api.get('members').json<Member[]>();
}

export function membersQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.members(),
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000,
  });
}
