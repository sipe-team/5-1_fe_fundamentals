import { useSuspenseQuery } from '@tanstack/react-query';

import { getProblemTypes } from '@/domains/dashboard/apis';

const QUERY_KEY = (levelKey: string) =>
  ['dashboard', 'problem-types', levelKey] as const;

export default function useProblemType(levelKey: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEY(levelKey),
    queryFn: () => getProblemTypes(levelKey),
  });
}

useProblemType.getQueryKeys = (levelKey: string) => QUERY_KEY(levelKey);
