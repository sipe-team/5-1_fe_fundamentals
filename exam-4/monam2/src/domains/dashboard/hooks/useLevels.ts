import { useSuspenseQuery } from '@tanstack/react-query';

import { getLevels } from '@/domains/dashboard/apis';

const QUERY_KEY = ['dashboard', 'levels'];

export default function useLevels() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY,
    queryFn: getLevels,
    select: (data) =>
      data.map((level) => ({ label: level.name, value: level.key })),
  });
}

useLevels.getQueryKeys = () => QUERY_KEY;
