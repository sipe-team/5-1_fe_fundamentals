import { useSuspenseQuery } from '@tanstack/react-query';

import { getMembers } from '@/domains/dashboard/apis';

const QUERY_KEY = ['dashboard', 'members'];

export default function useMembers() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY,
    queryFn: getMembers,
  });
}

useMembers.getQueryKeys = () => [...QUERY_KEY];
